
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
import { VIETNAM_ADDRESSES, getDistrictsByProvince, getWardsByDistrict } from '@/data/vietnamAddresses';
import { calculateNextPremiumDueDate } from '@/utils/dateUtils';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';

const CUSTOMER_STATUSES = ['Đã ký', 'Tiềm Năng', 'Loại bỏ'] as const;

export default function EditCustomerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getCustomerById, updateCustomer, isPhoneNumberUnique, isContractNumberUnique } = useCustomers();
  const customer = getCustomerById(id);

  const [avatar, setAvatar] = useState('');
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  
  // Address fields
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedWard, setSelectedWard] = useState('');
  const [street, setStreet] = useState('');
  const [showProvincePicker, setShowProvincePicker] = useState(false);
  const [showDistrictPicker, setShowDistrictPicker] = useState(false);
  const [showWardPicker, setShowWardPicker] = useState(false);
  
  const [hasInsurance, setHasInsurance] = useState(false);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [showCompanyPicker, setShowCompanyPicker] = useState(false);
  const [contractNumber, setContractNumber] = useState('');
  const [insuranceStartDate, setInsuranceStartDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [premiumAmount, setPremiumAmount] = useState('');
  const [premiumFrequency, setPremiumFrequency] = useState<'monthly' | 'quarterly' | 'semi-annual' | 'annual'>('monthly');
  const [showFrequencyPicker, setShowFrequencyPicker] = useState(false);
  const [notes, setNotes] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // New fields
  const [customerStatus, setCustomerStatus] = useState<'Đã ký' | 'Tiềm Năng' | 'Loại bỏ'>('Tiềm Năng');
  const [showStatusPicker, setShowStatusPicker] = useState(false);
  const [paidUntil, setPaidUntil] = useState<Date | undefined>(undefined);
  const [showPaidUntilPicker, setShowPaidUntilPicker] = useState(false);
  const [meetingDate, setMeetingDate] = useState<Date | undefined>(undefined);
  const [showMeetingDatePicker, setShowMeetingDatePicker] = useState(false);

  useEffect(() => {
    if (customer) {
      setAvatar(customer.avatar || '');
      setFullName(customer.fullName);
      setDateOfBirth(new Date(customer.dateOfBirth));
      setPhoneNumber(customer.phoneNumber);
      
      // Set address fields
      if (customer.address) {
        const province = VIETNAM_ADDRESSES.find(p => p.name === customer.address?.province);
        if (province) {
          setSelectedProvince(province.code);
          const district = province.districts.find(d => d.name === customer.address?.district);
          if (district) {
            setSelectedDistrict(district.code);
            const ward = district.wards.find(w => w.name === customer.address?.ward);
            if (ward) {
              setSelectedWard(ward.code);
            }
          }
        }
        setStreet(customer.address.street || '');
      }
      
      setHasInsurance(customer.hasInsurance);
      setSelectedCompanies(customer.insuranceCompany || []);
      setContractNumber(customer.contractNumber || '');
      setInsuranceStartDate(customer.insuranceStartDate ? new Date(customer.insuranceStartDate) : new Date());
      setPremiumAmount(customer.premiumAmount ? customer.premiumAmount.toString() : '');
      setPremiumFrequency(customer.premiumFrequency || 'monthly');
      setNotes(customer.notes || '');
      setImages(customer.images || []);
      setVideos(customer.videos || []);
      
      // Set new fields
      setCustomerStatus(customer.customerStatus || 'Tiềm Năng');
      setPaidUntil(customer.paidUntil ? new Date(customer.paidUntil) : undefined);
      setMeetingDate(customer.meetingDate ? new Date(customer.meetingDate) : undefined);
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

  const pickMedia = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      const newImages: string[] = [];
      const newVideos: string[] = [];
      
      result.assets.forEach(asset => {
        if (asset.type === 'video') {
          newVideos.push(asset.uri);
        } else {
          newImages.push(asset.uri);
        }
      });
      
      setImages([...images, ...newImages]);
      setVideos([...videos, ...newVideos]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const removeVideo = (index: number) => {
    setVideos(videos.filter((_, i) => i !== index));
  };

  const toggleCompany = (company: string) => {
    if (selectedCompanies.includes(company)) {
      setSelectedCompanies(selectedCompanies.filter(c => c !== company));
    } else {
      setSelectedCompanies([...selectedCompanies, company]);
    }
  };

  const getProvinceByCode = (code: string) => {
    return VIETNAM_ADDRESSES.find(p => p.code === code);
  };

  const getDistrictByCode = (provinceCode: string, districtCode: string) => {
    const districts = getDistrictsByProvince(provinceCode);
    return districts.find(d => d.code === districtCode);
  };

  const getWardByCode = (provinceCode: string, districtCode: string, wardCode: string) => {
    const wards = getWardsByDistrict(provinceCode, districtCode);
    return wards.find(w => w.code === wardCode);
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
      if (selectedCompanies.length === 0) {
        Alert.alert('Lỗi', 'Vui lòng chọn ít nhất một công ty bảo hiểm');
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
      // Calculate next premium due date automatically
      let nextDueDate: string | undefined;
      if (hasInsurance && insuranceStartDate && premiumFrequency) {
        const calculatedDate = calculateNextPremiumDueDate(insuranceStartDate, premiumFrequency);
        nextDueDate = calculatedDate.toISOString();
      }

      await updateCustomer(customer.id, {
        avatar,
        fullName: fullName.trim(),
        dateOfBirth: dateOfBirth.toISOString(),
        phoneNumber: phoneNumber.trim(),
        address: {
          province: selectedProvince ? getProvinceByCode(selectedProvince)?.name : undefined,
          district: selectedDistrict ? getDistrictByCode(selectedProvince, selectedDistrict)?.name : undefined,
          ward: selectedWard ? getWardByCode(selectedProvince, selectedDistrict, selectedWard)?.name : undefined,
          street: street.trim() || undefined,
        },
        hasInsurance,
        insuranceCompany: hasInsurance && selectedCompanies.length > 0 ? selectedCompanies : undefined,
        contractNumber: hasInsurance && contractNumber ? contractNumber.trim() : undefined,
        insuranceStartDate: hasInsurance ? insuranceStartDate.toISOString() : undefined,
        premiumAmount: hasInsurance && premiumAmount ? parseFloat(premiumAmount) : undefined,
        premiumFrequency: hasInsurance ? premiumFrequency : undefined,
        nextPremiumDueDate: nextDueDate,
        notes: notes.trim(),
        images: images.length > 0 ? images : undefined,
        videos: videos.length > 0 ? videos : undefined,
        customerStatus,
        paidUntil: paidUntil ? paidUntil.toISOString() : undefined,
        meetingDate: meetingDate ? meetingDate.toISOString() : undefined,
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
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, date) => {
                if (event.type === 'dismissed') {
                  setShowDatePicker(false);
                  return;
                }
                if (date) {
                  setDateOfBirth(date);
                }
                if (Platform.OS === 'android') {
                  setShowDatePicker(false);
                }
              }}
              maximumDate={new Date()}
            />
          )}
          {showDatePicker && Platform.OS === 'ios' && (
            <TouchableOpacity
              style={styles.datePickerDoneButton}
              onPress={() => setShowDatePicker(false)}
            >
              <Text style={styles.datePickerDoneText}>Xong</Text>
            </TouchableOpacity>
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

          <Text style={commonStyles.label}>Tỉnh/Thành phố</Text>
          <TouchableOpacity
            style={[commonStyles.input, styles.pickerButton]}
            onPress={() => setShowProvincePicker(!showProvincePicker)}
          >
            <Text style={selectedProvince ? styles.pickerText : styles.pickerPlaceholder}>
              {selectedProvince ? getProvinceByCode(selectedProvince)?.name : 'Chọn tỉnh/thành phố'}
            </Text>
            <IconSymbol name="chevron.down" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          {showProvincePicker && (
            <View style={styles.pickerList}>
              <ScrollView style={styles.pickerScrollView}>
                {VIETNAM_ADDRESSES.map((province) => (
                  <TouchableOpacity
                    key={province.code}
                    style={styles.pickerItem}
                    onPress={() => {
                      setSelectedProvince(province.code);
                      setSelectedDistrict('');
                      setSelectedWard('');
                      setShowProvincePicker(false);
                    }}
                  >
                    <Text style={styles.pickerItemText}>{province.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {selectedProvince && (
            <>
              <Text style={commonStyles.label}>Quận/Huyện</Text>
              <TouchableOpacity
                style={[commonStyles.input, styles.pickerButton]}
                onPress={() => setShowDistrictPicker(!showDistrictPicker)}
              >
                <Text style={selectedDistrict ? styles.pickerText : styles.pickerPlaceholder}>
                  {selectedDistrict ? getDistrictByCode(selectedProvince, selectedDistrict)?.name : 'Chọn quận/huyện'}
                </Text>
                <IconSymbol name="chevron.down" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
              {showDistrictPicker && (
                <View style={styles.pickerList}>
                  <ScrollView style={styles.pickerScrollView}>
                    {getDistrictsByProvince(selectedProvince).map((district) => (
                      <TouchableOpacity
                        key={district.code}
                        style={styles.pickerItem}
                        onPress={() => {
                          setSelectedDistrict(district.code);
                          setSelectedWard('');
                          setShowDistrictPicker(false);
                        }}
                      >
                        <Text style={styles.pickerItemText}>{district.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </>
          )}

          {selectedDistrict && (
            <>
              <Text style={commonStyles.label}>Phường/Xã</Text>
              <TouchableOpacity
                style={[commonStyles.input, styles.pickerButton]}
                onPress={() => setShowWardPicker(!showWardPicker)}
              >
                <Text style={selectedWard ? styles.pickerText : styles.pickerPlaceholder}>
                  {selectedWard ? getWardByCode(selectedProvince, selectedDistrict, selectedWard)?.name : 'Chọn phường/xã'}
                </Text>
                <IconSymbol name="chevron.down" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
              {showWardPicker && (
                <View style={styles.pickerList}>
                  <ScrollView style={styles.pickerScrollView}>
                    {getWardsByDistrict(selectedProvince, selectedDistrict).map((ward) => (
                      <TouchableOpacity
                        key={ward.code}
                        style={styles.pickerItem}
                        onPress={() => {
                          setSelectedWard(ward.code);
                          setShowWardPicker(false);
                        }}
                      >
                        <Text style={styles.pickerItemText}>{ward.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </>
          )}

          <Text style={commonStyles.label}>Số nhà, tên đường</Text>
          <TextInput
            style={commonStyles.input}
            value={street}
            onChangeText={setStreet}
            placeholder="Nhập số nhà, tên đường"
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Phân loại khách hàng</Text>

          <Text style={commonStyles.label}>Trạng thái khách hàng *</Text>
          <TouchableOpacity
            style={[commonStyles.input, styles.pickerButton]}
            onPress={() => setShowStatusPicker(!showStatusPicker)}
          >
            <Text style={styles.pickerText}>{customerStatus}</Text>
            <IconSymbol name="chevron.down" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          {showStatusPicker && (
            <View style={styles.pickerList}>
              {CUSTOMER_STATUSES.map((status) => (
                <TouchableOpacity
                  key={status}
                  style={styles.pickerItem}
                  onPress={() => {
                    setCustomerStatus(status);
                    setShowStatusPicker(false);
                  }}
                >
                  <Text style={styles.pickerItemText}>{status}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <Text style={commonStyles.label}>Ngày gặp khách hàng</Text>
          <TouchableOpacity
            style={[commonStyles.input, styles.dateButton]}
            onPress={() => setShowMeetingDatePicker(true)}
          >
            <Text style={styles.dateText}>
              {meetingDate ? meetingDate.toLocaleDateString('vi-VN') : 'Chọn ngày gặp'}
            </Text>
            <IconSymbol name="calendar" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          {showMeetingDatePicker && (
            <DateTimePicker
              value={meetingDate || new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, date) => {
                if (event.type === 'dismissed') {
                  setShowMeetingDatePicker(false);
                  return;
                }
                if (date) {
                  setMeetingDate(date);
                }
                if (Platform.OS === 'android') {
                  setShowMeetingDatePicker(false);
                }
              }}
            />
          )}
          {showMeetingDatePicker && Platform.OS === 'ios' && (
            <TouchableOpacity
              style={styles.datePickerDoneButton}
              onPress={() => setShowMeetingDatePicker(false)}
            >
              <Text style={styles.datePickerDoneText}>Xong</Text>
            </TouchableOpacity>
          )}
          {meetingDate && (
            <TouchableOpacity
              style={styles.clearDateButton}
              onPress={() => setMeetingDate(undefined)}
            >
              <Text style={styles.clearDateText}>Xóa ngày gặp</Text>
            </TouchableOpacity>
          )}
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
              <Text style={commonStyles.label}>Công ty bảo hiểm * (có thể chọn nhiều)</Text>
              <TouchableOpacity
                style={[commonStyles.input, styles.pickerButton]}
                onPress={() => setShowCompanyPicker(!showCompanyPicker)}
              >
                <Text style={selectedCompanies.length > 0 ? styles.pickerText : styles.pickerPlaceholder}>
                  {selectedCompanies.length > 0 ? `Đã chọn ${selectedCompanies.length} công ty` : 'Chọn công ty bảo hiểm'}
                </Text>
                <IconSymbol name="chevron.down" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
              {showCompanyPicker && (
                <View style={styles.pickerList}>
                  <ScrollView style={styles.pickerScrollView}>
                    {INSURANCE_COMPANIES.map((company) => (
                      <TouchableOpacity
                        key={company}
                        style={[
                          styles.pickerItem,
                          selectedCompanies.includes(company) && styles.pickerItemSelected
                        ]}
                        onPress={() => toggleCompany(company)}
                      >
                        <Text style={[
                          styles.pickerItemText,
                          selectedCompanies.includes(company) && styles.pickerItemTextSelected
                        ]}>
                          {company}
                        </Text>
                        {selectedCompanies.includes(company) && (
                          <IconSymbol name="checkmark" size={20} color={colors.primary} />
                        )}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                  <TouchableOpacity
                    style={styles.pickerDoneButton}
                    onPress={() => setShowCompanyPicker(false)}
                  >
                    <Text style={styles.pickerDoneText}>Xong</Text>
                  </TouchableOpacity>
                </View>
              )}
              {selectedCompanies.length > 0 && (
                <View style={styles.selectedCompaniesContainer}>
                  {selectedCompanies.map((company) => (
                    <View key={company} style={styles.selectedCompanyChip}>
                      <Text style={styles.selectedCompanyText}>{company}</Text>
                      <TouchableOpacity onPress={() => toggleCompany(company)}>
                        <IconSymbol name="xmark.circle.fill" size={18} color={colors.textSecondary} />
                      </TouchableOpacity>
                    </View>
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
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(event, date) => {
                    if (event.type === 'dismissed') {
                      setShowStartDatePicker(false);
                      return;
                    }
                    if (date) {
                      setInsuranceStartDate(date);
                    }
                    if (Platform.OS === 'android') {
                      setShowStartDatePicker(false);
                    }
                  }}
                  maximumDate={new Date()}
                />
              )}
              {showStartDatePicker && Platform.OS === 'ios' && (
                <TouchableOpacity
                  style={styles.datePickerDoneButton}
                  onPress={() => setShowStartDatePicker(false)}
                >
                  <Text style={styles.datePickerDoneText}>Xong</Text>
                </TouchableOpacity>
              )}

              <Text style={commonStyles.label}>Số tiền phí bảo hiểm (VNĐ)</Text>
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

              <Text style={commonStyles.label}>Đã đóng phí đến ngày</Text>
              <TouchableOpacity
                style={[commonStyles.input, styles.dateButton]}
                onPress={() => setShowPaidUntilPicker(true)}
              >
                <Text style={styles.dateText}>
                  {paidUntil ? paidUntil.toLocaleDateString('vi-VN') : 'Chọn ngày đã đóng'}
                </Text>
                <IconSymbol name="calendar" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
              {showPaidUntilPicker && (
                <DateTimePicker
                  value={paidUntil || new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(event, date) => {
                    if (event.type === 'dismissed') {
                      setShowPaidUntilPicker(false);
                      return;
                    }
                    if (date) {
                      setPaidUntil(date);
                    }
                    if (Platform.OS === 'android') {
                      setShowPaidUntilPicker(false);
                    }
                  }}
                />
              )}
              {showPaidUntilPicker && Platform.OS === 'ios' && (
                <TouchableOpacity
                  style={styles.datePickerDoneButton}
                  onPress={() => setShowPaidUntilPicker(false)}
                >
                  <Text style={styles.datePickerDoneText}>Xong</Text>
                </TouchableOpacity>
              )}
              {paidUntil && (
                <TouchableOpacity
                  style={styles.clearDateButton}
                  onPress={() => setPaidUntil(undefined)}
                >
                  <Text style={styles.clearDateText}>Xóa ngày đã đóng</Text>
                </TouchableOpacity>
              )}

              <View style={styles.infoBox}>
                <IconSymbol name="info.circle" size={20} color={colors.primary} />
                <Text style={styles.infoText}>
                  Ngày đến hạn đóng phí tiếp theo sẽ được tự động tính toán dựa trên ngày tham gia và kỳ đóng phí
                </Text>
              </View>
            </>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hình ảnh và Video</Text>
          
          <TouchableOpacity style={styles.mediaButton} onPress={pickMedia}>
            <IconSymbol name="photo.on.rectangle" size={24} color={colors.primary} />
            <Text style={styles.mediaButtonText}>Thêm hình ảnh/video</Text>
          </TouchableOpacity>

          {images.length > 0 && (
            <View style={styles.mediaSection}>
              <Text style={styles.mediaLabel}>Hình ảnh ({images.length})</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mediaScroll}>
                {images.map((uri, index) => (
                  <View key={index} style={styles.mediaItem}>
                    <Image source={{ uri }} style={styles.mediaImage} />
                    <TouchableOpacity
                      style={styles.mediaRemoveButton}
                      onPress={() => removeImage(index)}
                    >
                      <IconSymbol name="xmark.circle.fill" size={24} color="#FF3B30" />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {videos.length > 0 && (
            <View style={styles.mediaSection}>
              <Text style={styles.mediaLabel}>Video ({videos.length})</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mediaScroll}>
                {videos.map((uri, index) => (
                  <View key={index} style={styles.mediaItem}>
                    <View style={styles.videoPlaceholder}>
                      <IconSymbol name="play.circle.fill" size={48} color={colors.primary} />
                    </View>
                    <TouchableOpacity
                      style={styles.mediaRemoveButton}
                      onPress={() => removeVideo(index)}
                    >
                      <IconSymbol name="xmark.circle.fill" size={24} color="#FF3B30" />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>
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
  datePickerDoneButton: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  datePickerDoneText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  clearDateButton: {
    backgroundColor: colors.secondary,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  clearDateText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
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
    marginTop: 8,
    marginBottom: 12,
    maxHeight: 250,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerItemSelected: {
    backgroundColor: colors.inputBackground,
  },
  pickerItemText: {
    fontSize: 16,
    color: colors.text,
  },
  pickerItemTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  pickerDoneButton: {
    backgroundColor: colors.primary,
    padding: 12,
    alignItems: 'center',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  pickerDoneText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  selectedCompaniesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
    marginBottom: 12,
  },
  selectedCompanyChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  selectedCompanyText: {
    fontSize: 14,
    color: colors.text,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: colors.inputBackground,
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    gap: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  mediaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.inputBackground,
    padding: 16,
    borderRadius: 8,
    gap: 8,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  mediaButtonText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  mediaSection: {
    marginTop: 16,
  },
  mediaLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  mediaScroll: {
    marginBottom: 8,
  },
  mediaItem: {
    marginRight: 12,
    position: 'relative',
  },
  mediaImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  videoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: colors.inputBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaRemoveButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
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
