import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { CITIES } from '../../../constants/cities';

const options = {
  gender: ['Female', 'Male', 'Non-binary'],
  occupation: ['Study', 'Work', 'Both'],
  personality: ['Introvert', 'Extrovert', 'Ambivert'],
  lifestyle: ['Active', 'Relaxed', 'Balanced'],
  music: [
    'Pop',
    'Rock',
    'Hip Hop',
    'Jazz',
    'Classical',
    'Country',
    'Electronic',
  ],
  sports: ['Soccer', 'Basketball', 'Tennis', 'Running', 'Swimming', 'Yoga'],
  movieGenres: ['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Thriller', 'Romance'],
};

const ages = Array.from({ length: 83 }, (_, i) => i + 18);

const EditProfileScreen = () => {
  const [profile, setProfile] = useState({
    gender: '',
    occupation: '',
    personality: '',
    lifestyle: '',
    music: [],
    sports: [],
    movieGenres: [],
    city: '',
    age: '',
  });

  const [introduceYourself, setIntroduceYourself] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ success: '', error: '' });
  const [hasApartment, setHasApartment] = useState(0);
  const scrollViewRef = useRef();
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        const token = await AsyncStorage.getItem('token');
        if (!userId || !token) throw new Error('Authentication error');
        const response = await axios.get(
          `http://192.168.10.10:3500/api/users/${userId}`,
          {
            headers: { 'x-auth-token': token },
          }
        );
        const data = response.data;
        setProfile({
          gender: data.gender || '',
          occupation: data.occupation || '',
          personality: data.personality || '',
          lifestyle: data.lifestyle || '',
          music: data.music || [],
          sports: data.sports || [],
          movieGenres: data.movieGenres || [],
          city: data.city || '',
          age: data.age || '',
        });
        setIntroduceYourself(data.introduceYourself || '');
      } catch (error) {
        setMessage({ success: '', error: error.message });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async () => {
    const updates = {
      gender: profile.gender,
      occupation: profile.occupation,
      personality: profile.personality,
      lifestyle: profile.lifestyle,
      introduceYourself: introduceYourself,
      music: profile.music,
      sports: profile.sports,
      movieGenres: profile.movieGenres,
      city: profile.city,
      age: profile.age,
    };

    console.log('Updates to be sent:', updates); // Log the updates object

    try {
      const userId = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('token');
      if (!userId || !token) throw new Error('Authentication error');
      const response = await axios.put(
        'http://192.168.10.10:3500/api/profile/update-profile',
        { userId, updates },
        {
          headers: {
            'x-auth-token': token,
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.status === 200) {
        setMessage({ success: 'Profile updated successfully', error: '' });
        router.push('/profile');
      } else {
        setMessage({ success: '', error: 'Failed to update profile' });
      }
    } catch (error) {
      setMessage({ success: '', error: error.message });
    }
  };

  const handleChange = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleOption = (category, option) => {
    setProfile((prev) => ({
      ...prev,
      [category]: prev[category].includes(option)
        ? prev[category].filter((item) => item !== option)
        : [...prev[category], option],
    }));
  };

  const renderOption = (category, option) => {
    const isMultiSelect = Array.isArray(profile[category]);
    return isMultiSelect ? (
      <TouchableOpacity
        key={option}
        style={[
          styles.option,
          profile[category].includes(option) && styles.optionSelected,
        ]}
        onPress={() => toggleOption(category, option)}
      >
        <Text style={styles.optionText}>{option}</Text>
      </TouchableOpacity>
    ) : (
      <TouchableOpacity
        key={option}
        style={[
          styles.radioOption,
          profile[category] === option && styles.optionSelected,
        ]}
        onPress={() => handleChange(category, option)}
      >
        <Text style={styles.optionText}>{option}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView>
      <ScrollView
        contentContainerStyle={styles.container}
        automaticallyAdjustKeyboardInsets={true}
        ref={scrollViewRef}
        //showsVerticalScrollIndicator={false}
      >
        {message.success && (
          <Text style={styles.successMessage}>{message.success}</Text>
        )}
        {message.error && (
          <Text style={styles.errorMessage}>{message.error}</Text>
        )}
        <View style={styles.formContainer}>
          {['gender', 'occupation', 'personality', 'lifestyle'].map(
            (category) => (
              <View key={category} style={styles.section}>
                <Text style={styles.sectionTitle}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Text>
                <View style={styles.radioContainer}>
                  {options[category].map((opt) => renderOption(category, opt))}
                </View>
              </View>
            )
          )}

          {['music', 'sports', 'movieGenres'].map((category) => (
            <View key={category} style={styles.section}>
              <Text style={styles.sectionTitle}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Text>
              <View style={styles.optionsContainer}>
                {options[category].map((option) =>
                  renderOption(category, option)
                )}
              </View>
            </View>
          ))}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>City</Text>
            <Picker
              selectedValue={profile.city}
              onValueChange={(itemValue) =>
                setProfile((prev) => ({ ...prev, city: itemValue }))
              }
            >
              <Picker.Item label="Select a city" value="" />
              {CITIES.map((city) => (
                <Picker.Item key={city} label={city} value={city} />
              ))}
            </Picker>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Age</Text>
            <Picker
              selectedValue={profile.age}
              onValueChange={(itemValue) =>
                setProfile((prev) => ({ ...prev, age: itemValue }))
              }
            >
              <Picker.Item label="Select a age" value="" />
              {ages.map((age) => (
                <Picker.Item key={age} label={age} value={age} />
              ))}
            </Picker>
          </View>

          <Text style={styles.sectionTitle}>Introduce Yourself</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Write about you and increase your chances of finding your next home."
            multiline
            numberOfLines={4}
            maxLength={400}
            onChangeText={setIntroduceYourself}
            value={introduceYourself}
            onFocus={() => {
              scrollViewRef.current.scrollToEnd({ animated: true });
            }}
          />
          <Text style={styles.charCount}>
            {400 - introduceYourself.length} characters left
          </Text>
          <TouchableOpacity style={styles.updateButton} onPress={handleSubmit}>
            <Text style={styles.updateButtonText}>Update Profile</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  formContainer: {
    flex: 1,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  radioOption: {
    backgroundColor: '#E0E0E0',
    padding: 10,
    margin: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  option: {
    backgroundColor: '#E0E0E0',
    padding: 10,
    margin: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  optionSelected: {
    backgroundColor: '#fff',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  updateButton: {
    backgroundColor: '#2196F3',
    borderRadius: 25,
    paddingVertical: 15,
    marginTop: 20,
  },
  updateButtonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  successMessage: {
    color: 'green',
    marginBottom: 10,
    textAlign: 'center',
  },
  errorMessage: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  textArea: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    textAlignVertical: 'top',
  },
  charCount: {
    textAlign: 'right',
    color: '#999',
    marginTop: 5,
  },
});

export default EditProfileScreen;
