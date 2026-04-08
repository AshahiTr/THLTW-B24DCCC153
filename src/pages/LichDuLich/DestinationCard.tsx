import { Card, Tag, Button, Space, Image, Popconfirm, Row, Col, Rate } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useModel } from 'umi';

const DestinationCard: React.FC<{ destination: LichDuLich.Destination }> = ({ destination }) => {
	const { setDestinationFormVisible, setEditingDestination, setIsEditingDestination, deleteDestination } =
		useModel('lichdulich');

	const typeMap: Record<string, { color: string; label: string }> = {
		beach: { color: '#108ee9', label: 'Biển' },
		mountain: { color: '#87d068', label: 'Núi' },
		city: { color: '#f50', label: 'Thành phố' },
		countryside: { color: '#2db7f5', label: 'Nông thôn' },
	};

	const handleEdit = () => {
		setEditingDestination(destination);
		setIsEditingDestination(true);
		setDestinationFormVisible(true);
	};

	const handleDelete = () => {
		deleteDestination(destination.id);
	};

	const typeInfo = typeMap[destination.type] || { color: '#999', label: destination.type };

	return (
		<Card
			hoverable
			style={{
				borderRadius: '8px',
				overflow: 'hidden',
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
			}}
			cover={
				destination.image ? (
					<div style={{ height: 200, overflow: 'hidden', backgroundColor: '#f0f0f0' }}>
						<Image
							src={destination.image}
							alt={destination.name}
							style={{ width: '100%', height: '100%', objectFit: 'cover' }}
							preview={false}
						/>
					</div>
				) : (
					<div
						style={{
							height: 200,
							backgroundColor: '#f0f0f0',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontSize: 14,
							color: '#999',
						}}
					>
						Không có hình ảnh
					</div>
				)
			}
		>
			<div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
				<h3 style={{ marginBottom: 8, marginTop: 0 }}>{destination.name}</h3>

				<div style={{ marginBottom: 8 }}>
					<Tag color={typeInfo.color}>{typeInfo.label}</Tag>
				</div>

				<p style={{ marginBottom: 8, color: '#666', fontSize: 14 }}>
					📍 {destination.location}
				</p>

				<div style={{ marginBottom: 8 }}>
					<Rate disabled allowHalf value={destination.rating} /> <span style={{ marginLeft: 8 }}>
						({destination.rating.toFixed(1)})
					</span>
				</div>

				<Row gutter={[8, 8]} style={{ marginBottom: 8, fontSize: 13 }}>
					<Col span={12}>
						<div>💰 Tham quan: {destination.price.toLocaleString()}đ</div>
					</Col>
					<Col span={12}>
						<div>⏱️ Thời gian: {destination.viewingTime} phút</div>
					</Col>
					{destination.food && (
						<Col span={12}>
							<div>🍽️ Ăn uống: {destination.food.toLocaleString()}đ</div>
						</Col>
					)}
					{destination.accommodation && (
						<Col span={12}>
							<div>🛏️ Lưu trú: {destination.accommodation.toLocaleString()}đ</div>
						</Col>
					)}
					{destination.transport && (
						<Col span={12}>
							<div>🚗 Di chuyển: {destination.transport.toLocaleString()}đ</div>
						</Col>
					)}
				</Row>

				{destination.description && (
					<p
						style={{
							marginBottom: 12,
							color: '#666',
							fontSize: 13,
							lineHeight: 1.5,
							flex: 1,
						}}
					>
						{destination.description.length > 100
							? destination.description.substring(0, 100) + '...'
							: destination.description}
					</p>
				)}

				<Space style={{ marginTop: 'auto' }}>
					<Button
						type='primary'
						size='small'
						icon={<EditOutlined />}
						onClick={handleEdit}
					>
						Sửa
					</Button>
					<Popconfirm
						title='Xóa điểm đến?'
						description='Bạn có chắc chắn muốn xóa?'
						onConfirm={() => handleDelete()}
						okText='Có'
						cancelText='Không'
					>
						<Button danger size='small' icon={<DeleteOutlined />}>
							Xóa
						</Button>
					</Popconfirm>
				</Space>
			</div>
		</Card>
	);
};

export default DestinationCard;
