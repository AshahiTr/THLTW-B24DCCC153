import React from 'react';
import { Tabs, Card, Row, Col, Statistic } from 'antd';
import { CalendarOutlined, UserOutlined, ServiceOutlined, StarOutlined } from '@ant-design/icons';
import { Appointment, Service, Staff } from '../../../models/DichVuLichHen';
import AppointmentBooking from './Booking';
import StaffManagement from './StaffManagement';
import ServiceManagement from './ServiceManagement';
import ReviewManagement from './ReviewManagement';
import StatisticsPage from './Statistics';

// Mock data cho Dashboard
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

const mockStaff: Staff[] = [
  {
    id: '1', name: 'Nhân viên A', phone: '0123456789', services: ['1', '2'],
    schedule: [
      { dayOfWeek: 1, startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: 2, startTime: '09:00', endTime: '17:00' },
    ],
    maxCustomersPerDay: 5, rating: 4.5, createdAt: new Date(),
  },
  {
    id: '2', name: 'Nhân viên B', phone: '0987654321', services: ['2', '3'],
    schedule: [
      { dayOfWeek: 1, startTime: '09:00', endTime: '18:00' },
      { dayOfWeek: 2, startTime: '09:00', endTime: '18:00' },
    ],
    maxCustomersPerDay: 6, rating: 4.8, createdAt: new Date(),
  },
];

const mockServices: Service[] = [
  { id: '1', name: 'Cắt tóc', description: 'Cắt tóc cơ bản', price: 100000, duration: 30, createdAt: new Date() },
  { id: '2', name: 'Massage', description: 'Massage toàn thân', price: 200000, duration: 60, createdAt: new Date() },
  { id: '3', name: 'Spa', description: 'Chăm sóc da', price: 250000, duration: 90, createdAt: new Date() },
];

const DichVuLichHenIndex: React.FC = () => {
  const tabItems = [
    {
      key: '1',
      label: 'Đặt Lịch Hẹn',
      icon: <CalendarOutlined />,
      children: <AppointmentBooking />,
    },
    {
      key: '2',
      label: 'Quản Lý Nhân Viên',
      icon: <UserOutlined />,
      children: <StaffManagement />,
    },
    {
      key: '3',
      label: 'Quản Lý Dịch Vụ',
      icon: <ServiceOutlined />,
      children: <ServiceManagement />,
    },
    {
      key: '4',
      label: 'Đánh Giá & Phản Hồi',
      icon: <StarOutlined />,
      children: <ReviewManagement />,
    },
    {
      key: '5',
      label: 'Thống Kê & Báo Cáo',
      icon: <CalendarOutlined />,
      children: <StatisticsPage />,
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Card style={{ marginBottom: 20, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <Row gutter={16}>
          <Col span={8}>
            <Statistic title="Tổng Lịch Hẹn" value={mockAppointments.length} valueStyle={{ color: 'white' }} />
          </Col>
          <Col span={8}>
            <Statistic title="Nhân Viên" value={mockStaff.length} valueStyle={{ color: 'white' }} />
          </Col>
          <Col span={8}>
            <Statistic title="Dịch Vụ" value={mockServices.length} valueStyle={{ color: 'white' }} />
          </Col>
        </Row>
      </Card>

      <Tabs items={tabItems} />
    </div>
  );
};

export default DichVuLichHenIndex;
