# Hệ Thống Đặt Lịch Hẹn Dịch Vụ

## Cấu Trúc Thư Mục

```
models/DichVuLichHen/
  └── index.ts          # Data models & interfaces

services/DichVuLichHen/
  └── index.ts          # Business logic services

src/pages/DichVuLichHen/
  ├── index.tsx         # Trang chính (Dashboard)
  ├── Booking.tsx       # Trang đặt lịch hẹn
  ├── StaffManagement.tsx # Quản lý nhân viên
  ├── ServiceManagement.tsx # Quản lý dịch vụ
  ├── ReviewManagement.tsx # Quản lý đánh giá
  └── Statistics.tsx    # Thống kê báo cáo
```

## Các Model Chính

### Staff (Nhân Viên)
```typescript
{
  id: string;
  name: string;
  phone: string;
  services: string[]; // danh sách ID dịch vụ
  schedule: { dayOfWeek: number; startTime: string; endTime: string }[];
  maxCustomersPerDay: number;
  rating: number;
  createdAt: Date;
}
```

### Service (Dịch Vụ)
```typescript
{
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // phút
  createdAt: Date;
}
```

### Appointment (Lịch Hẹn)
```typescript
{
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  staffId: string;
  serviceId: string;
  dateTime: Date;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes: string;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### Review (Đánh Giá)
```typescript
{
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
```

## Các Dịch Vụ Chính

### staffService
- `create()` - Tạo nhân viên mới
- `isAvailable()` - Kiểm tra nhân viên có khả dụng vào thời gian đó
- `getCustomerCount()` - Đếm số khách đã đặt trong ngày

### appointmentService
- `canBook()` - Kiểm tra có thể đặt lịch (kiểm tra trùng, giới hạn khách, lịch làm việc)
- `create()` - Tạo lịch hẹn mới

### reviewService
- `getAverageRating()` - Tính điểm đánh giá trung bình của nhân viên

### statisticsService
- `getByDate()` - Thống kê theo ngày (doanh thu, số lượng theo dịch vụ/nhân viên)

## Độc Lập Tính Năng

✅ Quản lý nhân viên (thêm/sửa/xóa)
✅ Quản lý dịch vụ (thêm/sửa/xóa)
✅ Đặt lịch hẹn với kiểm tra lịch trùng
✅ Cập nhật trạng thái lịch hẹn
✅ Đánh giá & phản hồi
✅ Thống kê doanh thu & lịch hẹn

## Sử Dụng

Import trang chính:
```typescript
import DichVuLichHenIndex from '@/pages/DichVuLichHen';
```

Thêm route:
```typescript
routes: [
  { path: '/dichvulichhen', component: DichVuLichHenIndex }
]
```
