import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select } from 'antd';
import { PhongHoc, PhongHocFormValues, LoaiPhong } from '../types';
import { DANH_SACH_NGUOI_PHU_TRACH } from '../service/phongHocService';

const { Option } = Select;

interface PhongHocFormProps {
  visible: boolean;
  phongDangSua?: PhongHoc | null;
  danhSachHienTai: PhongHoc[];
  onSubmit: (values: PhongHocFormValues) => void;
  onCancel: () => void;
}

const PhongHocForm: React.FC<PhongHocFormProps> = ({
  visible,
  phongDangSua,
  danhSachHienTai,
  onSubmit,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const isEdit = !!phongDangSua;

  useEffect(() => {
    if (visible) {
      if (phongDangSua) {
        form.setFieldsValue(phongDangSua);
      } else {
        form.resetFields();
      }
    }
  }, [visible, phongDangSua]);

  const handleOk = () => {
    form
      .validateFields()
      .then((values: PhongHocFormValues) => {
        onSubmit(values);
        form.resetFields();
      })
      .catch(() => {});
  };

  const validateMaPhong = (_: any, value: string) => {
    if (!value) return Promise.reject('Vui lòng nhập mã phòng!');
    const trung = danhSachHienTai.some(
      (p) => p.maPhong === value && p.id !== phongDangSua?.id,
    );
    if (trung) return Promise.reject('Mã phòng đã tồn tại!');
    return Promise.resolve();
  };

  const validateTenPhong = (_: any, value: string) => {
    if (!value) return Promise.reject('Vui lòng nhập tên phòng!');
    const trung = danhSachHienTai.some(
      (p) => p.tenPhong === value && p.id !== phongDangSua?.id,
    );
    if (trung) return Promise.reject('Tên phòng đã tồn tại!');
    return Promise.resolve();
  };

  return (
    <Modal
      title={isEdit ? 'Chỉnh sửa phòng học' : 'Thêm phòng học mới'}
      visible={visible}
      onOk={handleOk}
      onCancel={onCancel}
      okText={isEdit ? 'Cập nhật' : 'Thêm mới'}
      cancelText="Hủy"
      destroyOnClose
      width={520}
    >
      <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
        <Form.Item
          label="Mã phòng"
          name="maPhong"
          rules={[
            { validator: validateMaPhong },
            { max: 10, message: 'Mã phòng tối đa 10 ký tự!' },
          ]}
        >
          <Input placeholder="Nhập mã phòng (tối đa 10 ký tự)" maxLength={10} />
        </Form.Item>

        <Form.Item
          label="Tên phòng"
          name="tenPhong"
          rules={[
            { validator: validateTenPhong },
            { max: 50, message: 'Tên phòng tối đa 50 ký tự!' },
          ]}
        >
          <Input placeholder="Nhập tên phòng (tối đa 50 ký tự)" maxLength={50} />
        </Form.Item>

        <Form.Item
          label="Số chỗ ngồi"
          name="soChoNgoi"
          rules={[
            { required: true, message: 'Vui lòng nhập số chỗ ngồi!' },
            { type: 'number', min: 10, message: 'Số chỗ ngồi tối thiểu là 10!' },
            { type: 'number', max: 200, message: 'Số chỗ ngồi tối đa là 200!' },
          ]}
        >
          <InputNumber
            min={10}
            max={200}
            style={{ width: '100%' }}
            placeholder="Nhập số chỗ ngồi (10 - 200)"
          />
        </Form.Item>

        <Form.Item
          label="Loại phòng"
          name="loaiPhong"
          rules={[{ required: true, message: 'Vui lòng chọn loại phòng!' }]}
        >
          <Select placeholder="Chọn loại phòng">
            {Object.values(LoaiPhong).map((loai) => (
              <Option key={loai} value={loai}>
                {loai}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Người phụ trách"
          name="nguoiPhuTrach"
          rules={[{ required: true, message: 'Vui lòng chọn người phụ trách!' }]}
        >
          <Select placeholder="Chọn người phụ trách" showSearch>
            {DANH_SACH_NGUOI_PHU_TRACH.map((name) => (
              <Option key={name} value={name}>
                {name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PhongHocForm;
