
export interface Customer {
  id: string;
  avatar?: string;
  fullName: string;
  dateOfBirth: string;
  phoneNumber: string;
  address?: string;
  hasInsurance: boolean;
  insuranceCompany?: string;
  contractNumber?: string;
  securityNumber?: string;
  insuranceStartDate?: string;
  premiumAmount?: number;
  premiumFrequency?: 'monthly' | 'quarterly' | 'semi-annual' | 'annual';
  nextPremiumDueDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SearchFilters {
  searchText?: string;
  insuranceCompany?: string;
  hasInsurance?: boolean;
  dueWithin30Days?: boolean;
  overdue?: boolean;
  birthdayWithin5Days?: boolean;
}
