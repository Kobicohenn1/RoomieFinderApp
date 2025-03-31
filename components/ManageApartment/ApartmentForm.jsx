import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  Platform,
  TouchableOpacity,
} from 'react-native';
import Input from './Input';
import Counter from '../Counter';
import DateTimePicker from '@react-native-community/datetimepicker';
import SelectableIcon from '../SelectableIcon';
import { icons } from '../../constants';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageComponent from './ImageComponent';
import CitySelector from '../CitySelector';

const ApartmentForm = () => {
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [numberOfRooms, setNumberOfRooms] = useState(0);
  const [numberOfPeople, setNumberOfPeople] = useState({ female: 0, male: 0 });
  const [rentPrice, setRentPrice] = useState('');
  const [description, setDescription] = useState('');
  const [moveInDate, setMoveInDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [houseRules, setHouseRules] = useState({
    shabbat: false,
    smoking: false,
    pets: false,
  });
  const [images, setImages] = useState([]);
  const [userData, setUserData] = useState(null);
  const [apartmentData, setApartmentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const token = await AsyncStorage.getItem('token');
        const userId = await AsyncStorage.getItem('userId');
        if (!token || !userId) {
          Alert.alert('Error', 'Auth Error');
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
        if (response.data.apartment) {
          const apartmentResponse = await axios.get(
            `http://192.168.10.10:3500/api/apartment/${response.data.apartment}`,
            {
              headers: {
                'x-auth-token': token,
              },
            }
          );
          setApartmentData(apartmentResponse.data);
          const {
            address,
            city,
            numberOfRooms,
            numberOfPeople,
            rentPrice,
            description,
            moveInDate,
            houseRules,
          } = apartmentResponse.data;
          setAddress(address || '');
          setCity(city || '');
          setNumberOfRooms(numberOfRooms || 0);
          setNumberOfPeople(numberOfPeople || { female: 0, male: 0 });
          setRentPrice(rentPrice || '');
          setDescription(description || '');
          setMoveInDate(moveInDate ? new Date(moveInDate) : new Date());
          setHouseRules(
            houseRules || { shabbat: false, smoking: false, pets: false }
          );
        }
      } catch (error) {
        console.error('Error fetching user data:', error.message);
        Alert.alert('Error', 'Failed to fetch user data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleRemoveImage = async (index, imageName) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const cleanedImageName = imageName.split('/').pop();
      await axios.delete(
        `http://192.168.10.10:3500/api/apartment/image/${cleanedImageName}`,
        {
          headers: {
            'x-auth-token': token,
          },
        }
      );
      if (index < images.length) {
        setImages(images.filter((_, i) => i !== index));
      } else {
        setApartmentData({
          ...apartmentData,
          images: apartmentData.images.filter(
            (_, i) => i !== index - images.length
          ),
        });
      }
    } catch (error) {
      console.error('Error deleting image', error.message);
      Alert.alert('Error', 'Failed to delete image');
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setMoveInDate(selectedDate);
    }
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const handleImagePicker = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }
    const remainingSlots =
      5 - images.length - (apartmentData ? apartmentData.images.length : 0);
    if (remainingSlots <= 0) {
      alert('You have reached the maximum number of images.');
      return;
    }
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: remainingSlots,
      quality: 1,
    });

    if (!pickerResult.canceled) {
      const selectedImages = pickerResult.assets.slice(0, 5 - images.length);
      setImages([...images, ...selectedImages]);
      await handleUploadImages(selectedImages);
    }
  };

  const handleUploadImages = async (selectedImages) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const userId = await AsyncStorage.getItem('userId');

      if (!token || !userId) {
        Alert.alert('Error', 'Auth Error');
        return;
      }

      const formData = new FormData();
      selectedImages.forEach((image, index) => {
        formData.append('apartmentImages', {
          uri: image.uri,
          type: 'image/jpeg',
          name: `${userId}_${index + 1}.jpg`,
        });
      });

      const res = await axios.post(
        'http://192.168.10.10:3500/api/apartment/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'x-auth-token': token,
          },
        }
      );

      console.log('Uploaded image paths:', res.data.filePaths);

      if (apartmentData) {
        setApartmentData({
          ...apartmentData,
          images: [...(apartmentData.images || []), ...res.data.filePaths],
        });
      } else {
        setApartmentData({
          images: res.data.filePaths,
        });
      }

      setImages([]);
    } catch (error) {
      console.error('Error uploading images:', error.message);
    }
  };

  const handleSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const userId = await AsyncStorage.getItem('userId');

      if (!token || !userId) {
        Alert.alert('Error', 'Auth Error');
        return;
      }

      const formData = {
        owner: userId,
        address,
        city,
        numberOfRooms,
        numberOfPeople,
        rentPrice,
        description,
        moveInDate,
        houseRules,
      };

      const res = await axios.post(
        'http://192.168.10.10:3500/api/apartment/upload-details',
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
          },
        }
      );
      Alert.alert('Form submitted');
      console.log('Form submitted successfully:', res.data);
    } catch (error) {
      console.error('Error submitting form:', error.message);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading apartment details...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Apartment Details</Text>

      <View style={styles.sectionContainer}>
        <CitySelector label="City *" city={city} onCityChange={setCity} />
      </View>

      <View style={styles.sectionContainer}>
        <Input
          label="* Address "
          textInputConfig={{
            value: address,
            onChangeText: setAddress,
            placeholder: 'Enter Address',
            autoCapitalize: 'words',
          }}
        />
      </View>

      <View style={styles.sectionContainer}>
        <Counter
          label="* How many Rooms?"
          value={numberOfRooms}
          onIncrement={() => setNumberOfRooms((currRooms) => currRooms + 1)}
          onDecrement={() =>
            setNumberOfRooms((currRooms) => Math.max(0, currRooms - 1))
          }
        />
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.label}>* Who lives in the property?</Text>
        <Counter
          label="Male"
          value={numberOfPeople.male}
          onIncrement={() =>
            setNumberOfPeople((prev) => ({
              ...prev,
              male: prev.male + 1,
            }))
          }
          onDecrement={() =>
            setNumberOfPeople((prev) => ({
              ...prev,
              male: Math.max(0, prev.male - 1),
            }))
          }
        />
        <Counter
          label="Female"
          noBorder={0}
          value={numberOfPeople.female}
          onDecrement={() =>
            setNumberOfPeople((prev) => ({
              ...prev,
              female: Math.max(0, prev.female - 1),
            }))
          }
          onIncrement={() =>
            setNumberOfPeople((prev) => ({
              ...prev,
              female: prev.female + 1,
            }))
          }
        />
      </View>

      <View style={styles.sectionContainer}>
        <Input
          label="Rent Price *"
          textInputConfig={{
            keyboardType: 'numeric',
            placeholder: 'Price per month',
            value: rentPrice.toString(),
            onChangeText: (text) => setRentPrice(Number(text)),
          }}
        />
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.label}>Move-In Date *</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={showDatePickerModal}
        >
          <Text style={styles.dateButtonText}>
            {moveInDate.toLocaleDateString()}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={moveInDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
          />
        )}
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.label}>House Rules</Text>
        <View style={styles.iconRow}>
          <SelectableIcon
            source={icons.shabbat}
            selected={houseRules.shabbat}
            onPress={() => {
              setHouseRules({
                ...houseRules,
                shabbat: !houseRules.shabbat,
              });
            }}
          />
          <SelectableIcon
            source={icons.smoker}
            selected={houseRules.smoking}
            onPress={() =>
              setHouseRules({
                ...houseRules,
                smoking: !houseRules.smoking,
              })
            }
          />
          <SelectableIcon
            source={icons.pet_friendly}
            selected={houseRules.pets}
            onPress={() => {
              setHouseRules({
                ...houseRules,
                pets: !houseRules.pets,
              });
            }}
          />
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <Input
          label="Description"
          textInputConfig={{
            value: description,
            onChangeText: setDescription,
            placeholder: 'Enter Description',
            multiline: true,
            numberOfLines: 4,
          }}
        />
      </View>

      <TouchableOpacity style={styles.imageButton} onPress={handleImagePicker}>
        <Text style={styles.imageButtonText}>Pick Images</Text>
      </TouchableOpacity>

      <View style={styles.imageRow}>
        {apartmentData &&
          apartmentData.images &&
          apartmentData.images.map((image, index) => (
            <ImageComponent
              uri={`http://192.168.10.10:3500/${image}`}
              key={index}
              onRemove={() => handleRemoveImage(index, image)}
            />
          ))}
        {images.map((image, index) => (
          <ImageComponent
            uri={image.uri}
            key={apartmentData ? apartmentData.images.length + index : index}
            onRemove={() => handleRemoveImage(index, image.uri)}
          />
        ))}
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 60,
    backgroundColor: '#e6e8e4',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e6e8e4',
  },
  loadingText: {
    fontSize: 16,
    color: '#333',
  },
  label: {
    fontSize: 16,
    marginTop: 8,
    marginBottom: 8,
    color: '#333',
    fontWeight: '500',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#222',
  },
  sectionContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  dateButton: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginTop: 8,
    alignItems: 'center',
  },
  dateButtonText: {
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
  },
  imageButton: {
    backgroundColor: '#21b78a',
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  imageButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  imageRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  submitButton: {
    backgroundColor: '#21b78a',
    padding: 15,
    borderRadius: 30,
    marginTop: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  submitButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ApartmentForm;
