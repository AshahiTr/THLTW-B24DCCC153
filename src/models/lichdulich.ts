import { useState } from 'react';
import { sampleDestinations, sampleItineraries, sampleBudgets } from '@/services/LichDuLich/mockData';

export default () => {
	// Destinations state
	const [destinations, setDestinations] = useState<LichDuLich.Destination[]>([]);

	// Itineraries state
	const [itineraries, setItineraries] = useState<LichDuLich.Itinerary[]>([]);

	// Current itinerary being edited
	const [currentItinerary, setCurrentItinerary] = useState<LichDuLich.Itinerary | undefined>();

	// Budget state
	const [budgets, setBudgets] = useState<LichDuLich.Budget[]>([]);

	// UI state
	const [destinationFormVisible, setDestinationFormVisible] = useState<boolean>(false);
	const [itineraryFormVisible, setItineraryFormVisible] = useState<boolean>(false);
	const [editingDestination, setEditingDestination] = useState<LichDuLich.Destination | undefined>();
	const [isEditingDestination, setIsEditingDestination] = useState<boolean>(false);

	// Load data from localStorage
	const loadData = async () => {
		try {
			let destinationsData = JSON.parse(localStorage.getItem('lichdulich_destinations') || '[]');
			let itinerariesData = JSON.parse(localStorage.getItem('lichdulich_itineraries') || '[]');
			let budgetsData = JSON.parse(localStorage.getItem('lichdulich_budgets') || '[]');

			// Initialize with sample data if empty
			if (destinationsData.length === 0) {
				destinationsData = sampleDestinations;
				localStorage.setItem('lichdulich_destinations', JSON.stringify(sampleDestinations));
			}

			if (itinerariesData.length === 0) {
				itinerariesData = sampleItineraries;
				localStorage.setItem('lichdulich_itineraries', JSON.stringify(sampleItineraries));
			}

			if (budgetsData.length === 0) {
				budgetsData = sampleBudgets;
				localStorage.setItem('lichdulich_budgets', JSON.stringify(sampleBudgets));
			}

			setDestinations(destinationsData);
			setItineraries(itinerariesData);
			setBudgets(budgetsData);
		} catch (error) {
			console.error('Error loading data:', error);
		}
	};

	// Save destinations to localStorage
	const saveDestinations = (data: LichDuLich.Destination[]) => {
		localStorage.setItem('lichdulich_destinations', JSON.stringify(data));
		setDestinations(data);
	};

	// Save itineraries to localStorage
	const saveItineraries = (data: LichDuLich.Itinerary[]) => {
		localStorage.setItem('lichdulich_itineraries', JSON.stringify(data));
		setItineraries(data);
	};

	// Save budgets to localStorage
	const saveBudgets = (data: LichDuLich.Budget[]) => {
		localStorage.setItem('lichdulich_budgets', JSON.stringify(data));
		setBudgets(data);
	};

	// Add/Update destination
	const addOrUpdateDestination = (destination: LichDuLich.Destination) => {
		if (isEditingDestination && editingDestination) {
			const updatedData = destinations.map((d) => (d.id === destination.id ? destination : d));
			saveDestinations(updatedData);
		} else {
			const newData = [destination, ...destinations];
			saveDestinations(newData);
		}
	};

	// Delete destination
	const deleteDestination = (id: string) => {
		const newData = destinations.filter((d) => d.id !== id);
		saveDestinations(newData);
	};

	// Add/Update itinerary
	const addOrUpdateItinerary = (itinerary: LichDuLich.Itinerary) => {
		const existingIndex = itineraries.findIndex((i) => i.id === itinerary.id);
		if (existingIndex >= 0) {
			const updatedData = [...itineraries];
			updatedData[existingIndex] = itinerary;
			saveItineraries(updatedData);
		} else {
			const newData = [itinerary, ...itineraries];
			saveItineraries(newData);
		}
	};

	// Delete itinerary
	const deleteItinerary = (id: string) => {
		const newData = itineraries.filter((i) => i.id !== id);
		saveItineraries(newData);
	};

	// Add budget
	const addOrUpdateBudget = (budget: LichDuLich.Budget) => {
		const existingIndex = budgets.findIndex((b) => b.itineraryId === budget.itineraryId);
		if (existingIndex >= 0) {
			const updatedData = [...budgets];
			updatedData[existingIndex] = budget;
			saveBudgets(updatedData);
		} else {
			const newData = [budget, ...budgets];
			saveBudgets(newData);
		}
	};

	// Get statistics for admin dashboard
	const getStatistics = (): LichDuLich.Statistics => {
		const popularityByType: Record<string, number> = {
			beach: 0,
			mountain: 0,
			city: 0,
			countryside: 0,
		};

		destinations.forEach((d) => {
			popularityByType[d.type]++;
		});

		const topDestinations = [...destinations]
			.sort((a, b) => b.rating - a.rating)
			.slice(0, 5);

		const totalRevenue = itineraries.reduce((sum, i) => {
			return sum + i.days.reduce((daySum, day) => daySum + day.totalCost, 0);
		}, 0);

		const revenueByCategory: Record<string, number> = {
			food: 0,
			accommodation: 0,
			transport: 0,
			activity: 0,
			other: 0,
		};

		budgets.forEach((budget) => {
			budget.categories.forEach((cat) => {
				revenueByCategory[cat.category] = (revenueByCategory[cat.category] || 0) + cat.spent;
			});
		});

		return {
			totalItineraries: itineraries.length,
			totalDestinations: destinations.length,
			topDestinations,
			populationByType: popularityByType,
			totalRevenue,
			revenueByCategory,
		};
	};

	return {
		// Destinations
		destinations,
		setDestinations,
		destinationFormVisible,
		setDestinationFormVisible,
		editingDestination,
		setEditingDestination,
		isEditingDestination,
		setIsEditingDestination,
		addOrUpdateDestination,
		deleteDestination,

		// Itineraries
		itineraries,
		setItineraries,
		currentItinerary,
		setCurrentItinerary,
		itineraryFormVisible,
		setItineraryFormVisible,
		addOrUpdateItinerary,
		deleteItinerary,

		// Budgets
		budgets,
		setBudgets,
		addOrUpdateBudget,

		// Data management
		loadData,
		saveDestinations,
		saveItineraries,
		saveBudgets,

		// Statistics
		getStatistics,
	};
};
