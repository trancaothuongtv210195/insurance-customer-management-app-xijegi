
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

export const getDaysUntil = (dateString: string): number => {
  const targetDate = new Date(dateString);
  const today = new Date();
  const diffTime = targetDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const isOverdue = (dateString: string): boolean => {
  return getDaysUntil(dateString) < 0;
};

export const getDaysUntilBirthday = (dateOfBirth: string): number => {
  const birthday = new Date(dateOfBirth);
  const today = new Date();
  const thisYearBirthday = new Date(today.getFullYear(), birthday.getMonth(), birthday.getDate());
  
  if (thisYearBirthday < today) {
    thisYearBirthday.setFullYear(today.getFullYear() + 1);
  }
  
  const diffTime = thisYearBirthday.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const getAge = (dateOfBirth: string): number => {
  const birthday = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthday.getFullYear();
  const monthDiff = today.getMonth() - birthday.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthday.getDate())) {
    age--;
  }
  
  return age;
};

export const calculateNextPremiumDueDate = (
  startDate: Date,
  frequency: 'monthly' | 'quarterly' | 'semi-annual' | 'annual'
): Date => {
  const today = new Date();
  const start = new Date(startDate);
  let nextDue = new Date(start);

  // Calculate the interval in months
  let intervalMonths = 0;
  switch (frequency) {
    case 'monthly':
      intervalMonths = 1;
      break;
    case 'quarterly':
      intervalMonths = 3;
      break;
    case 'semi-annual':
      intervalMonths = 6;
      break;
    case 'annual':
      intervalMonths = 12;
      break;
  }

  // Keep adding intervals until we get a date in the future
  while (nextDue <= today) {
    nextDue.setMonth(nextDue.getMonth() + intervalMonths);
  }

  return nextDue;
};

export const formatAddress = (address?: {
  province?: string;
  district?: string;
  ward?: string;
  street?: string;
}): string => {
  if (!address) return '';
  
  const parts = [];
  if (address.street) parts.push(address.street);
  if (address.ward) parts.push(address.ward);
  if (address.district) parts.push(address.district);
  if (address.province) parts.push(address.province);
  
  return parts.join(', ');
};
