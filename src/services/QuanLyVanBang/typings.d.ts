declare module 'QuanLyVanBang' {
	export interface CertificateInfo {
		id?: string;
		entry_number?: number;
		certificate_number: string;
		student_id: string;
		full_name: string;
		dob: string;
		graduation_decision_id?: string;
		book_id?: string;
		fields: Record<string, any>;
		created_at?: string;
	}

	export interface GraduationDecision {
		id?: string;
		decision_number: string;
		issued_date: string;
		summary: string;
		book_id?: string;
		view_count?: number;
		created_at?: string;
	}

	export interface CertificateBook {
		id?: string;
		year: number;
		status: 'draft' | 'approved' | 'published';
		total_certificates?: number;
		created_at?: string;
	}

	export interface FormFieldConfig {
		id?: string;
		field_name: string;
		field_type: 'String' | 'Number' | 'Date';
		is_required?: boolean;
		created_at?: string;
	}
}
