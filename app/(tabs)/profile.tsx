
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import React from 'react';
import { useTheme } from '@react-navigation/native';
import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity, Alert } from 'react-native';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useCustomers } from '@/contexts/CustomerContext';

export default function ProfileScreen() {
  const theme = useTheme();
  const { customers } = useCustomers();

  const totalCustomers = customers.length;
  const insuredCustomers = customers.filter(c => c.hasInsurance).length;
  const uninsuredCustomers = totalCustomers - insuredCustomers;
  const overdueCustomers = customers.filter(c => {
    if (!c.nextPremiumDueDate) return false;
    return new Date(c.nextPremiumDueDate) < new Date();
  }).length;

  const handleExport = () => {
    Alert.alert('Xuất dữ liệu', 'Tính năng xuất dữ liệu sẽ được cập nhật trong phiên bản tiếp theo');
  };

  const handleBackup = () => {
    Alert.alert('Sao lưu', 'Tính năng sao lưu sẽ được cập nhật trong phiên bản tiếp theo');
  };

  const handleAbout = () => {
    Alert.alert(
      'Về ứng dụng',
      'Ứng dụng quản lý khách hàng bảo hiểm nhân thọ\nPhiên bản 1.0.0\n\nỨng dụng giúp bạn quản lý thông tin khách hàng, theo dõi hợp đồng bảo hiểm và nhắc nhở đóng phí.'
    );
  };

  return (
    <View style={[commonStyles.container, { backgroundColor: colors.background }]}>
      {Platform.OS !== 'ios' && (
        <View style={styles.androidHeader}>
          <Text style={styles.androidHeaderTitle}>Cài đặt</Text>
        </View>
      )}
      
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.scrollContent,
          Platform.OS !== 'ios' && styles.scrollContentWithTabBar,
        ]}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thống kê</Text>
          
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { backgroundColor: colors.primary }]}>
              <IconSymbol name="person.3.fill" size={32} color="#FFFFFF" />
              <Text style={styles.statValue}>{totalCustomers}</Text>
              <Text style={styles.statLabel}>Tổng khách hàng</Text>
            </View>

            <View style={[styles.statCard, { backgroundColor: colors.success }]}>
              <IconSymbol name="checkmark.circle.fill" size={32} color="#FFFFFF" />
              <Text style={styles.statValue}>{insuredCustomers}</Text>
              <Text style={styles.statLabel}>Đã tham gia BH</Text>
            </View>

            <View style={[styles.statCard, { backgroundColor: colors.secondary }]}>
              <IconSymbol name="xmark.circle.fill" size={32} color="#FFFFFF" />
              <Text style={styles.statValue}>{uninsuredCustomers}</Text>
              <Text style={styles.statLabel}>Chưa tham gia BH</Text>
            </View>

            <View style={[styles.statCard, { backgroundColor: colors.danger }]}>
              <IconSymbol name="exclamationmark.triangle.fill" size={32} color="#FFFFFF" />
              <Text style={styles.statValue}>{overdueCustomers}</Text>
              <Text style={styles.statLabel}>Quá hạn đóng phí</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dữ liệu</Text>
          
          <TouchableOpacity style={styles.menuItem} onPress={handleExport}>
            <View style={styles.menuItemLeft}>
              <IconSymbol name="square.and.arrow.up" size={24} color={colors.primary} />
              <Text style={styles.menuItemText}>Xuất dữ liệu</Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleBackup}>
            <View style={styles.menuItemLeft}>
              <IconSymbol name="arrow.clockwise.circle" size={24} color={colors.primary} />
              <Text style={styles.menuItemText}>Sao lưu & Khôi phục</Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin</Text>
          
          <TouchableOpacity style={styles.menuItem} onPress={handleAbout}>
            <View style={styles.menuItemLeft}>
              <IconSymbol name="info.circle" size={24} color={colors.primary} />
              <Text style={styles.menuItemText}>Về ứng dụng</Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Ứng dụng quản lý khách hàng bảo hiểm nhân thọ
          </Text>
          <Text style={styles.footerVersion}>Phiên bản 1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  androidHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
  scrollContent: {
    paddingBottom: 32,
  },
  scrollContentWithTabBar: {
    paddingBottom: 100,
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: 4,
    textAlign: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    padding: 32,
  },
  footerText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 4,
  },
  footerVersion: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
