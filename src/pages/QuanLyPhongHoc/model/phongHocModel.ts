import { Effect, Reducer } from 'umi';
import { PhongHoc, LoaiPhong } from '../types';
import {
  layDanhSachPhongHoc,
  themPhongHoc,
  capNhatPhongHoc,
  xoaPhongHoc,
} from '../service/phongHocService';
import { message } from 'antd';

export interface PhongHocModelState {
  danhSach: PhongHoc[];
  loading: boolean;
}

export interface PhongHocModelType {
  namespace: 'phongHoc';
  state: PhongHocModelState;
  effects: {
    fetchDanhSach: Effect;
    themMoi: Effect;
    capNhat: Effect;
    xoa: Effect;
  };
  reducers: {
    saveDanhSach: Reducer<PhongHocModelState>;
    setLoading: Reducer<PhongHocModelState>;
  };
}

const PhongHocModel: PhongHocModelType = {
  namespace: 'phongHoc',

  state: {
    danhSach: [],
    loading: false,
  },

  effects: {
    *fetchDanhSach(_, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      const data: PhongHoc[] = yield call(layDanhSachPhongHoc);
      yield put({ type: 'saveDanhSach', payload: data });
      yield put({ type: 'setLoading', payload: false });
    },

    *themMoi({ payload }, { call, put }) {
      yield call(themPhongHoc, payload);
      message.success('Thêm phòng học thành công!');
      yield put({ type: 'fetchDanhSach' });
    },

    *capNhat({ payload }, { call, put }) {
      yield call(capNhatPhongHoc, payload);
      message.success('Cập nhật phòng học thành công!');
      yield put({ type: 'fetchDanhSach' });
    },

    *xoa({ payload }, { call, put }) {
      yield call(xoaPhongHoc, payload);
      message.success('Xóa phòng học thành công!');
      yield put({ type: 'fetchDanhSach' });
    },
  },

  reducers: {
    saveDanhSach(state, { payload }) {
      return { ...state!, danhSach: payload };
    },
    setLoading(state, { payload }) {
      return { ...state!, loading: payload };
    },
  },
};

export default PhongHocModel;
