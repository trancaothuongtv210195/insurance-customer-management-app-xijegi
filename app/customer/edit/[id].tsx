
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  Image,
} from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { useCustomers } from '@/contexts/CustomerContext';
import { colors, commonStyles } from '@/styles/commonStyles';
import { INSURANCE_COMPANIES, PREMIUM_FREQUENCIES } from '@/data/insuranceCompanies';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';

export default function EditCustomerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getCustomerById, updateCustomer, isPhoneNumberUnique, isContractNumberUnique } = useCustomers();
  const customer = getCustomerById(id);

  const [avatar, setAvatar] = useState('');
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [hasInsurance, setHasInsurance] = useState(false);
  const [insuranceCompany, setInsuranceCompany] = useState('');
  const [showCompanyPicker, setShowCompanyPicker] = useState(false);
  const [contractNumber, setContractNumber] = useState('');
  const [securityNumber, setSecurityNumber] = useState('');
  const [insuranceStartDate, setInsuranceStartDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [premiumAmount, setPremiumAmount] = useState('');
  const [premiumFrequency, setPremiumFrequency] = useState<'monthly' | 'quarterly' | 'semi-annual' | 'annual'>('monthly');
  const [showFrequencyPicker, setShowFrequencyPicker] = useState(false);
  const [nextPremiumDueDate, setNextPremiumDueDate] = useState(new Date());
  const [showDueDatePicker, setShowDueDatePicker] = useState(false);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (customer) {
      setAvatar(customer.avatar || '');
      setFullName(customer.fullName);
      setDateOfBirth(new Date(customer.dateOfBirth));
      setPhoneNumber(customer.phoneNumber);
      setAddress(customer.address || '');
      setHasInsurance(customer.hasInsurance);
      setInsuranceCompany(customer.insuranceCompany || '');
      setContractNumber(customer.contractNumber || '');
      setSecurityNumber(customer.securityNumber || '');
      setInsuranceStartDate(customer.insuranceStartDate ? new Date(customer.insuranceStartDate) : new Date());
      setPremiumAmount(customer.premiumAmount ? customer.premiumAmount.toString() : '');
      setPremiumFrequency(customer.premiumFrequency || 'monthly');
      setNextPremiumDueDate(customer.nextPremiumDueDate ? new Date(customer.nextPremiumDueDate) : new Date());
      setNotes(customer.notes || '');
    }
  }, [customer]);

  if (!customer) {
    return (
      <>
        <Stack.Screen options={{ title: 'Không tìm thấy' }} />
        <View style={[commonStyles.container, styles.centerContent]}>
          <Text style={styles.errorText}>Không tìm thấy khách hàng</Text>
        </View>
      </>
    );
  }

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const validateForm = (): boolean => {
    if (!fullName.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập họ tên');
      return false;
    }

    if (!phoneNumber.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập số điện thoại');
      return false;
    }

    if (!isPhoneNumberUnique(phoneNumber, customer.id)) {
      Alert.alert('Lỗi', 'Số điện thoại đã tồn tại');
      return false;
    }

    if (hasInsurance) {
      if (!insuranceCompany) {
        Alert.alert('Lỗi', 'Vui lòng chọn công ty bảo hiểm');
        return false;
      }

      if (contractNumber && !isContractNumberUnique(contractNumber, customer.id)) {
        Alert.alert('Lỗi', 'Số hợp đồng đã tồn tại');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await updateCustomer(customer.id, {
        avatar,
        fullName: fullName.trim(),
        dateOfBirth: dateOfBirth.toISOString(),
        phoneNumber: phoneNumber.trim(),
        address: address.trim(),
        hasInsurance,
        insuranceCompany: hasInsurance ? insuranceCompany : undefined,
        contractNumber: hasInsurance && contractNumber ? contractNumber.trim() : undefined,
        securityNumber: hasInsurance && securityNumber ? securityNumber.trim() : undefined,
        insuranceStartDate: hasInsurance ? insuranceStartDate.toISOString() : undefined,
        premiumAmount: hasInsurance && premiumAmount ? parseFloat(premiumAmount) : undefined,
        premiumFrequency: hasInsurance ? premiumFrequency : undefined,
        nextPremiumDueDate: hasInsurance ? nextPremiumDueDate.toISOString() : undefined,
        notes: notes.trim(),
      });

      Alert.alert('Thành công', 'Đã cập nhật thông tin khách hàng', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error('Error updating customer:', error);
      Alert.alert('Lỗi', 'Không thể cập nhật thông tin khách hàng');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Chỉnh sửa khách hàng',
          headerBackTitle: 'Quay lại',
        }}
      />
      <ScrollView style={commonStyles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin cơ bản</Text>

          <TouchableOpacity style={styles.avatarPicker} onPress={pickImage}>
            {avatar ? (
              <Image source={{ uri: avatar }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <IconSymbol name="camera.fill" size={32} color={colors.textSecondary} />
                <Text style={styles.avatarText}>Chọn ảnh</Text>
              </View>
            )}
          </TouchableOpacity>

          <Text style={commonStyles.label}>Họ và tên *</Text>
          <TextInput
            style={commonStyles.input}
            value={fullName}
            onChangeText={setFullName}
            placeholder="Nhập họ và tên"
            placeholderTextColor={colors.textSecondary}
          />

          <Text style={commonStyles.label}>Ngày sinh *</Text>
          <TouchableOpacity
            style={[commonStyles.input, styles.dateButton]}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateText}>{dateOfBirth.toLocaleDateString('vi-VN')}</Text>
            <IconSymbol name="calendar" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={dateOfBirth}
              mode="date"
              display="default"
              onChange={(event, date) => {
                setShowDatePicker(Platform.OS === 'ios');
                if (date) setDateOfBirth(date);
              }}
              maximumDate={new Date()}
            />
          )}

          <Text style={commonStyles.label}>Số điện thoại *</Text>
          <TextInput
            style={commonStyles.input}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="Nhập số điện thoại"
            placeholderTextColor={colors.textSecondary}
            keyboardType="phone-pad"
          />

          <Text style={commonStyles.label}>Địa chỉ</Text>
          <TextInput
            style={commonStyles.input}
            value={address}
            onChangeText={setAddress}
            placeholder="Nhập địa chỉ"
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin bảo hiểm</Text>

          <TouchableOpacity
            style={styles.switchContainer}
            onPress={() => setHasInsurance(!hasInsurance)}
          >
            <Text style={styles.switchLabel}>Đã tham gia bảo hiểm</Text>
            <View style={[styles.switch, hasInsurance && styles.switchActive]}>
              <View style={[styles.switchThumb, hasInsurance && styles.switchThumbActive]} />
            </View>
          </TouchableOpacity>

          {hasInsurance && (
            <>
              <Text style={commonStyles.label}>Công ty bảo hiểm *</Text>
              <TouchableOpacity
                style={[commonStyles.input, styles.pickerButton]}
                onPress={() => setShowCompanyPicker(!showCompanyPicker)}
              >
                <Text style={insuranceCompany ? styles.pickerText : styles.pickerPlaceholder}>
                  {insuranceCompany || 'Chọn công ty bảo hiểm'}
                </Text>
                <IconSymbol name="chevron.down" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
              {showCompanyPicker && (
                <View style={styles.pickerList}>
                  {INSURANCE_COMPANIES.map((company) => (
                    <TouchableOpacity
                      key={company}
                      style={styles.pickerItem}
                      onPress={() => {
                        setInsuranceCompany(company);
                        setShowCompanyPicker(false);
                      }}
                    >
                      <Text style={styles.pickerItemText}>{company}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              <Text style={commonStyles.label}>Số hợp đồng</Text>
              <TextInput
                style={commonStyles.input}
                value={contractNumber}
                onChangeText={setContractNumber}
                placeholder="Nhập số hợp đồng"
                placeholderTextColor={colors.textSecondary}
              />

              <Text style={commonStyles.label}>Số bảo mật</Text>
              <TextInput
                style={commonStyles.input}
                value={securityNumber}
                onChangeText={setSecurityNumber}
                placeholder="Nhập số bảo mật"
                placeholderTextColor={colors.textSecondary}
              />

              <Text style={commonStyles.label}>Ngày tham gia bảo hiểm</Text>
              <TouchableOpacity
                style={[commonStyles.input, styles.dateButton]}
                onPress={() => setShowStartDatePicker(true)}
              >
                <Text style={styles.dateText}>{insuranceStartDate.toLocaleDateString('vi-VN')}</Text>
                <IconSymbol name="calendar" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
              {showStartDatePicker && (
                <DateTimePicker
                  value={insuranceStartDate}
                  mode="date"
                  display="default"
                  onChange={(event, date) => {
                    setShowStartDatePicker(Platform.OS === 'ios');
                    if (date) setInsuranceStartDate(date);
                  }}
                  maximumDate={new Date()}
                />
              )}

              <Text style={commonStyles.label}>Số tiền phí bảo hiểm</Text>
              <TextInput
                style={commonStyles.input}
                value={premiumAmount}
                onChangeText={setPremiumAmount}
                placeholder="Nhập số tiền"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
              />

              <Text style={commonStyles.label}>Kỳ đóng phí</Text>
              <TouchableOpacity
                style={[commonStyles.input, styles.pickerButton]}
                onPress={() => setShowFrequencyPicker(!showFrequencyPicker)}
              >
                <Text style={styles.pickerText}>
                  {PREMIUM_FREQUENCIES.find(f => f.value === premiumFrequency)?.label}
                </Text>
                <IconSymbol name="chevron.down" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
              {showFrequencyPicker && (
                <View style={styles.pickerList}>
                  {PREMIUM_FREQUENCIES.map((freq) => (
                    <TouchableOpacity
                      key={freq.value}
                      style={styles.pickerItem}
                      onPress={() => {
                        setPremiumFrequency(freq.value as any);
                        setShowFrequencyPicker(false);
                      }}
                    >
                      <Text style={styles.pickerItemText}>{freq.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              <Text style={commonStyles.label}>Ngày đến hạn đóng phí tiếp theo</Text>
              <TouchableOpacity
                style={[commonStyles.input, styles.dateButton]}
                onPress={() => setShowDueDatePicker(true)}
              >
                <Text style={styles.dateText}>{nextPremiumDueDate.toLocaleDateString('vi-VN')}</Text>
                <IconSymbol name="calendar" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
              {showDueDatePicker && (
                <DateTimePicker
                  value={nextPremiumDueDate}
                  mode="date"
                  display="default"
                  onChange={(event, date) => {
                    setShowDueDatePicker(Platform.OS === 'ios');
                    if (date) setNextPremiumDueDate(date);
                  }}
                />
              )}
            </>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ghi chú</Text>
          <TextInput
            style={[commonStyles.input, styles.notesInput]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Nhập ghi chú"
            placeholderTextColor={colors.textSecondary}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => router.back()}
          >
            <Text style={styles.cancelButtonText}>Hủy</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.submitButton, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'Đang lưu...' : 'Cập nhật'}
            </Text>
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
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  avatarPicker: {
    alignSelf: 'center',
    marginBottom: 24,
  },
  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.inputBackground,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  avatarText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
  },
  dateButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    color: colors.text,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 16,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  switch: {
    width: 51,
    height: 31,
    borderRadius: 15.5,
    backgroundColor: colors.secondary,
    padding: 2,
    justifyContent: 'center',
  },
  switchActive: {
    backgroundColor: colors.success,
  },
  switchThumb: {
    width: 27,
    height: 27,
    borderRadius: 13.5,
    backgroundColor: '#FFFFFF',
  },
  switchThumbActive: {
    alignSelf: 'flex-end',
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
  notesInput: {
    height: 100,
    paddingTop: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: colors.secondary,
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: colors.primary,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
