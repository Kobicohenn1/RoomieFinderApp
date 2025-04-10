import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import * as ImagePicker from 'expo-image-picker';
import {
  API_BASE_URL,
  BASE_URL,
  DEFAULT_PROFILE_IMAGE,
} from '../../../constants/config';
import ApartmentForm from '../../../components/ManageApartment/ApartmentForm';
import LogoutButton from '../../../components/LogoutButton';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfileData } from '../../store/slices/ProfileSlice';

// Error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error);
    console.error('Error info:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Something went wrong</Text>
          <Text style={styles.errorDetails}>{this.state.error?.message}</Text>
        </View>
      );
    }

    return this.props.children;
  }
}

const ProfileContent = () => {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const { userData, isLoading, error } = useSelector((state) => state.profile);
  const hasApartment = userData?.hasApartment ?? false;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProfileData());
  }, [dispatch]);

  const handleEditProfile = () => {
    if (!userData) {
      Alert.alert('Error', 'Unable to edit profile. Please try again.');
      return;
    }
    router.push('/profile/editProfile');
  };

  const handleHasApartment = async (selectedIndex) => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        Alert.alert('Error', 'Please log in again');
        return;
      }

      console.log('Updating apartment status:', selectedIndex);
      const response = await axios.put(
        `${API_BASE_URL}/profile/update-profile`,
        {
          updates: { hasApartment: selectedIndex === 1 },
        },
        {
          headers: {
            'x-auth-token': token,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Update response:', response.data);
      if (response.status === 200) {
        setHasApartment(selectedIndex);
        setUserData((prev) => ({ ...prev, hasApartment: selectedIndex === 1 }));
      }
    } catch (error) {
      console.error(
        'Error updating apartment status:',
        error.response?.data || error.message
      );
      Alert.alert('Error', 'Failed to update apartment status');
    }
  };

  const handleImagePick = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        Alert.alert('Error', 'Permission to access camera roll is required!');
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!pickerResult.canceled) {
        await handleImageUpload(pickerResult.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleImageUpload = async (imageUri) => {
    try {
      setUploading(true);
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        Alert.alert('Error', 'Please log in again');
        return;
      }

      const formData = new FormData();
      formData.append('profileImage', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'profile.jpg',
      });

      const response = await axios.post(
        `${API_BASE_URL}/profile/upload`,
        formData,
        {
          headers: {
            'x-auth-token': token,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 200) {
        setUserData((prev) => ({
          ...prev,
          profileImageUrl: response.data.profileImageUrl,
        }));
        Alert.alert('Success', 'Profile picture updated');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'Failed to upload profile picture');
    } finally {
      setUploading(false);
    }
  };

  if (error) {
    console.log('ProfileContent: Rendering error state');
    return (
      <View style={styles.content}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (isLoading || !userData) {
    return (
      <View style={styles.content}>
        <ActivityIndicator size="large" color="#21b78a" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  console.log('ProfileContent: Rendering main content');

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerText}>Profile</Text>
          </View>
          <View style={styles.logoutButtonContainer}>
            <LogoutButton />
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.profileSection}>
          <TouchableOpacity onPress={handleImagePick} disabled={uploading}>
            <View style={styles.imageContainer}>
              <Image
                source={
                  userData?.profileImageUrl
                    ? { uri: `${BASE_URL}${userData.profileImageUrl}` }
                    : DEFAULT_PROFILE_IMAGE
                }
                style={styles.profileImage}
                onError={(e) => {
                  console.error('Image loading error:', e.nativeEvent);
                }}
              />
              {uploading && (
                <View style={styles.uploadingOverlay}>
                  <ActivityIndicator size="large" color="#fff" />
                </View>
              )}
            </View>
          </TouchableOpacity>
          <Text style={styles.nameText}>
            {userData.name || userData.username || 'User'}
            {userData.age ? `, ${userData.age}` : ''}
          </Text>
          <Text style={styles.memberText}>
            Member since{' '}
            {userData?.memberSince
              ? new Date(userData.memberSince).toLocaleDateString()
              : 'N/A'}
          </Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEditProfile}
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.apartmentSection}>
          <Text style={styles.sectionTitle}>Do you have an apartment?</Text>
          <SegmentedControl
            values={['No', 'Yes']}
            selectedIndex={hasApartment}
            onChange={(event) => {
              const newIndex = event.nativeEvent.selectedSegmentIndex;
              setHasApartment(newIndex);
              handleHasApartment(newIndex).catch((error) => {
                console.error('Error updating apartment status:', error);
                // Revert the UI state if the API call fails
                setHasApartment(hasApartment);
                Alert.alert('Error', 'Failed to update apartment status');
              });
            }}
            style={styles.segmentedControl}
            tintColor="#21b78a"
          />
          {hasApartment && (
            <View style={styles.apartmentFormContainer}>
              <ApartmentForm />
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const ProfileScreen = () => {
  return (
    <ErrorBoundary>
      <SafeAreaView style={styles.container}>
        <ProfileContent />
      </SafeAreaView>
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  logoutButtonContainer: {
    position: 'absolute',
    right: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    marginBottom: 15,
  },
  nameText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  memberText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  editButton: {
    backgroundColor: '#21b78a',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 20,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  apartmentSection: {
    width: '100%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  segmentedControl: {
    marginBottom: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorDetails: {
    marginTop: 10,
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
  },
  apartmentFormContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    width: '100%',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  imageContainer: {
    position: 'relative',
    width: 150,
    height: 150,
    borderRadius: 75,
    overflow: 'hidden',
    marginBottom: 15,
    alignSelf: 'center',
  },
  uploadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 20,
    marginBottom: 15,
  },
});

export default ProfileScreen;
