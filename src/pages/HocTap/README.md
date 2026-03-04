# Ứng dụng Quản lý Tiến độ Học tập

Ứng dụng giúp theo dõi và quản lý tiến độ học tập các môn học, thiết lập mục tiêu học tập hàng tháng.

## Tính năng

### 1. Quản lý Danh mục Môn học
- **Thêm môn học**: Cho phép thêm các môn học (Toán, Văn, Anh, Khoa học, Công nghệ, hoặc tùy chỉnh)
- **Sửa môn học**: Cập nhật tên môn học
- **Xóa môn học**: Xóa môn học khỏi danh sách

### 2. Quản lý Tiến độ Học tập
- **Thêm tiến độ**: Ghi lại thông tin học tập gồm:
  - Môn học
  - Ngày học (ngày, giờ)
  - Thời lượng học (giờ)
  - Nội dung đã học
  - Ghi chú (tùy chọn)
- **Sửa tiến độ**: Cập nhật thông tin học tập đã ghi
- **Xóa tiến độ**: Xóa bản ghi tiến độ

### 3. Thiết lập Mục tiêu Học tập Hàng tháng
- **Thêm mục tiêu**: Đặt mục tiêu học tập cho từng môn và tháng
- **Sửa mục tiêu**: Cập nhật thời gian học mục tiêu
- **Xóa mục tiêu**: Xóa mục tiêu đã đặt
- **Theo dõi tiến độ**: Hiển thị thanh tiến độ để:
  - So sánh giữa thời gian học thực tế và mục tiêu
  - Hiển thị trạng thái: đạt, sắp đạt, chưa đạt

## Dữ liệu lưu trữ
- Tất cả dữ liệu được lưu trữ trong **localStorage** trên trình duyệt
- Dữ liệu được giữ lại khi tắt và mở lại ứng dụng
- Mỗi trình duyệt/thiết bị có dữ liệu riêng biệt
