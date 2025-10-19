
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Image } from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { Customer } from '@/types/Customer';
import { colors, commonStyles } from '@/styles/commonStyles';
import { formatDate, formatCurrency, getDaysUntil, isOverdue, getDaysUntilBirthday } from '@/utils/dateUtils';
import { router } from 'expo-router';

interface CustomerCardProps {
  customer: Customer;
}

export const CustomerCard = ({ customer }: CustomerCardProps) => {
  const handleCall = () => {
    Linking.openURL(`tel:${customer.phoneNumber}`);
  };

  const handlePress = () => {
    router.push(`/customer/${customer.id}`);
  };

  const daysUntilDue = customer.nextPremiumDueDate ? getDaysUntil(customer.nextPremiumDueDate) : null;
  const daysUntilBirthday = getDaysUntilBirthday(customer.dateOfBirth);
  const overdueStatus = daysUntilDue !== null && isOverdue(customer.nextPremiumDueDate!);

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
      <View style={[commonStyles.card, styles.card]}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            {customer.avatar ? (
              <Image source={{ uri: customer.avatar }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <IconSymbol name="person.fill" size={32} color={colors.textSecondary} />
              </View>
            )}
          </View>
          
          <View style={styles.headerInfo}>
            <Text style={styles.name}>{customer.fullName}</Text>
            <TouchableOpacity onPress={handleCall} style={styles.phoneButton}>
              <IconSymbol name="phone.fill" size={16} color={colors.primary} />
              <Text style={styles.phone}>{customer.phoneNumber}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoSection}>
          {customer.hasInsurance && customer.insuranceCompany && (
            <View style={styles.infoRow}>
              <IconSymbol name="building.2.fill" size={16} color={colors.textSecondary} />
              <Text style={styles.infoText}>{customer.insuranceCompany}</Text>
            </View>
          )}

          {customer.nextPremiumDueDate && customer.premiumAmount && (
            <View style={styles.infoRow}>
              <IconSymbol name="calendar" size={16} color={overdueStatus ? colors.danger : colors.textSecondary} />
              <View style={styles.infoTextContainer}>
                <Text style={[styles.infoText, overdueStatus && styles.overdueText]}>
                  Đến hạn: {formatDate(customer.nextPremiumDueDate)}
                </Text>
                {daysUntilDue !== null && (
                  <Text style={[styles.daysText, overdueStatus && styles.overdueText]}>
                    {overdueStatus ? `Quá hạn ${Math.abs(daysUntilDue)} ngày` : `Còn ${daysUntilDue} ngày`}
                  </Text>
                )}
              </View>
            </View>
          )}

          {customer.premiumAmount && (
            <View style={styles.infoRow}>
              <IconSymbol name="dollarsign.circle.fill" size={16} color={colors.success} />
              <Text style={[styles.infoText, styles.amountText]}>
                {formatCurrency(customer.premiumAmount)}
              </Text>
            </View>
          )}

          <View style={styles.infoRow}>
            <IconSymbol name="gift.fill" size={16} color={colors.accent} />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoText}>
                Sinh nhật: {formatDate(customer.dateOfBirth)}
              </Text>
              {daysUntilBirthday <= 5 && (
                <Text style={[styles.daysText, styles.birthdayText]}>
                  Còn {daysUntilBirthday} ngày
                </Text>
              )}
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          {customer.hasInsurance ? (
            <View style={[styles.badge, { backgroundColor: colors.success }]}>
              <Text style={styles.badgeText}>Đã tham gia BH</Text>
            </View>
          ) : (
            <View style={[styles.badge, { backgroundColor: colors.secondary }]}>
              <Text style={styles.badgeText}>Chưa tham gia BH</Text>
            </View>
          )}
          
          {overdueStatus && (
            <View style={[styles.badge, { backgroundColor: colors.danger, marginLeft: 8 }]}>
              <Text style={styles.badgeText}>Quá hạn</Text>
            </View>
          )}
          
          {daysUntilBirthday <= 5 && (
            <View style={[styles.badge, { backgroundColor: colors.accent, marginLeft: 8 }]}>
              <Text style={styles.badgeText}>Sắp sinh nhật</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  avatarPlaceholder: {
    backgroundColor: colors.inputBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  phoneButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phone: {
    fontSize: 14,
    color: colors.primary,
    marginLeft: 6,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  infoSection: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  infoTextContainer: {
    flex: 1,
    marginLeft: 8,
  },
  infoText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
    flex: 1,
  },
  amountText: {
    fontWeight: '700',
    color: colors.success,
  },
  daysText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  overdueText: {
    color: colors.danger,
    fontWeight: '600',
  },
  birthdayText: {
    color: colors.accent,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
