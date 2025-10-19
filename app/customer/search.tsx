
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Platform,
} from 'react-native';
import { Stack } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { CustomerCard } from '@/components/CustomerCard';
import { useCustomers } from '@/contexts/CustomerContext';
import { colors, commonStyles } from '@/styles/commonStyles';
import { INSURANCE_COMPANIES } from '@/data/insuranceCompanies';
import { SearchFilters } from '@/types/Customer';

export default function SearchCustomerScreen() {
  const { searchCustomers } = useCustomers();
  
  const [searchText, setSearchText] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [showCompanyPicker, setShowCompanyPicker] = useState(false);
  const [hasInsurance, setHasInsurance] = useState<boolean | undefined>(undefined);
  const [dueWithin30Days, setDueWithin30Days] = useState(false);
  const [overdue, setOverdue] = useState(false);
  const [birthdayWithin5Days, setBirthdayWithin5Days] = useState(false);

  const filters: SearchFilters = {
    searchText: searchText.trim() || undefined,
    insuranceCompany: selectedCompany || undefined,
    hasInsurance,
    dueWithin30Days,
    overdue,
    birthdayWithin5Days,
  };

  const results = searchCustomers(filters);

  const clearFilters = () => {
    setSearchText('');
    setSelectedCompany('');
    setHasInsurance(undefined);
    setDueWithin30Days(false);
    setOverdue(false);
    setBirthdayWithin5Days(false);
  };

  const activeFiltersCount = [
    searchText.trim(),
    selectedCompany,
    hasInsurance !== undefined,
    dueWithin30Days,
    overdue,
    birthdayWithin5Days,
  ].filter(Boolean).length;

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Tìm kiếm khách hàng',
          headerBackTitle: 'Quay lại',
        }}
      />
      <View style={commonStyles.container}>
        <ScrollView style={styles.filtersContainer}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tìm kiếm</Text>
            <View style={styles.searchContainer}>
              <IconSymbol name="magnifyingglass" size={20} color={colors.textSecondary} />
              <TextInput
                style={styles.searchInput}
                value={searchText}
                onChangeText={setSearchText}
                placeholder="Tên, số điện thoại, địa chỉ..."
                placeholderTextColor={colors.textSecondary}
              />
              {searchText.length > 0 && (
                <TouchableOpacity onPress={() => setSearchText('')}>
                  <IconSymbol name="xmark.circle.fill" size={20} color={colors.textSecondary} />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Bộ lọc</Text>

            <Text style={styles.filterLabel}>Công ty bảo hiểm</Text>
            <TouchableOpacity
              style={[commonStyles.input, styles.pickerButton]}
              onPress={() => setShowCompanyPicker(!showCompanyPicker)}
            >
              <Text style={selectedCompany ? styles.pickerText : styles.pickerPlaceholder}>
                {selectedCompany || 'Tất cả công ty'}
              </Text>
              <IconSymbol name="chevron.down" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            {showCompanyPicker && (
              <View style={styles.pickerList}>
                <TouchableOpacity
                  style={styles.pickerItem}
                  onPress={() => {
                    setSelectedCompany('');
                    setShowCompanyPicker(false);
                  }}
                >
                  <Text style={styles.pickerItemText}>Tất cả công ty</Text>
                </TouchableOpacity>
                {INSURANCE_COMPANIES.map((company) => (
                  <TouchableOpacity
                    key={company}
                    style={styles.pickerItem}
                    onPress={() => {
                      setSelectedCompany(company);
                      setShowCompanyPicker(false);
                    }}
                  >
                    <Text style={styles.pickerItemText}>{company}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <Text style={styles.filterLabel}>Trạng thái bảo hiểm</Text>
            <View style={styles.filterRow}>
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  hasInsurance === true && styles.filterChipActive,
                ]}
                onPress={() => setHasInsurance(hasInsurance === true ? undefined : true)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    hasInsurance === true && styles.filterChipTextActive,
                  ]}
                >
                  Đã tham gia
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  hasInsurance === false && styles.filterChipActive,
                ]}
                onPress={() => setHasInsurance(hasInsurance === false ? undefined : false)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    hasInsurance === false && styles.filterChipTextActive,
                  ]}
                >
                  Chưa tham gia
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.filterLabel}>Đóng phí</Text>
            <View style={styles.filterRow}>
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  dueWithin30Days && styles.filterChipActive,
                ]}
                onPress={() => setDueWithin30Days(!dueWithin30Days)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    dueWithin30Days && styles.filterChipTextActive,
                  ]}
                >
                  Đến hạn trong 30 ngày
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  overdue && styles.filterChipActive,
                ]}
                onPress={() => setOverdue(!overdue)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    overdue && styles.filterChipTextActive,
                  ]}
                >
                  Quá hạn
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.filterLabel}>Sinh nhật</Text>
            <TouchableOpacity
              style={[
                styles.filterChip,
                birthdayWithin5Days && styles.filterChipActive,
              ]}
              onPress={() => setBirthdayWithin5Days(!birthdayWithin5Days)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  birthdayWithin5Days && styles.filterChipTextActive,
                ]}
              >
                Sinh nhật trong 5 ngày
              </Text>
            </TouchableOpacity>

            {activeFiltersCount > 0 && (
              <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
                <Text style={styles.clearButtonText}>Xóa bộ lọc ({activeFiltersCount})</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>

        <View style={styles.resultsContainer}>
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsTitle}>
              Kết quả: {results.length} khách hàng
            </Text>
          </View>
          <FlatList
            data={results}
            renderItem={({ item }) => <CustomerCard customer={item} />}
            keyExtractor={(item) => item.id}
            contentContainerStyle={[
              styles.resultsList,
              Platform.OS !== 'ios' && styles.resultsListWithTabBar,
            ]}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <IconSymbol name="magnifyingglass" size={60} color={colors.textSecondary} />
                <Text style={styles.emptyText}>Không tìm thấy khách hàng</Text>
              </View>
            }
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  filtersContainer: {
    maxHeight: '40%',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    marginLeft: 8,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    marginTop: 12,
  },
  pickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerText: {
    fontSize: 16,
    color: colors.text,
  },
  pickerPlaceholder: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  pickerList: {
    backgroundColor: colors.card,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 12,
    maxHeight: 200,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pickerItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  pickerItemText: {
    fontSize: 16,
    color: colors.text,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  clearButton: {
    marginTop: 16,
    paddingVertical: 12,
    backgroundColor: colors.secondary,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  resultsContainer: {
    flex: 1,
  },
  resultsHeader: {
    padding: 16,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  resultsList: {
    paddingVertical: 8,
  },
  resultsListWithTabBar: {
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 16,
  },
});
