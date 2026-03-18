import React, { useState } from 'react';
import { Form, Button, Input, InputNumber, Table, Space, Modal, message } from 'antd';
import { Service } from '../../../models/DichVuLichHen';

const ServiceManagement: React.FC = () => {
  const [form] = Form.useForm();
  const [serviceList, setServiceList] = useState<Service[]>([
    { id: '1', name: 'Cắt tóc', description: 'Cắt tóc cơ bản', price: 100000, duration: 30, createdAt: new Date() },
    { id: '2', name: 'Massage', description: 'Massage toàn thân', price: 200000, duration: 60, createdAt: new Date() },
    { id: '3', name: 'Spa', description: 'Chăm sóc da', price: 250000, duration: 90, createdAt: new Date() },
  ]);
  const [modal, setModal] = useState({ visible: false, editing: false, id: '' });

  const handleAdd = (values: any) => {
    if (modal.editing) {
      setServiceList(serviceList.map(s => s.id === modal.id ? { ...s, ...values, updatedAt: new Date() } : s));
      message.success('Cập nhật dịch vụ thành công!');
    } else {
      setServiceList([...serviceList, {
        id: Date.now().toString(),
        ...values,
        createdAt: new Date(),
      }]);
      message.success('Thêm dịch vụ thành công!');
    }
    form.resetFields();
    setModal({ visible: false, editing: false, id: '' });
  };

  const columns = [
    { title: 'Tên dịch vụ', dataIndex: 'name', key: 'name' },
    { title: 'Mô tả', dataIndex: 'description', key: 'description' },
    { title: 'Giá', dataIndex: 'price', key: 'price', render: (p: number) => `${p.toLocaleString()}đ` },
    { title: 'Thời gian (phút)', dataIndex: 'duration', key: 'duration' },
    {
      title: 'Hành động', key: 'action',
      render: (_, record: Service) => (
        <Space>
          <Button size="small" onClick={() => { form.setFieldsValue(record); setModal({ visible: true, editing: true, id: record.id }); }}>Sửa</Button>
          <Button size="small" danger onClick={() => setServiceList(serviceList.filter(s => s.id !== record.id))}>Xóa</Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Space style={{ marginBottom: 20 }}>
        <h2>Quản Lý Dịch Vụ</h2>
        <Button type="primary" onClick={() => { form.resetFields(); setModal({ visible: true, editing: false, id: '' }); }}>+ Thêm Dịch Vụ</Button>
      </Space>

      <Table columns={columns} dataSource={serviceList} rowKey="id" />

      <Modal
        title={modal.editing ? 'Cập Nhật Dịch Vụ' : 'Thêm Dịch Vụ'}
        open={modal.visible}
        onCancel={() => setModal({ visible: false, editing: false, id: '' })}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={handleAdd} layout="vertical">
          <Form.Item label="Tên dịch vụ" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Mô tả" name="description">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item label="Giá (đ)" name="price" rules={[{ required: true }]}>
            <InputNumber min={0} step={10000} />
          </Form.Item>
          <Form.Item label="Thời gian thực hiện (phút)" name="duration" rules={[{ required: true }]}>
            <InputNumber min={5} step={5} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ServiceManagement;
