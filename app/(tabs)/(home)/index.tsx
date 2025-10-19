
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Platform, Alert } from 'react-native';
import { Stack, router } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { CustomerCard } from '@/components/CustomerCard';
import { useCustomers } from '@/contexts/CustomerContext';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useTheme } from '@react-navigation/native';

export default function HomeScreen() {
  const theme = useTheme();
  const { customers, loading, deleteMultipleCustomers } = useCustomers();
  const [refreshing, setRefreshing] = useState(false);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => setRefreshing(false), 1000);
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
    if (selectedIds.length === customers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(customers.map(c => c.id));
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

  const renderHeaderRight = () => {
    if (selectMode) {
      return (
        <TouchableOpacity
          onPress={toggleSelectMode}
          style={styles.headerButton}
        >
          <Text style={styles.headerButtonText}>Hủy</Text>
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity
        onPress={() => router.push('/customer/create')}
        style={styles.headerButton}
      >
        <IconSymbol name="plus" color={colors.primary} size={24} />
      </TouchableOpacity>
    );
  };

  const renderHeaderLeft = () => {
    if (selectMode) {
      return (
        <TouchableOpacity
          onPress={selectAll}
          style={styles.headerButton}
        >
          <Text style={styles.headerButtonText}>
            {selectedIds.length === customers.length ? 'Bỏ chọn' : 'Chọn tất cả'}
          </Text>
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity
        onPress={() => router.push('/customer/search')}
        style={styles.headerButton}
      >
        <IconSymbol name="magnifyingglass" color={colors.primary} size={24} />
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <IconSymbol name="person.3.fill" size={80} color={colors.textSecondary} />
      <Text style={styles.emptyTitle}>Chưa có khách hàng</Text>
      <Text style={styles.emptyText}>
        Nhấn nút + để thêm khách hàng mới
      </Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push('/customer/create')}
      >
        <Text style={styles.addButtonText}>Thêm khách hàng</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: selectMode ? `Đã chọn ${selectedIds.length}` : 'Quản lý khách hàng',
            headerRight: renderHeaderRight,
            headerLeft: renderHeaderLeft,
          }}
        />
      )}
      <View style={[commonStyles.container, { backgroundColor: colors.background }]}>
        {Platform.OS !== 'ios' && (
          <View style={styles.androidHeader}>
            {selectMode ? (
              <>
                <TouchableOpacity onPress={selectAll} style={styles.headerButton}>
                  <Text style={styles.headerButtonText}>
                    {selectedIds.length === customers.length ? 'Bỏ chọn' : 'Chọn tất cả'}
                  </Text>
                </TouchableOpacity>
                <Text style={styles.androidHeaderTitle}>Đã chọn {selectedIds.length}</Text>
                <TouchableOpacity onPress={toggleSelectMode} style={styles.headerButton}>
                  <Text style={styles.headerButtonText}>Hủy</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity onPress={() => router.push('/customer/search')} style={styles.headerButton}>
                  <IconSymbol name="magnifyingglass" color={colors.primary} size={24} />
                </TouchableOpacity>
                <Text style={styles.androidHeaderTitle}>Quản lý khách hàng</Text>
                <TouchableOpacity onPress={() => router.push('/customer/create')} style={styles.headerButton}>
                  <IconSymbol name="plus" color={colors.primary} size={24} />
                </TouchableOpacity>
              </>
            )}
          </View>
        )}
        
        <FlatList
          data={customers}
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
            styles.listContainer,
            customers.length === 0 && styles.emptyListContainer,
            Platform.OS !== 'ios' && styles.listContainerWithTabBar,
            selectMode && styles.listContainerWithSelectBar,
          ]}
          ListEmptyComponent={renderEmptyState}
          refreshing={refreshing}
          onRefresh={onRefresh}
          showsVerticalScrollIndicator={false}
        />

        {!selectMode && customers.length > 0 && (
          <TouchableOpacity
            style={styles.selectModeButton}
            onPress={toggleSelectMode}
          >
            <IconSymbol name="checkmark.circle" size={20} color="#FFFFFF" />
            <Text style={styles.selectModeButtonText}>Chọn</Text>
          </TouchableOpacity>
        )}

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
  headerButton: {
    padding: 8,
  },
  headerButtonText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  androidHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  androidHeaderTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  listContainer: {
    paddingVertical: 8,
  },
  emptyListContainer: {
    flexGrow: 1,
  },
  listContainerWithTabBar: {
    paddingBottom: 100,
  },
  listContainerWithSelectBar: {
    paddingBottom: 80,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  selectModeButton: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 100 : 110,
    right: 20,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
      web: {
        boxShadow: '0 2px 4px rgba(0,0,0,0.25)',
      },
    }),
  },
  selectModeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  selectModeBar: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 90 : 90,
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
