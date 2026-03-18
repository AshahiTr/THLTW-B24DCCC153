// Nhân viên
export interface Staff {
  id: string;
  name: string;
  phone: string;
  services: string[]; // danh sách dịch vụ
  schedule: {
    dayOfWeek: number; // 0-6
    startTime: string; // "09:00"
    endTime: string; // "17:00"
  }[];
  maxCustomersPerDay: number;
  rating: number;
  createdAt: Date;
}

// Dịch vụ
export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // phút
  createdAt: Date;
}

// Lịch hẹn
export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  staffId: string;
  serviceId: string;
  dateTime: Date;
  status: AppointmentStatus;
  notes: string;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

// Đánh giá
export interface Review {
  id: string;
  appointmentId: string;
  customerId: string;
  staffId: string;
  rating: number; // 1-5
  comment: string;
  staffReply?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Thống kê
export interface Statistics {
  date: Date;
  totalAppointments: number;
  completedAppointments: number;
  totalRevenue: number;
  byService: { serviceId: string; count: number; revenue: number }[];
  byStaff: { staffId: string; count: number; revenue: number }[];
}
