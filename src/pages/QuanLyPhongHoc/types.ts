export enum LoaiPhong {
  LY_THUYET = 'Lý thuyết',
  THUC_HANH = 'Thực hành',
  HOI_TRUONG = 'Hội trường',
}

export interface PhongHoc {
  id: string;
  maPhong: string;
  tenPhong: string;
  soChoNgoi: number;
  loaiPhong: LoaiPhong;
  nguoiPhuTrach: string;
}

export interface PhongHocFormValues {
  maPhong: string;
  tenPhong: string;
  soChoNgoi: number;
  loaiPhong: LoaiPhong;
  nguoiPhuTrach: string;
}
