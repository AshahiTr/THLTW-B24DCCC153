import { useState } from 'react';

export default () => {
	const [certificates, setCertificates] = useState<any[]>([]);
	const [decisions, setDecisions] = useState<any[]>([]);
	const [books, setBooks] = useState<any[]>([]);
	const [fields, setFields] = useState<any[]>([]);
	const [currentRecord, setCurrentRecord] = useState<any>(null);
	const [isEdit, setIsEdit] = useState<boolean>(false);
	const [visible, setVisible] = useState<boolean>(false);

	const getLocalData = () => {
		// Initialize sample data if empty
		if (!localStorage.getItem('books')) {
			const sampleBooks = [
				{ id: '1', year: 2024, status: 'published', created_at: new Date().toISOString() },
				{ id: '2', year: 2025, status: 'approved', created_at: new Date().toISOString() },
			];
			localStorage.setItem('books', JSON.stringify(sampleBooks));
		}

		if (!localStorage.getItem('decisions')) {
			const sampleDecisions = [
				{ id: 'd1', decision_number: 'QĐ-2024-001', issued_date: '2024-06-15', summary: 'Quyết định công nhân tốt nghiệp đợt 1 năm 2024', book_id: '1', view_count: 12, created_at: new Date().toISOString() },
				{ id: 'd2', decision_number: 'QĐ-2024-002', issued_date: '2024-09-20', summary: 'Quyết định công nhân tốt nghiệp đợt 2 năm 2024', book_id: '1', view_count: 8, created_at: new Date().toISOString() },
				{ id: 'd3', decision_number: 'QĐ-2025-001', issued_date: '2025-06-10', summary: 'Quyết định công nhân tốt nghiệp đợt 1 năm 2025', book_id: '2', view_count: 0, created_at: new Date().toISOString() },
			];
			localStorage.setItem('decisions', JSON.stringify(sampleDecisions));
		}

		if (!localStorage.getItem('fields')) {
			const sampleFields = [
				{ id: 'f1', field_name: 'Dân tộc', field_type: 'String', is_required: false, created_at: new Date().toISOString() },
				{ id: 'f2', field_name: 'Nơi sinh', field_type: 'String', is_required: false, created_at: new Date().toISOString() },
				{ id: 'f3', field_name: 'Điểm trung bình', field_type: 'Number', is_required: false, created_at: new Date().toISOString() },
				{ id: 'f4', field_name: 'Xếp hạng', field_type: 'String', is_required: false, created_at: new Date().toISOString() },
			];
			localStorage.setItem('fields', JSON.stringify(sampleFields));
		}

		if (!localStorage.getItem('certificates')) {
			const sampleCerts = [
				{ id: 'c1', entry_number: 1, certificate_number: 'BĐ-2024-00001', student_id: 'SV001', full_name: 'Nguyễn Văn A', dob: '2002-05-15', graduation_decision_id: 'd1', book_id: '1', fields: { 'Dân tộc': 'Kinh', 'Nơi sinh': 'Hà Nội', 'Điểm trung bình': 3.5, 'Xếp hạng': 'Giỏi' }, created_at: new Date().toISOString() },
				{ id: 'c2', entry_number: 2, certificate_number: 'BĐ-2024-00002', student_id: 'SV002', full_name: 'Trần Thị B', dob: '2002-08-20', graduation_decision_id: 'd1', book_id: '1', fields: { 'Dân tộc': 'Kinh', 'Nơi sinh': 'TP.HCM', 'Điểm trung bình': 3.7, 'Xếp hạng': 'Xuất sắc' }, created_at: new Date().toISOString() },
				{ id: 'c3', entry_number: 3, certificate_number: 'BĐ-2024-00003', student_id: 'SV003', full_name: 'Lê Văn C', dob: '2002-03-10', graduation_decision_id: 'd2', book_id: '1', fields: { 'Dân tộc': 'Thái', 'Nơi sinh': 'Thanh Hóa', 'Điểm trung bình': 3.2, 'Xếp hạng': 'Khá' }, created_at: new Date().toISOString() },
			];
			localStorage.setItem('certificates', JSON.stringify(sampleCerts));
		}

		setCertificates(JSON.parse(localStorage.getItem('certificates') || '[]'));
		setDecisions(JSON.parse(localStorage.getItem('decisions') || '[]'));
		setBooks(JSON.parse(localStorage.getItem('books') || '[]'));
		setFields(JSON.parse(localStorage.getItem('fields') || '[]'));
	};

	return {
		certificates,
		setCertificates,
		decisions,
		setDecisions,
		books,
		setBooks,
		fields,
		setFields,
		currentRecord,
		setCurrentRecord,
		isEdit,
		setIsEdit,
		visible,
		setVisible,
		getLocalData,
	};
};
