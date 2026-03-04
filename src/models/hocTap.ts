import { useState } from 'react';

export default () => {
	const [subjects, setSubjects] = useState<HocTap.Subject[]>([]);
	const [progress, setProgress] = useState<HocTap.LearningProgress[]>([]);
	const [goals, setGoals] = useState<HocTap.MonthlyGoal[]>([]);
	const [isEdit, setIsEdit] = useState<boolean>(false);
	const [selectedTab, setSelectedTab] = useState<string>('1');
	const [visibleForm, setVisibleForm] = useState<boolean>(false);
	const [selectedItem, setSelectedItem] = useState<any>(null);
	const [formType, setFormType] = useState<'subject' | 'progress' | 'goal'>('subject');

	const getDataHocTap = async () => {
		const subjectsLocal = JSON.parse((localStorage.getItem('hocTap_subjects') as any) || '[]');
		const progressLocal = JSON.parse((localStorage.getItem('hocTap_progress') as any) || '[]');
		const goalsLocal = JSON.parse((localStorage.getItem('hocTap_goals') as any) || '[]');

		setSubjects(subjectsLocal);
		setProgress(progressLocal);
		setGoals(goalsLocal);
	};

	const updateSubjects = (newSubjects: HocTap.Subject[]) => {
		setSubjects(newSubjects);
		localStorage.setItem('hocTap_subjects', JSON.stringify(newSubjects));
	};

	const updateProgress = (newProgress: HocTap.LearningProgress[]) => {
		setProgress(newProgress);
		localStorage.setItem('hocTap_progress', JSON.stringify(newProgress));
	};

	const updateGoals = (newGoals: HocTap.MonthlyGoal[]) => {
		setGoals(newGoals);
		localStorage.setItem('hocTap_goals', JSON.stringify(newGoals));
	};

	return {
		subjects,
		setSubjects,
		updateSubjects,
		progress,
		setProgress,
		updateProgress,
		goals,
		setGoals,
		updateGoals,
		isEdit,
		setIsEdit,
		selectedTab,
		setSelectedTab,
		visibleForm,
		setVisibleForm,
		selectedItem,
		setSelectedItem,
		formType,
		setFormType,
		getDataHocTap,
	};
};
