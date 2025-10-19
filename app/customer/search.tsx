
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
  Alert,
} from 'react-native';
import { Stack } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { CustomerCard } from '@/components/CustomerCard';
import { useCustomers } from '@/contexts/CustomerContext';
import { SearchFilters } from '@/types/Customer';
import { colors, commonStyles } from '@/styles/commonStyles';
import { INSURANCE_COMPANIES } from '@/data/insuranceCompanies';

export default function SearchCustomerScreen() {
  const { searchCustomers, deleteMultipleCustomers } = useCustomers();
  const [searchText, setSearchText] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<string | undefined>();
  const [hasInsurance, setHasInsurance] = useState<boolean | undefined>();
  const [dueWithin30Days, setDueWithin30Days] = useState(false);
  const [overdue, setOverdue] = useState(false);
  const [birthdayWithin5Days, setBirthdayWithin5Days] = useState(false);
  const [showCompanyPicker, setShowCompanyPicker] = useState(false);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filters: SearchFilters = {
    searchText: searchText || undefined,
    insuranceCompany: selectedCompany,
    hasInsurance,
    dueWithin30Days,
    overdue,
    birthdayWithin5Days,
  };

  const results = searchCustomers(filters);

  const clearFilters = () => {
    setSearchText('');
    setSelectedCompany(undefined);
    setHasInsurance(undefined);
    setDueWithin30Days(false);
    setOverdue(false);
    setBirthdayWithin5Days(false);
  };

  const toggleSelectMode = () => {
    setSelectMode(!selectMode);
    setSelectedIds([]);
  };

  const toggleSelectCustomer = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const selectAll = () => {
    if (selectedIds.length === results.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(results.map(c => c.id));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) {
      Alert.alert('Thông báo', 'Vui lòng chọn ít nhất một khách hàng để xóa');
      return;
    }

    Alert.alert(
      'Xác nhận xóa',
      `Bạn có chắc chắn muốn xóa ${selectedIds.length} khách hàng đã chọn?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMultipleCustomers(selectedIds);
              setSelectedIds([]);
              setSelectMode(false);
              Alert.alert('Thành công', `Đã xóa ${selectedIds.length} khách hàng`);
            } catch (error) {
              console.error('Error deleting customers:', error);
              Alert.alert('Lỗi', 'Không thể xóa khách hàng');
            }
          }
        }
      ]
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: selectMode ? `Đã chọn ${selectedIds.length}` : 'Tìm kiếm khách hàng',
          headerBackTitle: 'Quay lại',
          headerRight: () => selectMode ? (
            <TouchableOpacity onPress={toggleSelectMode}>
              <Text style={styles.headerButtonText}>Hủy</Text>
            </TouchableOpacity>
          ) : null,
          headerLeft: () => selectMode ? (
            <TouchableOpacity onPress={selectAll}>
              <Text style={styles.headerButtonText}>
                {selectedIds.length === results.length ? 'Bỏ chọn' : 'Chọn tất cả'}
              </Text>
            </TouchableOpacity>
          ) : undefined,
        }}
      />
      <View style={[commonStyles.container, { backgroundColor: colors.background }]}>
        <ScrollView 
          style={styles.filtersContainer}
          contentContainerStyle={styles.filtersContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.searchBox}>
            <IconSymbol name="magnifyingglass" size={20} color={colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Tìm theo tên, SĐT, địa chỉ..."
              placeholderTextColor={colors.textSecondary}
            />
            {searchText.length > 0 && (
              <TouchableOpacity onPress={() => setSearchText('')}>
                <IconSymbol name="xmark.circle.fill" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.filterSection}>
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
                <ScrollView style={styles.pickerScrollView}>
                  <TouchableOpacity
                    style={styles.pickerItem}
                    onPress={() => {
                      setSelectedCompany(undefined);
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
                </ScrollView>
              </View>
            )}
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Trạng thái bảo hiểm</Text>
            <View style={styles.filterButtons}>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  hasInsurance === undefined && styles.filterButtonActive,
                ]}
                onPress={() => setHasInsurance(undefined)}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    hasInsurance === undefined && styles.filterButtonTextActive,
                  ]}
                >
                  Tất cả
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  hasInsurance === true && styles.filterButtonActive,
                ]}
                onPress={() => setHasInsurance(true)}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    hasInsurance === true && styles.filterButtonTextActive,
                  ]}
                >
                  Đã tham gia
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  hasInsurance === false && styles.filterButtonActive,
                ]}
                onPress={() => setHasInsurance(false)}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    hasInsurance === false && styles.filterButtonTextActive,
                  ]}
                >
                  Chưa tham gia
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Bộ lọc nhanh</Text>
            <TouchableOpacity
              style={[styles.quickFilter, dueWithin30Days && styles.quickFilterActive]}
              onPress={() => setDueWithin30Days(!dueWithin30Days)}
            >
              <IconSymbol
                name={dueWithin30Days ? 'checkmark.square.fill' : 'square'}
                size={24}
                color={dueWithin30Days ? colors.primary : colors.textSecondary}
              />
              <Text style={styles.quickFilterText}>Đến hạn trong 30 ngày</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quickFilter, overdue && styles.quickFilterActive]}
              onPress={() => setOverdue(!overdue)}
            >
              <IconSymbol
                name={overdue ? 'checkmark.square.fill' : 'square'}
                size={24}
                color={overdue ? colors.danger : colors.textSecondary}
              />
              <Text style={styles.quickFilterText}>Quá hạn đóng phí</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quickFilter, birthdayWithin5Days && styles.quickFilterActive]}
              onPress={() => setBirthdayWithin5Days(!birthdayWithin5Days)}
            >
              <IconSymbol
                name={birthdayWithin5Days ? 'checkmark.square.fill' : 'square'}
                size={24}
                color={birthdayWithin5Days ? colors.accent : colors.textSecondary}
              />
              <Text style={styles.quickFilterText}>Sinh nhật trong 5 ngày</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
            <IconSymbol name="arrow.counterclockwise" size={20} color={colors.primary} />
            <Text style={styles.clearButtonText}>Xóa bộ lọc</Text>
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.resultsContainer}>
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsText}>
              Tìm thấy {results.length} khách hàng
            </Text>
            {results.length > 0 && !selectMode && (
              <TouchableOpacity onPress={toggleSelectMode}>
                <Text style={styles.selectButtonText}>Chọn</Text>
              </TouchableOpacity>
            )}
          </View>

          <FlatList
            data={results}
            renderItem={({ item }) => (
              <CustomerCard 
                customer={item}
                selectMode={selectMode}
                isSelected={selectedIds.includes(item.id)}
                onSelect={() => toggleSelectCustomer(item.id)}
              />
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={[
              styles.resultsList,
              selectMode && styles.resultsListWithSelectBar,
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

        {selectMode && (
          <View style={styles.selectModeBar}>
            <TouchableOpacity
              style={[styles.deleteButton, selectedIds.length === 0 && styles.deleteButtonDisabled]}
              onPress={handleDeleteSelected}
              disabled={selectedIds.length === 0}
            >
              <IconSymbol name="trash" size={20} color="#FFFFFF" />
              <Text style={styles.deleteButtonText}>
                Xóa {selectedIds.length > 0 ? `(${selectedIds.length})` : ''}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  filtersContainer: {
    maxHeight: 350,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filtersContent: {
    padding: 16,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    marginLeft: 8,
  },
  filterSection: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
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
    maxHeight: 200,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pickerScrollView: {
    maxHeight: 200,
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
  filterButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.inputBackground,
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  quickFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  quickFilterActive: {
    opacity: 1,
  },
  quickFilterText: {
    fontSize: 16,
    color: colors.text,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.inputBackground,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  resultsContainer: {
    flex: 1,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  resultsText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  selectButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  resultsList: {
    paddingVertical: 8,
  },
  resultsListWithSelectBar: {
    paddingBottom: 80,
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
  headerButtonText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
    paddingHorizontal: 8,
  },
  selectModeBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 -2px 4px rgba(0,0,0,0.1)',
      },
    }),
  },
  deleteButton: {
    backgroundColor: colors.danger,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
  },
  deleteButtonDisabled: {
    opacity: 0.5,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
