import React, { useState, useEffect } from 'react';
import { Form, Button, Select, DatePicker, TimePicker, Input, Table, Space, Tag, Modal, Rate, message } from 'antd';
import { Staff, Service, Appointment, Review } from '../../../models/DichVuLichHen';
import { appointmentService, reviewService } from '../../../services/DichVuLichHen';
import dayjs from 'dayjs';

// Mock data
const mockStaff: Staff[] = [
  {
    id: '1', name: 'Nhân viên A', phone: '0123456789', services: ['1', '2'],
    schedule: [
      { dayOfWeek: 1, startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: 2, startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: 3, startTime: '09:00', endTime: '17:00' },
    ],
    maxCustomersPerDay: 5, rating: 4.5, createdAt: new Date(),
  },
  {
    id: '2', name: 'Nhân viên B', phone: '0987654321', services: ['2', '3'],
    schedule: [
      { dayOfWeek: 1, startTime: '09:00', endTime: '18:00' },
      { dayOfWeek: 2, startTime: '09:00', endTime: '18:00' },
      { dayOfWeek: 3, startTime: '09:00', endTime: '18:00' },
    ],
    maxCustomersPerDay: 6, rating: 4.8, createdAt: new Date(),
  },
];

const mockServices: Service[] = [
  { id: '1', name: 'Cắt tóc', description: 'Cắt tóc cơ bản', price: 100000, duration: 30, createdAt: new Date() },
  { id: '2', name: 'Massage', description: 'Massage toàn thân', price: 200000, duration: 60, createdAt: new Date() },
  { id: '3', name: 'Spa', description: 'Chăm sóc da', price: 250000, duration: 90, createdAt: new Date() },
];

const mockAppointments: Appointment[] = [
  {
    id: '1', customerId: 'cus_001', customerName: 'Khách A', customerPhone: '0111111111',
    staffId: '1', serviceId: '1', dateTime: new Date(), status: 'completed',
    notes: 'Cắt tóc thường xuyên', totalPrice: 100000, createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: '2', customerId: 'cus_002', customerName: 'Khách B', customerPhone: '0222222222',
    staffId: '1', serviceId: '2', dateTime: new Date(), status: 'completed',
    notes: '', totalPrice: 200000, createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: '3', customerId: 'cus_003', customerName: 'Khách C', customerPhone: '0333333333',
    staffId: '2', serviceId: '3', dateTime: new Date(), status: 'confirmed',
    notes: 'Khách VIP', totalPrice: 250000, createdAt: new Date(), updatedAt: new Date(),
  },
];

const AppointmentBooking: React.FC = () => {
  const [form] = Form.useForm();
  const [reviewForm] = Form.useForm();
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [staffList] = useState(mockStaff);
  const [serviceList] = useState(mockServices);
  const [reviewModal, setReviewModal] = useState<{ visible: boolean; appointmentId?: string }>({ visible: false });

  const handleBook = async (values: any) => {
    const service = serviceList.find(s => s.id === values.serviceId);
    const staff = staffList.find(s => s.id === values.staffId);

    if (!service || !staff) return message.error('Dữ liệu không hợp lệ');

    const dateTime = values.date.toDate();
    dateTime.setHours(values.time.hour(), values.time.minute());

    const canBook = appointmentService.canBook(
      values.staffId,
      dateTime,
      service.duration,
      staff,
      appointments
    );

    if (!canBook) {
      return message.error('Lịch không khả dụng hoặc trùng lịch');
    }

    const newAppt = appointmentService.create({
      customerId: 'cus_' + Date.now(),
      customerName: values.customerName,
      customerPhone: values.customerPhone,
      staffId: values.staffId,
      serviceId: values.serviceId,
      dateTime,
      status: 'pending',
      notes: values.notes || '',
      totalPrice: service.price,
    });

    setAppointments([...appointments, newAppt]);
    form.resetFields();
    message.success('Đặt lịch thành công!');
  };

  const columns = [
    { title: 'Khách hàng', dataIndex: 'customerName', key: 'customerName' },
    { title: 'Dịch vụ', dataIndex: 'serviceId', key: 'serviceId', render: (id: string) => serviceList.find(s => s.id === id)?.name },
    { title: 'Nhân viên', dataIndex: 'staffId', key: 'staffId', render: (id: string) => staffList.find(s => s.id === id)?.name },
    {
      title: 'Thời gian', dataIndex: 'dateTime', key: 'dateTime',
      render: (time: Date) => dayjs(time).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Trạng thái', dataIndex: 'status', key: 'status',
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          pending: 'gold',
          confirmed: 'blue',
          completed: 'green',
          cancelled: 'red',
        };
        return <Tag color={colorMap[status] || 'default'}>{status}</Tag>;
      },
    },
    {
      title: 'Hành động', key: 'action',
      render: (_, record: Appointment) => (
        <Space wrap>
          {record.status === 'pending' && (
            <Button size="small" type="primary" onClick={() => 
              setAppointments(appointments.map(a => a.id === record.id ? { ...a, status: 'confirmed' as const } : a))
            }>Xác nhận</Button>
          )}
          {record.status === 'confirmed' && (
            <Button size="small" type="primary" onClick={() => 
              setAppointments(appointments.map(a => a.id === record.id ? { ...a, status: 'completed' as const } : a))
            }>Hoàn thành</Button>
          )}
          {record.status === 'completed' && !reviews.find(r => r.appointmentId === record.id) && (
            <Button size="small" onClick={() => setReviewModal({ visible: true, appointmentId: record.id })}>Đánh giá</Button>
          )}
          {record.status !== 'completed' && record.status !== 'cancelled' && (
            <Button size="small" danger onClick={() => 
              setAppointments(appointments.map(a => a.id === record.id ? { ...a, status: 'cancelled' as const } : a))
            }>Hủy</Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h2>Đặt Lịch Hẹn</h2>
      <Form form={form} onFinish={handleBook} layout="vertical" style={{ maxWidth: 500 }}>
        <Form.Item label="Tên khách hàng" name="customerName" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Số điện thoại" name="customerPhone" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Dịch vụ" name="serviceId" rules={[{ required: true }]}>
          <Select options={serviceList.map(s => ({ label: `${s.name} - ${s.price}đ`, value: s.id }))} />
        </Form.Item>
        <Form.Item label="Nhân viên" name="staffId" rules={[{ required: true }]}>
          <Select options={staffList.map(s => ({ label: `${s.name} (${s.rating}⭐)`, value: s.id }))} />
        </Form.Item>
        <Form.Item label="Ngày" name="date" rules={[
          { required: true, message: 'Vui lòng chọn ngày' },
          {
            validator: (_, value) => {
              if (value && value.toDate() < new Date()) {
                return Promise.reject('Ngày phải sau hôm nay');
              }
              return Promise.resolve();
            },
          },
        ]}>
          <DatePicker style={{ width: '100%' }} disabledDate={(current) => current && current < dayjs().startOf('day')} />
        </Form.Item>
        <Form.Item label="Giờ" name="time" rules={[{ required: true }]}>
          <TimePicker format="HH:mm" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="Ghi chú" name="notes">
          <Input.TextArea rows={3} />
        </Form.Item>
        <Button type="primary" htmlType="submit">Đặt Lịch</Button>
      </Form>

      <h3 style={{ marginTop: 30 }}>Danh Sách Lịch Hẹn</h3>
      <Table columns={columns} dataSource={appointments} rowKey="id" />

      <Modal
        title="Đánh Giá Dịch Vụ"
        open={reviewModal.visible}
        onCancel={() => {
          setReviewModal({ visible: false });
          reviewForm.resetFields();
        }}
        onOk={() => {
          reviewForm.validateFields().then((values) => {
            const appointment = appointments.find(a => a.id === reviewModal.appointmentId);
            if (appointment) {
              setReviews([...reviews, {
                id: Date.now().toString(),
                appointmentId: reviewModal.appointmentId!,
                customerId: appointment.customerId,
                staffId: appointment.staffId,
                rating: values.rating,
                comment: values.comment,
                createdAt: new Date(),
                updatedAt: new Date(),
              }]);
              setReviewModal({ visible: false });
              reviewForm.resetFields();
              message.success('Cảm ơn bạn đã đánh giá!');
            }
          });
        }}
      >
        <Form form={reviewForm} layout="vertical">
          <Form.Item label="Đánh giá" name="rating" rules={[{ required: true, message: 'Vui lòng chọn đánh giá' }]}>
            <Rate />
          </Form.Item>
          <Form.Item label="Nhận xét" name="comment" rules={[{ required: true, message: 'Vui lòng nhập nhận xét' }]}>
            <Input.TextArea rows={3} placeholder="Chia sẻ trải nghiệm của bạn..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AppointmentBooking;
