import { PhongHoc, LoaiPhong } from '../types';

export const DANH_SACH_NGUOI_PHU_TRACH = [
  'Nguyễn Văn An',
  'Trần Thị Bình',
  'Lê Văn Cường',
  'Phạm Thị Dung',
  'Hoàng Văn Em',
  'Đỗ Thị Phương',
];

let danhSachPhongHoc: PhongHoc[] = [
  { id: '1', maPhong: 'A101', tenPhong: 'Phòng học A101', soChoNgoi: 40, loaiPhong: LoaiPhong.LY_THUYET, nguoiPhuTrach: 'Nguyễn Văn An' },
  { id: '2', maPhong: 'A102', tenPhong: 'Phòng học A102', soChoNgoi: 25, loaiPhong: LoaiPhong.LY_THUYET, nguoiPhuTrach: 'Trần Thị Bình' },
  { id: '3', maPhong: 'B201', tenPhong: 'Phòng thực hành B201', soChoNgoi: 30, loaiPhong: LoaiPhong.THUC_HANH, nguoiPhuTrach: 'Lê Văn Cường' },
  { id: '4', maPhong: 'B202', tenPhong: 'Phòng thực hành B202', soChoNgoi: 20, loaiPhong: LoaiPhong.THUC_HANH, nguoiPhuTrach: 'Phạm Thị Dung' },
  { id: '5', maPhong: 'HT01', tenPhong: 'Hội trường lớn', soChoNgoi: 200, loaiPhong: LoaiPhong.HOI_TRUONG, nguoiPhuTrach: 'Hoàng Văn Em' },
  { id: '6', maPhong: 'C301', tenPhong: 'Phòng học C301', soChoNgoi: 15, loaiPhong: LoaiPhong.LY_THUYET, nguoiPhuTrach: 'Đỗ Thị Phương' },
  { id: '7', maPhong: 'C302', tenPhong: 'Phòng học C302', soChoNgoi: 45, loaiPhong: LoaiPhong.LY_THUYET, nguoiPhuTrach: 'Nguyễn Văn An' },
  { id: '8', maPhong: 'D401', tenPhong: 'Phòng thực hành D401', soChoNgoi: 28, loaiPhong: LoaiPhong.THUC_HANH, nguoiPhuTrach: 'Trần Thị Bình' },
];

export const layDanhSachPhongHoc = (): Promise<PhongHoc[]> => {
  return Promise.resolve([...danhSachPhongHoc]);
};

export const themPhongHoc = (phong: Omit<PhongHoc, 'id'>): Promise<PhongHoc> => {
  const newPhong: PhongHoc = { ...phong, id: Date.now().toString() };
  danhSachPhongHoc = [...danhSachPhongHoc, newPhong];
  return Promise.resolve(newPhong);
};

export const capNhatPhongHoc = (phong: PhongHoc): Promise<PhongHoc> => {
  danhSachPhongHoc = danhSachPhongHoc.map((p) => (p.id === phong.id ? phong : p));
  return Promise.resolve(phong);
};

export const xoaPhongHoc = (id: string): Promise<void> => {
  danhSachPhongHoc = danhSachPhongHoc.filter((p) => p.id !== id);
  return Promise.resolve();
};
