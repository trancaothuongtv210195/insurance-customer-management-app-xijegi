
// Vietnamese administrative divisions data
export interface Ward {
  name: string;
  code: string;
}

export interface District {
  name: string;
  code: string;
  wards: Ward[];
}

export interface Province {
  name: string;
  code: string;
  districts: District[];
}

// Simplified Vietnamese address data - you can expand this with complete data
export const VIETNAM_ADDRESSES: Province[] = [
  {
    name: 'Hồ Chí Minh',
    code: 'HCM',
    districts: [
      {
        name: 'Quận 1',
        code: 'Q1',
        wards: [
          { name: 'Phường Bến Nghé', code: 'BN' },
          { name: 'Phường Bến Thành', code: 'BT' },
          { name: 'Phường Cầu Kho', code: 'CK' },
          { name: 'Phường Cầu Ông Lãnh', code: 'COL' },
          { name: 'Phường Cô Giang', code: 'CG' },
          { name: 'Phường Đa Kao', code: 'DK' },
          { name: 'Phường Nguyễn Cư Trinh', code: 'NCT' },
          { name: 'Phường Nguyễn Thái Bình', code: 'NTB' },
          { name: 'Phường Phạm Ngũ Lão', code: 'PNL' },
          { name: 'Phường Tân Định', code: 'TD' },
        ],
      },
      {
        name: 'Quận 2',
        code: 'Q2',
        wards: [
          { name: 'Phường An Khánh', code: 'AK' },
          { name: 'Phường An Lợi Đông', code: 'ALD' },
          { name: 'Phường An Phú', code: 'AP' },
          { name: 'Phường Bình An', code: 'BA' },
          { name: 'Phường Bình Khánh', code: 'BK' },
          { name: 'Phường Bình Trưng Đông', code: 'BTD' },
          { name: 'Phường Bình Trưng Tây', code: 'BTT' },
          { name: 'Phường Cát Lái', code: 'CL' },
          { name: 'Phường Thảo Điền', code: 'TD' },
          { name: 'Phường Thạnh Mỹ Lợi', code: 'TML' },
          { name: 'Phường Thủ Thiêm', code: 'TT' },
        ],
      },
      {
        name: 'Quận 3',
        code: 'Q3',
        wards: [
          { name: 'Phường 01', code: 'P01' },
          { name: 'Phường 02', code: 'P02' },
          { name: 'Phường 03', code: 'P03' },
          { name: 'Phường 04', code: 'P04' },
          { name: 'Phường 05', code: 'P05' },
          { name: 'Phường 06', code: 'P06' },
          { name: 'Phường 07', code: 'P07' },
          { name: 'Phường 08', code: 'P08' },
          { name: 'Phường 09', code: 'P09' },
          { name: 'Phường 10', code: 'P10' },
          { name: 'Phường 11', code: 'P11' },
          { name: 'Phường 12', code: 'P12' },
          { name: 'Phường 13', code: 'P13' },
          { name: 'Phường 14', code: 'P14' },
        ],
      },
      {
        name: 'Quận 4',
        code: 'Q4',
        wards: [
          { name: 'Phường 01', code: 'P01' },
          { name: 'Phường 02', code: 'P02' },
          { name: 'Phường 03', code: 'P03' },
          { name: 'Phường 04', code: 'P04' },
          { name: 'Phường 06', code: 'P06' },
          { name: 'Phường 08', code: 'P08' },
          { name: 'Phường 09', code: 'P09' },
          { name: 'Phường 10', code: 'P10' },
          { name: 'Phường 13', code: 'P13' },
          { name: 'Phường 14', code: 'P14' },
          { name: 'Phường 15', code: 'P15' },
          { name: 'Phường 16', code: 'P16' },
          { name: 'Phường 18', code: 'P18' },
        ],
      },
      {
        name: 'Quận 5',
        code: 'Q5',
        wards: [
          { name: 'Phường 01', code: 'P01' },
          { name: 'Phường 02', code: 'P02' },
          { name: 'Phường 03', code: 'P03' },
          { name: 'Phường 04', code: 'P04' },
          { name: 'Phường 05', code: 'P05' },
          { name: 'Phường 06', code: 'P06' },
          { name: 'Phường 07', code: 'P07' },
          { name: 'Phường 08', code: 'P08' },
          { name: 'Phường 09', code: 'P09' },
          { name: 'Phường 10', code: 'P10' },
          { name: 'Phường 11', code: 'P11' },
          { name: 'Phường 12', code: 'P12' },
          { name: 'Phường 13', code: 'P13' },
          { name: 'Phường 14', code: 'P14' },
          { name: 'Phường 15', code: 'P15' },
        ],
      },
      {
        name: 'Quận 6',
        code: 'Q6',
        wards: [
          { name: 'Phường 01', code: 'P01' },
          { name: 'Phường 02', code: 'P02' },
          { name: 'Phường 03', code: 'P03' },
          { name: 'Phường 04', code: 'P04' },
          { name: 'Phường 05', code: 'P05' },
          { name: 'Phường 06', code: 'P06' },
          { name: 'Phường 07', code: 'P07' },
          { name: 'Phường 08', code: 'P08' },
          { name: 'Phường 09', code: 'P09' },
          { name: 'Phường 10', code: 'P10' },
          { name: 'Phường 11', code: 'P11' },
          { name: 'Phường 12', code: 'P12' },
          { name: 'Phường 13', code: 'P13' },
          { name: 'Phường 14', code: 'P14' },
        ],
      },
      {
        name: 'Quận 7',
        code: 'Q7',
        wards: [
          { name: 'Phường Bình Thuận', code: 'BT' },
          { name: 'Phường Phú Mỹ', code: 'PM' },
          { name: 'Phường Phú Thuận', code: 'PT' },
          { name: 'Phường Tân Hưng', code: 'TH' },
          { name: 'Phường Tân Kiểng', code: 'TK' },
          { name: 'Phường Tân Phong', code: 'TP' },
          { name: 'Phường Tân Phú', code: 'TPH' },
          { name: 'Phường Tân Quy', code: 'TQ' },
          { name: 'Phường Tân Thuận Đông', code: 'TTD' },
          { name: 'Phường Tân Thuận Tây', code: 'TTT' },
        ],
      },
      {
        name: 'Quận 8',
        code: 'Q8',
        wards: [
          { name: 'Phường 01', code: 'P01' },
          { name: 'Phường 02', code: 'P02' },
          { name: 'Phường 03', code: 'P03' },
          { name: 'Phường 04', code: 'P04' },
          { name: 'Phường 05', code: 'P05' },
          { name: 'Phường 06', code: 'P06' },
          { name: 'Phường 07', code: 'P07' },
          { name: 'Phường 08', code: 'P08' },
          { name: 'Phường 09', code: 'P09' },
          { name: 'Phường 10', code: 'P10' },
          { name: 'Phường 11', code: 'P11' },
          { name: 'Phường 12', code: 'P12' },
          { name: 'Phường 13', code: 'P13' },
          { name: 'Phường 14', code: 'P14' },
          { name: 'Phường 15', code: 'P15' },
          { name: 'Phường 16', code: 'P16' },
        ],
      },
    ],
  },
  {
    name: 'Hà Nội',
    code: 'HN',
    districts: [
      {
        name: 'Quận Ba Đình',
        code: 'BD',
        wards: [
          { name: 'Phường Cống Vị', code: 'CV' },
          { name: 'Phường Điện Biên', code: 'DB' },
          { name: 'Phường Đội Cấn', code: 'DC' },
          { name: 'Phường Giảng Võ', code: 'GV' },
          { name: 'Phường Kim Mã', code: 'KM' },
          { name: 'Phường Liễu Giai', code: 'LG' },
          { name: 'Phường Ngọc Hà', code: 'NH' },
          { name: 'Phường Ngọc Khánh', code: 'NK' },
          { name: 'Phường Nguyễn Trung Trực', code: 'NTT' },
          { name: 'Phường Phúc Xá', code: 'PX' },
          { name: 'Phường Quán Thánh', code: 'QT' },
          { name: 'Phường Thành Công', code: 'TC' },
          { name: 'Phường Trúc Bạch', code: 'TB' },
          { name: 'Phường Vĩnh Phúc', code: 'VP' },
        ],
      },
      {
        name: 'Quận Hoàn Kiếm',
        code: 'HK',
        wards: [
          { name: 'Phường Chương Dương', code: 'CD' },
          { name: 'Phường Cửa Đông', code: 'CDO' },
          { name: 'Phường Cửa Nam', code: 'CN' },
          { name: 'Phường Đồng Xuân', code: 'DX' },
          { name: 'Phường Hàng Bạc', code: 'HB' },
          { name: 'Phường Hàng Bài', code: 'HBA' },
          { name: 'Phường Hàng Bồ', code: 'HBO' },
          { name: 'Phường Hàng Bông', code: 'HBON' },
          { name: 'Phường Hàng Buồm', code: 'HBU' },
          { name: 'Phường Hàng Đào', code: 'HD' },
          { name: 'Phường Hàng Gai', code: 'HG' },
          { name: 'Phường Hàng Mã', code: 'HM' },
          { name: 'Phường Hàng Trống', code: 'HT' },
          { name: 'Phường Lý Thái Tổ', code: 'LTT' },
          { name: 'Phường Phan Chu Trinh', code: 'PCT' },
          { name: 'Phường Phúc Tân', code: 'PT' },
          { name: 'Phường Tràng Tiền', code: 'TT' },
          { name: 'Phường Trần Hưng Đạo', code: 'THD' },
        ],
      },
      {
        name: 'Quận Hai Bà Trưng',
        code: 'HBT',
        wards: [
          { name: 'Phường Bạch Đằng', code: 'BD' },
          { name: 'Phường Bạch Mai', code: 'BM' },
          { name: 'Phường Cầu Dền', code: 'CD' },
          { name: 'Phường Đống Mác', code: 'DM' },
          { name: 'Phường Đồng Nhân', code: 'DN' },
          { name: 'Phường Đồng Tâm', code: 'DT' },
          { name: 'Phường Lê Đại Hành', code: 'LDH' },
          { name: 'Phường Minh Khai', code: 'MK' },
          { name: 'Phường Ngô Thì Nhậm', code: 'NTN' },
          { name: 'Phường Nguyễn Du', code: 'ND' },
          { name: 'Phường Phạm Đình Hổ', code: 'PDH' },
          { name: 'Phường Phố Huế', code: 'PH' },
          { name: 'Phường Quỳnh Lôi', code: 'QL' },
          { name: 'Phường Quỳnh Mai', code: 'QM' },
          { name: 'Phường Thanh Lương', code: 'TL' },
          { name: 'Phường Thanh Nhàn', code: 'TN' },
          { name: 'Phường Trương Định', code: 'TD' },
          { name: 'Phường Vĩnh Tuy', code: 'VT' },
        ],
      },
    ],
  },
  {
    name: 'Đà Nẵng',
    code: 'DN',
    districts: [
      {
        name: 'Quận Hải Châu',
        code: 'HC',
        wards: [
          { name: 'Phường Bình Hiên', code: 'BH' },
          { name: 'Phường Bình Thuận', code: 'BT' },
          { name: 'Phường Hải Châu 1', code: 'HC1' },
          { name: 'Phường Hải Châu 2', code: 'HC2' },
          { name: 'Phường Hòa Cường Bắc', code: 'HCB' },
          { name: 'Phường Hòa Cường Nam', code: 'HCN' },
          { name: 'Phường Hòa Thuận Đông', code: 'HTD' },
          { name: 'Phường Hòa Thuận Tây', code: 'HTT' },
          { name: 'Phường Nam Dương', code: 'ND' },
          { name: 'Phường Phước Ninh', code: 'PN' },
          { name: 'Phường Thanh Bình', code: 'TB' },
          { name: 'Phường Thạch Thang', code: 'TT' },
          { name: 'Phường Thuận Phước', code: 'TP' },
        ],
      },
      {
        name: 'Quận Thanh Khê',
        code: 'TK',
        wards: [
          { name: 'Phường An Khê', code: 'AK' },
          { name: 'Phường Chính Gián', code: 'CG' },
          { name: 'Phường Hòa Khê', code: 'HK' },
          { name: 'Phường Tam Thuận', code: 'TT' },
          { name: 'Phường Tân Chính', code: 'TC' },
          { name: 'Phường Thanh Khê Đông', code: 'TKD' },
          { name: 'Phường Thanh Khê Tây', code: 'TKT' },
          { name: 'Phường Thạc Gián', code: 'TG' },
          { name: 'Phường Vĩnh Trung', code: 'VT' },
          { name: 'Phường Xuân Hà', code: 'XH' },
        ],
      },
    ],
  },
  {
    name: 'Cần Thơ',
    code: 'CT',
    districts: [
      {
        name: 'Quận Ninh Kiều',
        code: 'NK',
        wards: [
          { name: 'Phường An Bình', code: 'AB' },
          { name: 'Phường An Cư', code: 'AC' },
          { name: 'Phường An Hòa', code: 'AH' },
          { name: 'Phường An Khánh', code: 'AK' },
          { name: 'Phường An Nghiệp', code: 'AN' },
          { name: 'Phường An Phú', code: 'AP' },
          { name: 'Phường Cái Khế', code: 'CK' },
          { name: 'Phường Hưng Lợi', code: 'HL' },
          { name: 'Phường Tân An', code: 'TA' },
          { name: 'Phường Thới Bình', code: 'TB' },
          { name: 'Phường Xuân Khánh', code: 'XK' },
        ],
      },
      {
        name: 'Quận Bình Thủy',
        code: 'BT',
        wards: [
          { name: 'Phường An Thới', code: 'AT' },
          { name: 'Phường Bình Thủy', code: 'BT' },
          { name: 'Phường Bùi Hữu Nghĩa', code: 'BHN' },
          { name: 'Phường Long Hòa', code: 'LH' },
          { name: 'Phường Long Tuyền', code: 'LT' },
          { name: 'Phường Thới An Đông', code: 'TAD' },
          { name: 'Phường Trà An', code: 'TA' },
          { name: 'Phường Trà Nóc', code: 'TN' },
        ],
      },
    ],
  },
  {
    name: 'An Giang',
    code: 'AG',
    districts: [
      {
        name: 'Thành phố Long Xuyên',
        code: 'LX',
        wards: [
          { name: 'Phường Bình Đức', code: 'BD' },
          { name: 'Phường Bình Khánh', code: 'BK' },
          { name: 'Phường Đông Xuyên', code: 'DX' },
          { name: 'Phường Mỹ Bình', code: 'MB' },
          { name: 'Phường Mỹ Hòa', code: 'MH' },
          { name: 'Phường Mỹ Long', code: 'ML' },
          { name: 'Phường Mỹ Phước', code: 'MP' },
          { name: 'Phường Mỹ Quý', code: 'MQ' },
          { name: 'Phường Mỹ Thạnh', code: 'MT' },
          { name: 'Phường Mỹ Thới', code: 'MTO' },
          { name: 'Xã Mỹ Hòa Hưng', code: 'MHH' },
          { name: 'Xã Mỹ Khánh', code: 'MK' },
        ],
      },
    ],
  },
];

export const getDistrictsByProvince = (provinceCode: string): District[] => {
  const province = VIETNAM_ADDRESSES.find(p => p.code === provinceCode);
  return province ? province.districts : [];
};

export const getWardsByDistrict = (provinceCode: string, districtCode: string): Ward[] => {
  const province = VIETNAM_ADDRESSES.find(p => p.code === provinceCode);
  if (!province) return [];
  
  const district = province.districts.find(d => d.code === districtCode);
  return district ? district.wards : [];
};
