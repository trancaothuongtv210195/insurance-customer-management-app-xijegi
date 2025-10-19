
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Platform } from 'react-native';
import { Stack, router } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { CustomerCard } from '@/components/CustomerCard';
import { useCustomers } from '@/contexts/CustomerContext';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useTheme } from '@react-navigation/native';

export default function HomeScreen() {
  const theme = useTheme();
  const { customers, loading } = useCustomers();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => setRefreshing(false), 1000);
  };

  const renderHeaderRight = () => (
    <TouchableOpacity
      onPress={() => router.push('/customer/create')}
      style={styles.headerButton}
    >
      <IconSymbol name="plus" color={colors.primary} size={24} />
    </TouchableOpacity>
  );

  const renderHeaderLeft = () => (
    <TouchableOpacity
      onPress={() => router.push('/customer/search')}
      style={styles.headerButton}
    >
      <IconSymbol name="magnifyingglass" color={colors.primary} size={24} />
    </TouchableOpacity>
  );

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
            title: 'Quản lý khách hàng',
            headerRight: renderHeaderRight,
            headerLeft: renderHeaderLeft,
          }}
        />
      )}
      <View style={[commonStyles.container, { backgroundColor: colors.background }]}>
        {Platform.OS !== 'ios' && (
          <View style={styles.androidHeader}>
            <TouchableOpacity onPress={() => router.push('/customer/search')} style={styles.headerButton}>
              <IconSymbol name="magnifyingglass" color={colors.primary} size={24} />
            </TouchableOpacity>
            <Text style={styles.androidHeaderTitle}>Quản lý khách hàng</Text>
            <TouchableOpacity onPress={() => router.push('/customer/create')} style={styles.headerButton}>
              <IconSymbol name="plus" color={colors.primary} size={24} />
            </TouchableOpacity>
          </View>
        )}
        
        <FlatList
          data={customers}
          renderItem={({ item }) => <CustomerCard customer={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.listContainer,
            customers.length === 0 && styles.emptyListContainer,
            Platform.OS !== 'ios' && styles.listContainerWithTabBar,
          ]}
          ListEmptyComponent={renderEmptyState}
          refreshing={refreshing}
          onRefresh={onRefresh}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  headerButton: {
    padding: 8,
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
});
