import { Button, Row, Col, Space, Select, Input, Empty } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import { useEffect, useState } from 'react';
import DestinationCard from './DestinationCard';
import DestinationForm from './DestinationForm';

const Destinations: React.FC = () => {
	const {
		destinations,
		setDestinationFormVisible,
		setEditingDestination,
		setIsEditingDestination,
		loadData,
	} = useModel('lichdulich');

	const [filteredDestinations, setFilteredDestinations] = useState<LichDuLich.Destination[]>([]);
	const [searchText, setSearchText] = useState('');
	const [typeFilter, setTypeFilter] = useState<string>('all');
	const [priceSort, setPriceSort] = useState<'all' | 'low' | 'high'>('all');
	const [ratingSort, setRatingSort] = useState<'all' | 'high' | 'low'>('all');

	useEffect(() => {
		loadData();
	}, []);

	useEffect(() => {
		let filtered = [...destinations];

		// Filter by search text
		if (searchText) {
			filtered = filtered.filter(
				(d) =>
					d.name.toLowerCase().includes(searchText.toLowerCase()) ||
					d.location.toLowerCase().includes(searchText.toLowerCase())
			);
		}

		// Filter by type
		if (typeFilter !== 'all') {
			filtered = filtered.filter((d) => d.type === typeFilter);
		}

		// Sort by price
		if (priceSort === 'low') {
			filtered.sort((a, b) => a.price - b.price);
		} else if (priceSort === 'high') {
			filtered.sort((a, b) => b.price - a.price);
		}

		// Sort by rating
		if (ratingSort === 'high') {
			filtered.sort((a, b) => b.rating - a.rating);
		} else if (ratingSort === 'low') {
			filtered.sort((a, b) => a.rating - b.rating);
		}

		setFilteredDestinations(filtered);
	}, [destinations, searchText, typeFilter, priceSort, ratingSort]);

	const handleAddNew = () => {
		setEditingDestination(undefined);
		setIsEditingDestination(false);
		setDestinationFormVisible(true);
	};

	return (
		<div style={{ padding: '20px' }}>
			<Space direction='vertical' style={{ width: '100%' }} size='large'>
				{/* Header */}
				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
					<h1 style={{ marginBottom: 0 }}>🌍 Khám Phá Điểm Đến</h1>
					<Button type='primary' size='large' icon={<PlusOutlined />} onClick={handleAddNew}>
						Thêm Điểm Đến
					</Button>
				</div>

				{/* Filters */}
				<div style={{ backgroundColor: '#fafafa', padding: '16px', borderRadius: '8px' }}>
					<Row gutter={[16, 16]}>
						<Col xs={24} sm={12} md={6}>
							<Input.Search
								placeholder='Tìm kiếm tên, địa điểm...'
								prefix={<SearchOutlined />}
								value={searchText}
								onChange={(e) => setSearchText(e.target.value)}
							/>
						</Col>
						<Col xs={24} sm={12} md={6}>
							<Select
								style={{ width: '100%' }}
								placeholder='Loại hình'
								value={typeFilter}
								onChange={setTypeFilter}
								options={[
									{ value: 'all', label: 'Tất cả loại hình' },
									{ value: 'beach', label: '🌊 Biển' },
									{ value: 'mountain', label: '⛰️ Núi' },
									{ value: 'city', label: '🏙️ Thành phố' },
									{ value: 'countryside', label: '🌾 Nông thôn' },
								]}
							/>
						</Col>
						<Col xs={24} sm={12} md={6}>
							<Select
								style={{ width: '100%' }}
								placeholder='Sắp xếp giá'
								value={priceSort}
								onChange={setPriceSort}
								options={[
									{ value: 'all', label: 'Tất cả giá' },
									{ value: 'low', label: 'Giá thấp đến cao' },
									{ value: 'high', label: 'Giá cao đến thấp' },
								]}
							/>
						</Col>
						<Col xs={24} sm={12} md={6}>
							<Select
								style={{ width: '100%' }}
								placeholder='Sắp xếp đánh giá'
								value={ratingSort}
								onChange={setRatingSort}
								options={[
									{ value: 'all', label: 'Tất cả' },
									{ value: 'high', label: 'Cao xuống thấp' },
									{ value: 'low', label: 'Thấp đến cao' },
								]}
							/>
						</Col>
					</Row>

					<div style={{ marginTop: '12px', fontSize: '14px', color: '#666' }}>
						Tìm thấy <strong>{filteredDestinations.length}</strong> điểm đến
					</div>
				</div>

				{/* Content */}
				{filteredDestinations.length === 0 ? (
					<Empty
						description={searchText || typeFilter !== 'all' ? 'Không tìm thấy điểm đến' : 'Chưa có điểm đến nào'}
						style={{ marginTop: '40px' }}
					/>
				) : (
					<Row gutter={[16, 16]}>
						{filteredDestinations.map((destination) => (
							<Col xs={24} sm={12} md={8} lg={6} key={destination.id}>
								<DestinationCard destination={destination} />
							</Col>
						))}
					</Row>
				)}
			</Space>

			<DestinationForm />
		</div>
	);
};

export default Destinations;
