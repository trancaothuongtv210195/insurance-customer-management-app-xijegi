
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
  Image,
  Platform,
} from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { useCustomers } from '@/contexts/CustomerContext';
import { colors, commonStyles } from '@/styles/commonStyles';
import { formatDate, formatCurrency, getDaysUntil, isOverdue, getDaysUntilBirthday, getAge } from '@/utils/dateUtils';

export default function CustomerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getCustomerById, deleteCustomer } = useCustomers();
  const customer = getCustomerById(id);

  if (!customer) {
    return (
      <>
        <Stack.Screen options={{ title: 'Không tìm thấy' }} />
        <View style={[commonStyles.container, styles.centerContent]}>
          <Text style={styles.errorText}>Không tìm thấy khách hàng</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Quay lại</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }

  const handleCall = () => {
    Linking.openURL(`tel:${customer.phoneNumber}`);
  };

  const handleEdit = () => {
    router.push(`/customer/edit/${customer.id}`);
  };

  const handleDelete = () => {
    Alert.alert(
      'Xác nhận xóa',
      `Bạn có chắc chắn muốn xóa khách hàng ${customer.fullName}?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            await deleteCustomer(customer.id);
            router.back();
          },
        },
      ]
    );
  };

  const daysUntilDue = customer.nextPremiumDueDate ? getDaysUntil(customer.nextPremiumDueDate) : null;
  const daysUntilBirthday = getDaysUntilBirthday(customer.dateOfBirth);
  const overdueStatus = daysUntilDue !== null && customer.nextPremiumDueDate && isOverdue(customer.nextPremiumDueDate);
  const age = getAge(customer.dateOfBirth);

  return (
    <>
      <Stack.Screen
        options={{
          title: customer.fullName,
          headerBackTitle: 'Quay lại',
          headerRight: () => (
            <TouchableOpacity onPress={handleEdit} style={styles.headerButton}>
              <IconSymbol name="pencil" size={20} color={colors.primary} />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView style={commonStyles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          {customer.avatar ? (
            <Image source={{ uri: customer.avatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <IconSymbol name="person.fill" size={60} color={colors.textSecondary} />
            </View>
          )}
          <Text style={styles.name}>{customer.fullName}</Text>
          <Text style={styles.age}>{age} tuổi</Text>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
              <IconSymbol name="phone.fill" size={24} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Gọi điện</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin cơ bản</Text>
          
          <View style={styles.infoRow}>
            <IconSymbol name="phone.fill" size={20} color={colors.textSecondary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Số điện thoại</Text>
              <Text style={styles.infoValue}>{customer.phoneNumber}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <IconSymbol name="gift.fill" size={20} color={colors.textSecondary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Ngày sinh</Text>
              <Text style={styles.infoValue}>
                {formatDate(customer.dateOfBirth)}
                {daysUntilBirthday <= 5 && (
                  <Text style={styles.highlightText}> (Còn {daysUntilBirthday} ngày)</Text>
                )}
              </Text>
            </View>
          </View>

          {customer.address && (
            <View style={styles.infoRow}>
              <IconSymbol name="location.fill" size={20} color={colors.textSecondary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Địa chỉ</Text>
                <Text style={styles.infoValue}>{customer.address}</Text>
              </View>
            </View>
          )}
        </View>

        {customer.hasInsurance && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin bảo hiểm</Text>

            {customer.insuranceCompany && (
              <View style={styles.infoRow}>
                <IconSymbol name="building.2.fill" size={20} color={colors.textSecondary} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Công ty bảo hiểm</Text>
                  <Text style={styles.infoValue}>{customer.insuranceCompany}</Text>
                </View>
              </View>
            )}

            {customer.contractNumber && (
              <View style={styles.infoRow}>
                <IconSymbol name="doc.text.fill" size={20} color={colors.textSecondary} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Số hợp đồng</Text>
                  <Text style={styles.infoValue}>{customer.contractNumber}</Text>
                </View>
              </View>
            )}

            {customer.securityNumber && (
              <View style={styles.infoRow}>
                <IconSymbol name="lock.fill" size={20} color={colors.textSecondary} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Số bảo mật</Text>
                  <Text style={styles.infoValue}>{customer.securityNumber}</Text>
                </View>
              </View>
            )}

            {customer.insuranceStartDate && (
              <View style={styles.infoRow}>
                <IconSymbol name="calendar" size={20} color={colors.textSecondary} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Ngày tham gia</Text>
                  <Text style={styles.infoValue}>{formatDate(customer.insuranceStartDate)}</Text>
                </View>
              </View>
            )}

            {customer.premiumAmount && (
              <View style={styles.infoRow}>
                <IconSymbol name="dollarsign.circle.fill" size={20} color={colors.success} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Phí bảo hiểm</Text>
                  <Text style={[styles.infoValue, styles.amountText]}>
                    {formatCurrency(customer.premiumAmount)}
                  </Text>
                </View>
              </View>
            )}

            {customer.nextPremiumDueDate && (
              <View style={[styles.infoRow, overdueStatus && styles.overdueRow]}>
                <IconSymbol
                  name="exclamationmark.triangle.fill"
                  size={20}
                  color={overdueStatus ? colors.danger : colors.textSecondary}
                />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Ngày đến hạn</Text>
                  <Text style={[styles.infoValue, overdueStatus && styles.overdueText]}>
                    {formatDate(customer.nextPremiumDueDate)}
                  </Text>
                  {daysUntilDue !== null && (
                    <Text style={[styles.daysText, overdueStatus && styles.overdueText]}>
                      {overdueStatus ? `Quá hạn ${Math.abs(daysUntilDue)} ngày` : `Còn ${daysUntilDue} ngày`}
                    </Text>
                  )}
                </View>
              </View>
            )}
          </View>
        )}

        {!customer.hasInsurance && (
          <View style={styles.section}>
            <View style={styles.noInsuranceCard}>
              <IconSymbol name="info.circle.fill" size={40} color={colors.secondary} />
              <Text style={styles.noInsuranceText}>Khách hàng chưa tham gia bảo hiểm</Text>
            </View>
          </View>
        )}

        {customer.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ghi chú</Text>
            <Text style={styles.notesText}>{customer.notes}</Text>
          </View>
        )}

        <View style={styles.section}>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <IconSymbol name="trash.fill" size={20} color="#FFFFFF" />
            <Text style={styles.deleteButtonText}>Xóa khách hàng</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 32,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  headerButton: {
    padding: 8,
  },
  header: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  avatarPlaceholder: {
    backgroundColor: colors.inputBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  age: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    padding: 12,
    backgroundColor: colors.card,
    borderRadius: 8,
  },
  overdueRow: {
    backgroundColor: '#FFF5F5',
    borderWidth: 1,
    borderColor: colors.danger,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 16,
    color: colors.text,
  },
  amountText: {
    fontWeight: '700',
    color: colors.success,
    fontSize: 18,
  },
  daysText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginTop: 4,
  },
  overdueText: {
    color: colors.danger,
    fontWeight: '600',
  },
  highlightText: {
    color: colors.accent,
    fontWeight: '600',
  },
  noInsuranceCard: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: colors.card,
    borderRadius: 12,
  },
  noInsuranceText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 16,
    textAlign: 'center',
  },
  notesText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 8,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.danger,
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
