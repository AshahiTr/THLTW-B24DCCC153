import React, { useState } from 'react';
import { DatePicker, Button, Table, Statistic, Row, Col, Card } from 'antd';
import { Appointment, Service, Staff, Review } from '../../../models/DichVuLichHen';
import { statisticsService } from '../../../services/DichVuLichHen';
import dayjs from 'dayjs';

// Mock data
const mockServices: Service[] = [
  { id: '1', name: 'Cắt tóc', description: 'Cắt tóc cơ bản', price: 100000, duration: 30, createdAt: new Date() },
  { id: '2', name: 'Massage', description: 'Massage toàn thân', price: 200000, duration: 60, createdAt: new Date() },
  { id: '3', name: 'Spa', description: 'Chăm sóc da', price: 250000, duration: 90, createdAt: new Date() },
];

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
    staffId: '2', serviceId: '3', dateTime: new Date(), status: 'completed',
    notes: 'Khách VIP', totalPrice: 250000, createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: '4', customerId: 'cus_004', customerName: 'Khách D', customerPhone: '0444444444',
    staffId: '2', serviceId: '2', dateTime: new Date(), status: 'confirmed',
    notes: '', totalPrice: 200000, createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: '5', customerId: 'cus_005', customerName: 'Khách E', customerPhone: '0555555555',
    staffId: '1', serviceId: '1', dateTime: new Date(), status: 'pending',
    notes: 'Lần đầu', totalPrice: 100000, createdAt: new Date(), updatedAt: new Date(),
  },
];

interface StatisticsPageProps {
  appointments?: Appointment[];
  services?: Service[];
  staff?: Staff[];
}

const StatisticsPage: React.FC<StatisticsPageProps> = ({ 
  appointments = mockAppointments, 
  services = mockServices, 
  staff = mockStaff 
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const stats = statisticsService.getByDate(selectedDate, appointments, services);

  const serviceColumns = [
    { title: 'Dịch vụ', key: 'serviceId', render: (_, r: any) => services.find(s => s.id === r.serviceId)?.name },
    { title: 'Số lượng', dataIndex: 'count', key: 'count' },
    { title: 'Doanh thu', dataIndex: 'revenue', key: 'revenue', render: (r: number) => `${r.toLocaleString()}đ` },
  ];

  const staffColumns = [
    { title: 'Nhân viên', key: 'staffId', render: (_, r: any) => staff.find(s => s.id === r.staffId)?.name },
    { title: 'Số lượng', dataIndex: 'count', key: 'count' },
    { title: 'Doanh thu', dataIndex: 'revenue', key: 'revenue', render: (r: number) => `${r.toLocaleString()}đ` },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h2>Thống Kê & Báo Cáo</h2>
      
      <div style={{ marginBottom: 20, display: 'flex', gap: 10, alignItems: 'center' }}>
        <span>Chọn ngày:</span>
        <DatePicker value={dayjs(selectedDate)} onChange={(d) => setSelectedDate(d?.toDate() || new Date())} />
        <Button onClick={() => setSelectedDate(new Date())}>Hôm nay</Button>
      </div>

      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={6}>
          <Card>
            <Statistic title="Tổng lịch hẹn" value={stats.totalAppointments} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Hoàn thành" value={stats.completedAppointments} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="Tỷ lệ hoàn thành" 
              value={(stats.totalAppointments > 0 ? (stats.completedAppointments / stats.totalAppointments * 100) : 0).toFixed(1)} 
              suffix="%" 
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="Doanh thu" 
              value={stats.totalRevenue} 
              suffix="đ"
              precision={0}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Thống Kê Theo Dịch Vụ" style={{ marginBottom: 20 }}>
        {stats.byService.length > 0 ? (
          <Table columns={serviceColumns} dataSource={stats.byService} rowKey="serviceId" pagination={false} />
        ) : (
          <p style={{ color: '#999' }}>Không có dữ liệu</p>
        )}
      </Card>

      <Card title="Thống Kê Theo Nhân Viên">
        {stats.byStaff.length > 0 ? (
          <Table columns={staffColumns} dataSource={stats.byStaff} rowKey="staffId" pagination={false} />
        ) : (
          <p style={{ color: '#999' }}>Không có dữ liệu</p>
        )}
      </Card>
    </div>
  );
};

export default StatisticsPage;
