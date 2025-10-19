
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Customer, SearchFilters } from '@/types/Customer';
import { formatAddress } from '@/utils/dateUtils';

interface CustomerContextType {
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateCustomer: (id: string, customer: Partial<Customer>) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
  getCustomerById: (id: string) => Customer | undefined;
  searchCustomers: (filters: SearchFilters) => Customer[];
  isPhoneNumberUnique: (phoneNumber: string, excludeId?: string) => boolean;
  isContractNumberUnique: (contractNumber: string, excludeId?: string) => boolean;
  loading: boolean;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

const STORAGE_KEY = '@insurance_customers';

export const CustomerProvider = ({ children }: { children: ReactNode }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        setCustomers(JSON.parse(data));
      }
    } catch (error) {
      console.error('Error loading customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveCustomers = async (newCustomers: Customer[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newCustomers));
      setCustomers(newCustomers);
    } catch (error) {
      console.error('Error saving customers:', error);
    }
  };

  const addCustomer = async (customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCustomer: Customer = {
      ...customerData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await saveCustomers([...customers, newCustomer]);
  };

  const updateCustomer = async (id: string, customerData: Partial<Customer>) => {
    const updatedCustomers = customers.map(customer =>
      customer.id === id
        ? { ...customer, ...customerData, updatedAt: new Date().toISOString() }
        : customer
    );
    await saveCustomers(updatedCustomers);
  };

  const deleteCustomer = async (id: string) => {
    const filteredCustomers = customers.filter(customer => customer.id !== id);
    await saveCustomers(filteredCustomers);
  };

  const getCustomerById = (id: string) => {
    return customers.find(customer => customer.id === id);
  };

  const isPhoneNumberUnique = (phoneNumber: string, excludeId?: string) => {
    return !customers.some(
      customer => customer.phoneNumber === phoneNumber && customer.id !== excludeId
    );
  };

  const isContractNumberUnique = (contractNumber: string, excludeId?: string) => {
    if (!contractNumber) return true;
    return !customers.some(
      customer => customer.contractNumber === contractNumber && customer.id !== excludeId
    );
  };

  const searchCustomers = (filters: SearchFilters): Customer[] => {
    return customers.filter(customer => {
      // Search text filter (name, phone, address)
      if (filters.searchText) {
        const searchLower = filters.searchText.toLowerCase();
        const addressStr = formatAddress(customer.address).toLowerCase();
        const matchesSearch =
          customer.fullName.toLowerCase().includes(searchLower) ||
          customer.phoneNumber.includes(searchLower) ||
          addressStr.includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Insurance company filter
      if (filters.insuranceCompany) {
        if (!customer.insuranceCompany || !customer.insuranceCompany.includes(filters.insuranceCompany)) {
          return false;
        }
      }

      // Has insurance filter
      if (filters.hasInsurance !== undefined && customer.hasInsurance !== filters.hasInsurance) {
        return false;
      }

      // Due within 30 days filter
      if (filters.dueWithin30Days && customer.nextPremiumDueDate) {
        const dueDate = new Date(customer.nextPremiumDueDate);
        const today = new Date();
        const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays < 0 || diffDays > 30) return false;
      }

      // Overdue filter
      if (filters.overdue && customer.nextPremiumDueDate) {
        const dueDate = new Date(customer.nextPremiumDueDate);
        const today = new Date();
        if (dueDate >= today) return false;
      }

      // Birthday within 5 days filter
      if (filters.birthdayWithin5Days) {
        const birthday = new Date(customer.dateOfBirth);
        const today = new Date();
        const thisYearBirthday = new Date(today.getFullYear(), birthday.getMonth(), birthday.getDate());
        const diffDays = Math.ceil((thisYearBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays < 0 || diffDays > 5) return false;
      }

      return true;
    });
  };

  return (
    <CustomerContext.Provider
      value={{
        customers,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        getCustomerById,
        searchCustomers,
        isPhoneNumberUnique,
        isContractNumberUnique,
        loading,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomers = () => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error('useCustomers must be used within a CustomerProvider');
  }
  return context;
};
