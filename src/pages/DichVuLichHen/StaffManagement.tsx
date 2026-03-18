import React, { useState } from 'react';
import { Form, Button, Input, InputNumber, Table, Space, Modal, Tag, Select, TimePicker } from 'antd';
import { Staff, Service } from '../../../models/DichVuLichHen';
import { staffService } from '../../../services/DichVuLichHen';

const mockServices: Service[] = [
  { id: '1', name: 'Cắt tóc', description: 'Cắt tóc cơ bản', price: 100000, duration: 30, createdAt: new Date() },
  { id: '2', name: 'Massage', description: 'Massage toàn thân', price: 200000, duration: 60, createdAt: new Date() },
  { id: '3', name: 'Spa', description: 'Chăm sóc da', price: 250000, duration: 90, createdAt: new Date() },
];

const mockStaffList: Staff[] = [
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

const StaffManagement: React.FC = () => {
  const [form] = Form.useForm();
  const [staffList, setStaffList] = useState<Staff[]>(mockStaffList);
  const [modal, setModal] = useState({ visible: false, editing: false, id: '' });

  const handleAdd = (values: any) => {
    const newStaff = staffService.create({
      name: values.name,
      phone: values.phone,
      services: values.services || [],
      schedule: values.schedule || [],
      maxCustomersPerDay: values.maxCustomersPerDay,
      rating: 0,
    });
    setStaffList([...staffList, newStaff]);
    form.resetFields();
    setModal({ visible: false, editing: false, id: '' });
  };

  const columns = [
    { title: 'Tên', dataIndex: 'name', key: 'name' },
    { title: 'SĐT', dataIndex: 'phone', key: 'phone' },
    { title: 'Dịch vụ', dataIndex: 'services', key: 'services', render: (ids: string[]) => ids.map(id => mockServices.find(s => s.id === id)?.name).join(', ') },
    { title: 'Tối đa KH/ngày', dataIndex: 'maxCustomersPerDay', key: 'maxCustomersPerDay' },
    { title: 'Đánh giá', dataIndex: 'rating', key: 'rating', render: (r: number) => `${r}⭐` },
    {
      title: 'Hành động', key: 'action',
      render: (_, record: Staff) => (
        <Space>
          <Button size="small" onClick={() => { form.setFieldsValue(record); setModal({ visible: true, editing: true, id: record.id }); }}>Sửa</Button>
          <Button size="small" danger onClick={() => setStaffList(staffList.filter(s => s.id !== record.id))}>Xóa</Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Space style={{ marginBottom: 20 }}>
        <h2>Quản Lý Nhân Viên</h2>
        <Button type="primary" onClick={() => { form.resetFields(); setModal({ visible: true, editing: false, id: '' }); }}>+ Thêm Nhân Viên</Button>
      </Space>

      <Table columns={columns} dataSource={staffList} rowKey="id" />

      <Modal
        title={modal.editing ? 'Cập Nhật Nhân Viên' : 'Thêm Nhân Viên'}
        open={modal.visible}
        onCancel={() => setModal({ visible: false, editing: false, id: '' })}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={handleAdd} layout="vertical">
          <Form.Item label="Tên" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="SĐT" name="phone" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Dịch vụ" name="services">
            <Select mode="multiple" options={mockServices.map(s => ({ label: s.name, value: s.id }))} />
          </Form.Item>
          <Form.Item label="Tối đa KH/ngày" name="maxCustomersPerDay" rules={[{ required: true }]}>
            <InputNumber min={1} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StaffManagement;
