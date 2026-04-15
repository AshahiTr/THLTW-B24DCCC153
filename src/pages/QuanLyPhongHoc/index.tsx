import React, { useState, useEffect, useMemo } from 'react';
import {
  Table,
  Button,
  Input,
  Select,
  Space,
  Tag,
  Popconfirm,
  Typography,
  Row,
  Col,
  Tooltip,
  Card,
  message,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { PhongHoc, LoaiPhong, PhongHocFormValues } from './types';
import {
  layDanhSachPhongHoc,
  themPhongHoc,
  capNhatPhongHoc,
  xoaPhongHoc,
  DANH_SACH_NGUOI_PHU_TRACH,
} from './service/phongHocService';
import PhongHocForm from './components/PhongHocForm';

const { Title } = Typography;
const { Option } = Select;

const LOAI_PHONG_COLOR: Record<LoaiPhong, string> = {
  [LoaiPhong.LY_THUYET]: 'blue',
  [LoaiPhong.THUC_HANH]: 'green',
  [LoaiPhong.HOI_TRUONG]: 'purple',
};

const QuanLyPhongHoc: React.FC = () => {
  const [danhSach, setDanhSach] = useState<PhongHoc[]>([]);
  const [loading, setLoading] = useState(false);
  const [tuKhoa, setTuKhoa] = useState('');
  const [locLoaiPhong, setLocLoaiPhong] = useState<string | undefined>(undefined);
  const [locNguoiPhuTrach, setLocNguoiPhuTrach] = useState<string | undefined>(undefined);
  const [modalVisible, setModalVisible] = useState(false);
  const [phongDangSua, setPhongDangSua] = useState<PhongHoc | null>(null);

  const fetchDanhSach = async () => {
    setLoading(true);
    try {
      const data = await layDanhSachPhongHoc();
      setDanhSach(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDanhSach();
  }, []);

  const danhSachLoc = useMemo(() => {
    return danhSach.filter((p) => {
      const khop =
        p.maPhong.toLowerCase().includes(tuKhoa.toLowerCase()) ||
        p.tenPhong.toLowerCase().includes(tuKhoa.toLowerCase());
      const khopLoai = locLoaiPhong ? p.loaiPhong === locLoaiPhong : true;
      const khopNguoi = locNguoiPhuTrach ? p.nguoiPhuTrach === locNguoiPhuTrach : true;
      return khop && khopLoai && khopNguoi;
    });
  }, [danhSach, tuKhoa, locLoaiPhong, locNguoiPhuTrach]);

  const handleMoThemMoi = () => {
    setPhongDangSua(null);
    setModalVisible(true);
  };

  const handleMoChinhSua = (phong: PhongHoc) => {
    setPhongDangSua(phong);
    setModalVisible(true);
  };

  const handleDongModal = () => {
    setModalVisible(false);
    setPhongDangSua(null);
  };

  const handleSubmitForm = async (values: PhongHocFormValues) => {
    if (phongDangSua) {
      await capNhatPhongHoc({ ...values, id: phongDangSua.id });
      message.success('Cập nhật phòng học thành công!');
    } else {
      await themPhongHoc(values);
      message.success('Thêm phòng học thành công!');
    }
    handleDongModal();
    fetchDanhSach();
  };

  const handleXoa = async (id: string) => {
    await xoaPhongHoc(id);
    message.success('Xóa phòng học thành công!');
    fetchDanhSach();
  };

  const columns: ColumnsType<PhongHoc> = [
    {
      title: 'Mã phòng',
      dataIndex: 'maPhong',
      key: 'maPhong',
      width: 110,
      sorter: (a, b) => a.maPhong.localeCompare(b.maPhong),
    },
    {
      title: 'Tên phòng',
      dataIndex: 'tenPhong',
      key: 'tenPhong',
      ellipsis: true,
    },
    {
      title: 'Số chỗ ngồi',
      dataIndex: 'soChoNgoi',
      key: 'soChoNgoi',
      width: 130,
      align: 'center',
      sorter: (a, b) => a.soChoNgoi - b.soChoNgoi,
      render: (val: number) => <span style={{ fontWeight: 600 }}>{val}</span>,
    },
    {
      title: 'Loại phòng',
      dataIndex: 'loaiPhong',
      key: 'loaiPhong',
      width: 140,
      render: (val: LoaiPhong) => (
        <Tag color={LOAI_PHONG_COLOR[val]}>{val}</Tag>
      ),
    },
    {
      title: 'Người phụ trách',
      dataIndex: 'nguoiPhuTrach',
      key: 'nguoiPhuTrach',
      ellipsis: true,
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 130,
      align: 'center',
      render: (_, record) => {
        const coTheXoa = record.soChoNgoi < 30;
        return (
          <Space size="small">
            <Tooltip title="Chỉnh sửa">
              <Button
                type="primary"
                ghost
                icon={<EditOutlined />}
                size="small"
                onClick={() => handleMoChinhSua(record)}
              />
            </Tooltip>
            <Tooltip title={coTheXoa ? 'Xóa phòng' : 'Chỉ xóa phòng dưới 30 chỗ ngồi'}>
              <Popconfirm
                title={`Xác nhận xóa: Bạn có chắc muốn xóa phòng "${record.tenPhong}"?`}
                onConfirm={() => handleXoa(record.id)}
                okText="Xóa"
                cancelText="Hủy"
                disabled={!coTheXoa}
                okButtonProps={{ danger: true }}
              >
                <Button
                  danger
                  ghost
                  icon={<DeleteOutlined />}
                  size="small"
                  disabled={!coTheXoa}
                />
              </Popconfirm>
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
        <Col>
          <Space align="center">
            <HomeOutlined style={{ fontSize: 24, color: '#1677ff' }} />
            <Title level={3} style={{ margin: 0 }}>
              Quản lý phòng học
            </Title>
          </Space>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleMoThemMoi}
          >
            Thêm phòng học
          </Button>
        </Col>
      </Row>

      <Card style={{ marginBottom: 16, borderRadius: 8 }}>
        <Row gutter={[12, 12]} align="middle">
          <Col xs={24} sm={24} md={8}>
            <Input
              placeholder="Tìm theo mã phòng hoặc tên phòng..."
              prefix={<SearchOutlined />}
              value={tuKhoa}
              onChange={(e) => setTuKhoa(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={12} sm={12} md={6}>
            <Select
              placeholder="Lọc theo loại phòng"
              style={{ width: '100%' }}
              allowClear
              value={locLoaiPhong}
              onChange={setLocLoaiPhong}
            >
              {Object.values(LoaiPhong).map((loai) => (
                <Option key={loai} value={loai}>
                  {loai}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={12} sm={12} md={6}>
            <Select
              placeholder="Lọc theo người phụ trách"
              style={{ width: '100%' }}
              allowClear
              value={locNguoiPhuTrach}
              onChange={setLocNguoiPhuTrach}
              showSearch
            >
              {DANH_SACH_NGUOI_PHU_TRACH.map((name) => (
                <Option key={name} value={name}>
                  {name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={24} md={4}>
            <Typography.Text type="secondary">
              Tổng: <strong>{danhSachLoc.length}</strong> phòng
            </Typography.Text>
          </Col>
        </Row>
      </Card>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={danhSachLoc}
        loading={loading}
        bordered
        size="middle"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} phòng`,
        }}
        scroll={{ x: 700 }}
      />

      <PhongHocForm
        visible={modalVisible}
        phongDangSua={phongDangSua}
        danhSachHienTai={danhSach}
        onSubmit={handleSubmitForm}
        onCancel={handleDongModal}
      />
    </div>
  );
};

export default QuanLyPhongHoc;