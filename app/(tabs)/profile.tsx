
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import React, { useState } from 'react';
import { useTheme } from '@react-navigation/native';
import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity, Alert } from 'react-native';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useCustomers } from '@/contexts/CustomerContext';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';

export default function ProfileScreen() {
  const theme = useTheme();
  const { customers } = useCustomers();
  const [isExporting, setIsExporting] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  const totalCustomers = customers.length;
  const insuredCustomers = customers.filter(c => c.hasInsurance).length;
  const uninsuredCustomers = totalCustomers - insuredCustomers;
  const overdueCustomers = customers.filter(c => {
    if (!c.nextPremiumDueDate) return false;
    return new Date(c.nextPremiumDueDate) < new Date();
  }).length;

  const handleExport = async () => {
    if (customers.length === 0) {
      Alert.alert('Thông báo', 'Không có dữ liệu khách hàng để xuất');
      return;
    }

    setIsExporting(true);
    try {
      // Create CSV content
      const headers = [
        'Họ tên',
        'Số điện thoại',
        'Ngày sinh',
        'Địa chỉ',
        'Đã tham gia BH',
        'Công ty BH',
        'Số hợp đồng',
        'Ngày tham gia BH',
        'Số tiền phí',
        'Kỳ đóng phí',
        'Ngày đến hạn',
        'Ghi chú'
      ].join(',');

      const rows = customers.map(customer => {
        const address = [
          customer.address?.street,
          customer.address?.ward,
          customer.address?.district,
          customer.address?.province
        ].filter(Boolean).join(', ');

        const insuranceCompanies = customer.insuranceCompany?.join('; ') || '';
        
        const premiumFrequencyMap: { [key: string]: string } = {
          'monthly': 'Hàng tháng',
          'quarterly': 'Hàng quý',
          'semi-annual': 'Nửa năm',
          'annual': 'Hàng năm'
        };

        return [
          `"${customer.fullName}"`,
          customer.phoneNumber,
          new Date(customer.dateOfBirth).toLocaleDateString('vi-VN'),
          `"${address}"`,
          customer.hasInsurance ? 'Có' : 'Không',
          `"${insuranceCompanies}"`,
          customer.contractNumber || '',
          customer.insuranceStartDate ? new Date(customer.insuranceStartDate).toLocaleDateString('vi-VN') : '',
          customer.premiumAmount || '',
          customer.premiumFrequency ? premiumFrequencyMap[customer.premiumFrequency] : '',
          customer.nextPremiumDueDate ? new Date(customer.nextPremiumDueDate).toLocaleDateString('vi-VN') : '',
          `"${customer.notes || ''}"`
        ].join(',');
      });

      const csvContent = [headers, ...rows].join('\n');
      
      // Add BOM for UTF-8 encoding to support Vietnamese characters in Excel
      const BOM = '\uFEFF';
      const csvWithBOM = BOM + csvContent;

      // Save to file
      const fileName = `khach_hang_${new Date().getTime()}.csv`;
      const documentDir = FileSystem.documentDirectory || '';
      const fileUri = documentDir + fileName;
      
      await FileSystem.writeAsStringAsync(fileUri, csvWithBOM, {
        encoding: 'utf8' as any,
      });

      // Share the file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'text/csv',
          dialogTitle: 'Xuất dữ liệu khách hàng',
          UTI: 'public.comma-separated-values-text'
        });
      } else {
        Alert.alert('Lỗi', 'Không thể chia sẻ file trên thiết bị này');
      }

      Alert.alert('Thành công', `Đã xuất ${customers.length} khách hàng`);
    } catch (error) {
      console.error('Error exporting data:', error);
      Alert.alert('Lỗi', 'Không thể xuất dữ liệu');
    } finally {
      setIsExporting(false);
    }
  };

  const handleBackup = async () => {
    if (customers.length === 0) {
      Alert.alert('Thông báo', 'Không có dữ liệu để sao lưu');
      return;
    }

    setIsBackingUp(true);
    try {
      // Get all data from AsyncStorage
      const customersData = await AsyncStorage.getItem('@insurance_customers');
      
      if (!customersData) {
        Alert.alert('Lỗi', 'Không tìm thấy dữ liệu để sao lưu');
        return;
      }

      // Create backup object with metadata
      const backup = {
        version: '1.0',
        timestamp: new Date().toISOString(),
        data: {
          customers: JSON.parse(customersData)
        }
      };

      // Save to file
      const fileName = `backup_${new Date().getTime()}.json`;
      const documentDir = FileSystem.documentDirectory || '';
      const fileUri = documentDir + fileName;
      
      await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(backup, null, 2), {
        encoding: 'utf8' as any,
      });

      // Share the file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/json',
          dialogTitle: 'Sao lưu dữ liệu',
        });
      } else {
        Alert.alert('Lỗi', 'Không thể chia sẻ file trên thiết bị này');
      }

      Alert.alert('Thành công', 'Đã sao lưu dữ liệu thành công');
    } catch (error) {
      console.error('Error backing up data:', error);
      Alert.alert('Lỗi', 'Không thể sao lưu dữ liệu');
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleRestore = async () => {
    Alert.alert(
      'Xác nhận khôi phục',
      'Khôi phục dữ liệu sẽ thay thế toàn bộ dữ liệu hiện tại. Bạn có chắc chắn muốn tiếp tục?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Khôi phục',
          style: 'destructive',
          onPress: async () => {
            setIsRestoring(true);
            try {
              // Pick a file
              const result = await DocumentPicker.getDocumentAsync({
                type: 'application/json',
                copyToCacheDirectory: true,
              });

              if (result.canceled) {
                setIsRestoring(false);
                return;
              }

              // Read the file
              const fileContent = await FileSystem.readAsStringAsync(result.assets[0].uri, {
                encoding: 'utf8' as any,
              });

              // Parse and validate backup
              const backup = JSON.parse(fileContent);
              
              if (!backup.data || !backup.data.customers) {
                Alert.alert('Lỗi', 'File sao lưu không hợp lệ');
                return;
              }

              // Restore data
              await AsyncStorage.setItem('@insurance_customers', JSON.stringify(backup.data.customers));

              Alert.alert(
                'Thành công',
                'Đã khôi phục dữ liệu thành công. Vui lòng khởi động lại ứng dụng để áp dụng thay đổi.',
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      // Force reload by clearing and reloading
                      if (Platform.OS === 'web') {
                        window.location.reload();
                      }
                    }
                  }
                ]
              );
            } catch (error) {
              console.error('Error restoring data:', error);
              Alert.alert('Lỗi', 'Không thể khôi phục dữ liệu. Vui lòng kiểm tra file sao lưu.');
            } finally {
              setIsRestoring(false);
            }
          }
        }
      ]
    );
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
          
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={handleExport}
            disabled={isExporting}
          >
            <View style={styles.menuItemLeft}>
              <IconSymbol name="square.and.arrow.up" size={24} color={colors.primary} />
              <Text style={styles.menuItemText}>
                {isExporting ? 'Đang xuất...' : 'Xuất dữ liệu (CSV)'}
              </Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={handleBackup}
            disabled={isBackingUp}
          >
            <View style={styles.menuItemLeft}>
              <IconSymbol name="arrow.clockwise.circle" size={24} color={colors.primary} />
              <Text style={styles.menuItemText}>
                {isBackingUp ? 'Đang sao lưu...' : 'Sao lưu dữ liệu'}
              </Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={handleRestore}
            disabled={isRestoring}
          >
            <View style={styles.menuItemLeft}>
              <IconSymbol name="arrow.counterclockwise.circle" size={24} color={colors.primary} />
              <Text style={styles.menuItemText}>
                {isRestoring ? 'Đang khôi phục...' : 'Khôi phục dữ liệu'}
              </Text>
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
