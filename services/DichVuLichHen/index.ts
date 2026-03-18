import { Staff, Service, Appointment, Review } from '../../models/DichVuLichHen';

// Quản lý nhân viên
export const staffService = {
  create: (data: Omit<Staff, 'id' | 'createdAt'>) => ({
    id: Date.now().toString(),
    ...data,
    createdAt: new Date(),
  }),
  
  isAvailable: (staff: Staff, dateTime: Date, duration: number) => {
    const dayOfWeek = dateTime.getDay();
    const schedule = staff.schedule.find(s => s.dayOfWeek === dayOfWeek);
    if (!schedule) return false;
    
    const [startH, startM] = schedule.startTime.split(':').map(Number);
    const [endH, endM] = schedule.endTime.split(':').map(Number);
    const start = startH * 60 + startM;
    const end = endH * 60 + endM;
    const time = dateTime.getHours() * 60 + dateTime.getMinutes();
    const timeEnd = time + duration;
    
    return time >= start && timeEnd <= end;
  },
  
  getCustomerCount: (staffId: string, date: Date, appointments: Appointment[]) => 
    appointments.filter(a => 
      a.staffId === staffId && 
      a.status !== 'cancelled' &&
      new Date(a.dateTime).toDateString() === date.toDateString()
    ).length,
};

// Quản lý lịch hẹn
export const appointmentService = {
  canBook: (
    staffId: string,
    dateTime: Date,
    duration: number,
    staff: Staff,
    appointments: Appointment[]
  ) => {
    // Kiểm tra nhân viên có lịch không
    if (!staffService.isAvailable(staff, dateTime, duration)) return false;
    
    // Kiểm tra số khách tối đa
    const count = staffService.getCustomerCount(staffId, dateTime, appointments);
    if (count >= staff.maxCustomersPerDay) return false;
    
    // Kiểm tra trùng lịch
    const conflicting = appointments.find(a => {
      if (a.staffId !== staffId || a.status === 'cancelled') return false;
      const aStart = new Date(a.dateTime).getTime();
      const aEnd = aStart + (a.totalPrice / 1000) * 60000; // estimation
      const bStart = dateTime.getTime();
      const bEnd = bStart + duration * 60000;
      return aStart < bEnd && aEnd > bStart;
    });
    
    return !conflicting;
  },
  
  create: (data: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => ({
    id: Date.now().toString(),
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
};

// Quản lý đánh giá
export const reviewService = {
  getAverageRating: (staffId: string, reviews: Review[]) => {
    const staffReviews = reviews.filter(r => r.staffId === staffId);
    if (!staffReviews.length) return 0;
    const total = staffReviews.reduce((sum, r) => sum + r.rating, 0);
    return (total / staffReviews.length).toFixed(1);
  },
};

// Thống kê
export const statisticsService = {
  getByDate: (date: Date, appointments: Appointment[], services: Service[]) => {
    const dateStr = date.toDateString();
    const dayAppts = appointments.filter(a => 
      new Date(a.dateTime).toDateString() === dateStr
    );
    
    const byService: Record<string, { count: number; revenue: number }> = {};
    const byStaff: Record<string, { count: number; revenue: number }> = {};
    
    dayAppts.forEach(a => {
      if (!byService[a.serviceId]) byService[a.serviceId] = { count: 0, revenue: 0 };
      if (!byStaff[a.staffId]) byStaff[a.staffId] = { count: 0, revenue: 0 };
      
      if (a.status === 'completed') {
        byService[a.serviceId].count++;
        byService[a.serviceId].revenue += a.totalPrice;
        byStaff[a.staffId].count++;
        byStaff[a.staffId].revenue += a.totalPrice;
      }
    });
    
    const totalRevenue = Object.values(byService).reduce((sum, s) => sum + s.revenue, 0);
    
    return {
      date,
      totalAppointments: dayAppts.length,
      completedAppointments: dayAppts.filter(a => a.status === 'completed').length,
      totalRevenue,
      byService: Object.entries(byService).map(([serviceId, data]) => ({ serviceId, ...data })),
      byStaff: Object.entries(byStaff).map(([staffId, data]) => ({ staffId, ...data })),
    };
  },
};
