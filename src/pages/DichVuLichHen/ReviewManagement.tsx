import React, { useState } from 'react';
import { Table, Rate, Button, Modal, Input, Space, Tag, Avatar } from 'antd';
import { Review, Staff } from '../../../models/DichVuLichHen';

interface ReviewManagementProps {
  reviews?: Review[];
  staff?: Staff[];
}

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

const mockReviews: Review[] = [
  {
    id: '1', appointmentId: '1', customerId: 'cus_001', staffId: '1',
    rating: 5, comment: 'Dịch vụ rất tốt, nhân viên thân thiện', staffReply: 'Cảm ơn bạn đã tin tưởng!',
    createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: '2', appointmentId: '2', customerId: 'cus_002', staffId: '1',
    rating: 4, comment: 'Cắt tóc đẹp nhưng thời gian chờ hơi lâu', staffReply: undefined,
    createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: '3', appointmentId: '3', customerId: 'cus_003', staffId: '2',
    rating: 5, comment: 'Massage thư giãn tuyệt vời!', staffReply: 'Rất vui vì bạn hài lòng!',
    createdAt: new Date(), updatedAt: new Date(),
  },
];

const ReviewManagement: React.FC<ReviewManagementProps> = ({ 
  reviews = mockReviews, 
  staff = mockStaff 
}) => {
  const [replyModal, setReplyModal] = useState<{ visible: boolean; reviewId?: string; reply?: string }>({ visible: false });
  const [reviewList, setReviewList] = useState(reviews);

  const handleReply = (reviewId: string, reply: string) => {
    setReviewList(reviewList.map(r => r.id === reviewId ? { ...r, staffReply: reply } : r));
    setReplyModal({ visible: false });
  };

  const columns = [
    {
      title: 'Nhân viên',
      dataIndex: 'staffId',
      key: 'staffId',
      render: (id: string) => {
        const s = staff.find(st => st.id === id);
        return <Space><Avatar>{s?.name.charAt(0)}</Avatar>{s?.name}</Space>;
      },
    },
    {
      title: 'Đánh giá',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating: number) => <Rate disabled value={rating} />,
    },
    { title: 'Bình luận', dataIndex: 'comment', key: 'comment', width: 300 },
    {
      title: 'Phản hồi',
      dataIndex: 'staffReply',
      key: 'staffReply',
      render: (reply: string) => reply ? <Tag color="green">{reply}</Tag> : <Tag>Chưa phản hồi</Tag>,
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record: Review) => (
        <Button size="small" onClick={() => setReplyModal({ visible: true, reviewId: record.id, reply: record.staffReply || '' })}>
          {record.staffReply ? 'Cập nhật' : 'Phản hồi'}
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h2>Quản Lý Đánh Giá & Phản Hồi</h2>
      <Table columns={columns} dataSource={reviewList} rowKey="id" />

      <Modal
        title="Phản Hồi Đánh Giá"
        open={replyModal.visible}
        onCancel={() => setReplyModal({ visible: false })}
        onOk={() => handleReply(replyModal.reviewId!, replyModal.reply || '')}
      >
        <Input.TextArea
          rows={4}
          placeholder="Viết phản hồi..."
          value={replyModal.reply}
          onChange={(e) => setReplyModal({ ...replyModal, reply: e.target.value })}
        />
      </Modal>
    </div>
  );
};

export default ReviewManagement;
