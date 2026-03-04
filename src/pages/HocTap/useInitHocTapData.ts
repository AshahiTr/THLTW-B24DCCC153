import { useEffect } from 'react';
import sampleData from './mockData';

/**
 * Hook để khởi tạo dữ liệu mẫu nếu chưa có dữ liệu trong localStorage
 * Chỉ khởi tạo một lần khi component mount
 */
export const useInitHocTapData = () => {
	useEffect(() => {
		const subjects = localStorage.getItem('hocTap_subjects');
		const progress = localStorage.getItem('hocTap_progress');
		const goals = localStorage.getItem('hocTap_goals');

		// Nếu chưa có dữ liệu nào, khởi tạo dữ liệu mẫu
		if (!subjects || !progress || !goals) {
			localStorage.setItem('hocTap_subjects', JSON.stringify(sampleData.subjects));
			localStorage.setItem('hocTap_progress', JSON.stringify(sampleData.progress));
			localStorage.setItem('hocTap_goals', JSON.stringify(sampleData.goals));
		}
	}, []);
};

export default useInitHocTapData;
