import { Button, Form, Input, Table, message } from 'antd';
import { useModel } from 'umi';
import { useEffect, useState } from 'react';

const CertificateSearch: React.FC = () => {
	const model = useModel('QuanLyVanBang.index');
	const { certificates = [], decisions = [], setDecisions, getLocalData } = model as any;
	const [form] = Form.useForm();
	const [results, setResults] = useState<any[]>([]);

	useEffect(() => {
		getLocalData();
	}, []);

	const handleSearch = async (values: any) => {
		const params = Object.fromEntries(Object.entries(values).filter(([, v]) => v));
		const filledCount = Object.keys(params).length;

		if (filledCount < 2) {
			message.error('Vui lòng nhập ít nhất 2 tiêu chí tìm kiếm');
			return;
		}

		const filtered = certificates.filter((c: any) => {
			return Object.entries(params).every(([key, val]: any) => {
				if (key === 'dob' && c.dob === val) return true;
				if (key === 'student_id' && c.student_id.includes(val)) return true;
				if (key === 'full_name' && c.full_name.toLowerCase().includes(val.toLowerCase())) return true;
				if (key === 'certificate_number' && c.certificate_number.includes(val)) return true;
				if (key === 'entry_number' && c.entry_number?.toString() === val) return true;
				return false;
			});
		});

		setResults(filtered);

		// Update view count
		if (filtered.length > 0) {
			const decisionId = filtered[0].graduation_decision_id;
			const updatedDecisions = decisions.map((d: any) => 
				d.id === decisionId ? { ...d, view_count: (d.view_count || 0) + 1 } : d
			);
			setDecisions(updatedDecisions);
			localStorage.setItem('decisions', JSON.stringify(updatedDecisions));
		}
	};

	return (
		<div style={{ padding: 40, maxWidth: 800, margin: '0 auto' }}>
			<h1>Tra Cứu Văn Bằng</h1>
			<Form form={form} onFinish={handleSearch} layout='vertical' style={{ marginBottom: 20 }}>
				<Form.Item label='Số Hiệu Văn Bằng' name='certificate_number'>
					<Input placeholder='BĐ-2024-00001' />
				</Form.Item>
				<Form.Item label='Số Vào Sổ' name='entry_number'>
					<Input type='number' />
				</Form.Item>
				<Form.Item label='MSV' name='student_id'>
					<Input />
				</Form.Item>
				<Form.Item label='Họ Tên' name='full_name'>
					<Input />
				</Form.Item>
				<Form.Item label='Ngày Sinh' name='dob'>
					<Input type='date' />
				</Form.Item>
				<Button type='primary' htmlType='submit' size='large' block>Tìm Kiếm</Button>
			</Form>

			{results.length > 0 && (
				<Table
					dataSource={results}
					columns={[
						{ title: 'Số Hiệu Văn Bằng', dataIndex: 'certificate_number', key: 'certificate_number' },
						{ title: 'MSV', dataIndex: 'student_id', key: 'student_id' },
						{ title: 'Họ Tên', dataIndex: 'full_name', key: 'full_name' },
						{ title: 'Ngày Sinh', dataIndex: 'dob', key: 'dob' },
						{ title: 'Số Vào Sổ', dataIndex: 'entry_number', key: 'entry_number' }
					]}
					rowKey='id'
				/>
			)}
		</div>
	);
};
export default CertificateSearch;
