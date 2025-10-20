
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Alert, Platform } from 'react-native';

export const downloadMedia = async (uri: string, filename?: string): Promise<boolean> => {
  try {
    // Request permissions
    const { status } = await MediaLibrary.requestPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Lỗi', 'Cần cấp quyền truy cập thư viện ảnh để tải xuống');
      return false;
    }

    // Generate filename if not provided
    const fileExtension = uri.split('.').pop()?.split('?')[0] || 'jpg';
    const fileName = filename || `download_${Date.now()}.${fileExtension}`;
    
    // Download file to cache directory
    const cacheDir = FileSystem.cacheDirectory || '';
    const fileUri = cacheDir + fileName;
    
    console.log('Downloading media from:', uri);
    console.log('Saving to:', fileUri);
    
    const downloadResult = await FileSystem.downloadAsync(uri, fileUri);
    
    if (downloadResult.status !== 200) {
      throw new Error('Download failed');
    }

    // Save to media library
    const asset = await MediaLibrary.createAssetAsync(downloadResult.uri);
    
    // Create album if needed (optional)
    try {
      const album = await MediaLibrary.getAlbumAsync('Insurance App');
      if (album == null) {
        await MediaLibrary.createAlbumAsync('Insurance App', asset, false);
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      }
    } catch (error) {
      console.log('Could not create album, but file was saved:', error);
    }

    Alert.alert('Thành công', 'Đã lưu vào thư viện ảnh');
    return true;
  } catch (error) {
    console.error('Error downloading media:', error);
    Alert.alert('Lỗi', 'Không thể tải xuống tệp');
    return false;
  }
};

export const downloadVideo = async (uri: string, filename?: string): Promise<boolean> => {
  return downloadMedia(uri, filename);
};

export const downloadImage = async (uri: string, filename?: string): Promise<boolean> => {
  return downloadMedia(uri, filename);
};
