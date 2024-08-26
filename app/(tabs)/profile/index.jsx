import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import ApartmentForm from '../../../components/ManageApartment/ApartmentForm';

const ProfileScreen = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [hasApartment, setHasApartment] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const userId = await AsyncStorage.getItem('userId');
        if (!token || !userId) {
          Alert.alert('Error', 'Authentication error');
          return;
        }

        const response = await axios.get(
          `http://192.168.10.10:3500/api/users/${userId}`,
          {
            headers: {
              'x-auth-token': token,
            },
          }
        );
        setUserData(response.data);
        setHasApartment(response.data.hasApartment ? 1 : 0);
      } catch (error) {
        console.error('Error fetching user data:', error.message);
        Alert.alert('Error', 'Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.2,
    });
    if (!pickerResult.canceled) {
      handleImageUpload(pickerResult.assets[0].uri);
    }
  };

  const handleImageUpload = async (imageUri) => {
    try {
      setUploading(true);
      const token = await AsyncStorage.getItem('token');
      const userId = await AsyncStorage.getItem('userId');

      if (!token || !userId) {
        Alert.alert('Error', 'Authentication error');
        setUploading(false);
        return;
      }

      const formData = new FormData();
      formData.append('profileImage', {
        uri: imageUri,
        name: `profile-${userId}.jpeg`,
        type: 'image/jpeg',
      });

      const response = await axios.post(
        'http://192.168.10.10:3500/api/profile/upload',
        formData,
        {
          headers: {
            'x-auth-token': token,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 200) {
        setUserData({
          ...userData,
          profileImageUrl: response.data.profileImageUrl,
        });
        Alert.alert('Success', 'Profile picture uploaded successfully');
      } else {
        Alert.alert('Error', 'Failed to upload profile picture');
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error.message);
      Alert.alert('Error', 'Failed to upload profile picture');
    } finally {
      setUploading(false);
    }
  };

  const handleEditProfile = () => {
    router.push('/profile/editProfile');
  };

  const handleHasApartment = async (selectedIndex) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const userId = await AsyncStorage.getItem('userId');

      if (!token || !userId) {
        Alert.alert('Error', 'Auth Error');
        return;
      }

      console.log('Updating hasApartment:', selectedIndex === 1); // Debug log

      const response = await axios.put(
        `http://192.168.10.10:3500/api/profile/update-profile`,
        { userId, updates: { hasApartment: selectedIndex === 1 } },
        {
          headers: {
            'x-auth-token': token,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        console.log('Response:', response.data); // Debug log
        setUserData({ ...userData, hasApartment: selectedIndex === 1 });
        Alert.alert('Success', 'Apartment status updated successfully');
      } else {
        Alert.alert('Error', 'Failed to update apartment status');
      }
    } catch (error) {
      console.error('Error updating apartment status:', error.message);
      Alert.alert('Error updating apartment status:', error.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#21b78a" />
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>User data not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView automaticallyAdjustKeyboardInsets={true}>
        <View style={styles.header}>
          <Text style={styles.headerText}>
            {userData.name || userData.username}
          </Text>
          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                'Settings',
                'Settings functionality will be implemented.'
              )
            }
          ></TouchableOpacity>
        </View>
        <TouchableOpacity onPress={pickImage}>
          <Image
            source={{
              uri: `http://192.168.10.10:3500${userData.profileImageUrl}`,
            }}
            style={styles.profileImage}
            onError={(e) => {
              console.error('Error loading image', e.nativeEvent.error);
              Alert.alert('Error', 'Failed to load profile image');
            }}
            defaultSource={{ uri: 'https://via.placeholder.com/150' }} // Fallback image
          />
          {uploading && (
            <View style={styles.uploadingContainer}>
              <ActivityIndicator size="large" color="#21b78a" />
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cameraIconContainer}
          onPress={pickImage}
        ></TouchableOpacity>
        <View style={styles.profileInfoContainer}>
          <Text style={styles.profileName}>
            {userData.name || userData.username}, {userData.age || 'N/A'}
          </Text>
          <Text style={styles.profileMemberSince}>
            Member since {new Date(userData.memberSince).toLocaleDateString()}
          </Text>
          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={handleEditProfile}
          >
            <Text style={styles.editProfileButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.segmentedContainer}>
          <Text style={styles.sectionText}>Do you have an apartment?</Text>
          <SegmentedControl
            values={['No', 'Yes']}
            selectedIndex={hasApartment}
            onChange={(e) => {
              const selectedIndex = e.nativeEvent.selectedSegmentIndex;
              setHasApartment(selectedIndex);
              handleHasApartment(selectedIndex);
            }}
            tintColor="#21b78a"
            style={styles.segmentedControl}
          />
          {hasApartment === 1 && <ApartmentForm />}
        </View>
        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6e8e4',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadingContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    padding: 20,
    zIndex: 1000,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  settingsIcon: {
    fontSize: 25,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignSelf: 'center',
    marginVertical: 20,
  },
  cameraIconContainer: {
    position: 'absolute',
    top: 65,
    right: '40%',
    transform: [{ translateX: -20 }],
    backgroundColor: '#e6e8e4',
    borderRadius: 15,
    padding: 5,
  },
  cameraIcon: {
    fontSize: 30,
    color: '#21b78a',
  },
  profileInfoContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  profileMemberSince: {
    fontSize: 16,
    color: '#888',
    marginTop: 5,
  },
  editProfileButton: {
    marginTop: 20,
    backgroundColor: '#21b78a',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
  },
  editProfileButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  segmentedContainer: {
    width: '80%',
    marginTop: 20,
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  sectionText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  segmentedControl: {
    marginTop: 10,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ProfileScreen;
