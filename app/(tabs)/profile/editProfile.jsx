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
import { emojis } from '../../../constants/emojis';

const options = {
  gender: ['Female', 'Male', 'Non-binary'],
  occupation: ['Study', 'Work', 'Both'],
  personality: ['Introvert', 'Extrovert', 'Ambivert'],
  lifestyle: ['Active', 'Relaxed', 'Balanced'],
  smokingHabit: ['Yes', 'No', 'Outside Only'],
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
  pets: ['Dog', 'Cat', 'Others', 'No Pets'],
};

const ages = Array.from({ length: 83 }, (_, i) => i + 18);

const EditProfileScreen = () => {
  const [profile, setProfile] = useState({
    gender: '',
    occupation: '',
    personality: '',
    lifestyle: '',
    smokingHabit: '',
    pets: '',
    music: [],
    sports: [],
    movieGenres: [],
    city: '',
    age: '',
  });

  const [introduceYourself, setIntroduceYourself] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ success: '', error: '' });
  const [petOptions, setPetOptions] = useState([
    'Dog',
    'Cat',
    'Others',
    'No Pets',
  ]); // Default options
  const scrollViewRef = useRef();
  const router = useRouter();

  useEffect(() => {
    const fetchProfileAndPetOptions = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        const token = await AsyncStorage.getItem('token');
        if (!userId || !token) throw new Error('Authentication error');

        // Fetch user profile
        const profileResponse = await axios.get(
          `http://192.168.10.10:3500/api/users/${userId}`,
          {
            headers: { 'x-auth-token': token },
          }
        );
        const profileData = profileResponse.data;
        setProfile({
          gender: profileData.gender || '',
          occupation: profileData.occupation || '',
          personality: profileData.personality || '',
          lifestyle: profileData.lifestyle || '',
          smokingHabit: profileData.smokingHabit || '',
          pets: profileData.pets || '',
          music: profileData.music || [],
          sports: profileData.sports || [],
          movieGenres: profileData.movieGenres || [],
          city: profileData.city || '',
          age: profileData.age || '',
        });
        setIntroduceYourself(profileData.introduceYourself || '');
      } catch (error) {
        setMessage({ success: '', error: error.message });
      } finally {
        setLoading(false);
      }
    };
    fetchProfileAndPetOptions();
  }, []);

  const handleSubmit = async () => {
    const updates = {
      gender: profile.gender,
      occupation: profile.occupation,
      personality: profile.personality,
      lifestyle: profile.lifestyle,
      smokingHabit: profile.smokingHabit,
      pets: profile.pets,
      introduceYourself: introduceYourself,
      music: profile.music,
      sports: profile.sports,
      movieGenres: profile.movieGenres,
      city: profile.city,
      age: profile.age,
    };

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
    const emoji = emojis[category] ? emojis[category][option] : null;
    const isSelected = isMultiSelect
      ? profile[category].includes(option)
      : profile[category] === option;

    return (
      <TouchableOpacity
        key={option}
        style={[
          styles.option,
          isSelected && styles.optionSelected,
          !isSelected && styles.optionUnselected,
        ]}
        onPress={() =>
          isMultiSelect
            ? toggleOption(category, option)
            : handleChange(category, option)
        }
      >
        <Text
          style={[
            styles.optionText,
            !isSelected && styles.optionTextUnselected,
          ]}
        >
          {emoji} {option}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView>
      <ScrollView
        contentContainerStyle={styles.container}
        automaticallyAdjustKeyboardInsets={true}
        ref={scrollViewRef}
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
            <Text style={styles.sectionTitle}>Smoking Habit</Text>
            <View style={styles.radioContainer}>
              {options.smokingHabit.map((opt) =>
                renderOption('smokingHabit', opt)
              )}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Do You Have Pets?</Text>
            <View style={styles.radioContainer}>
              {options.pets.map((opt) => renderOption('pets', opt))}
            </View>
          </View>

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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
  radioOption: {
    backgroundColor: '#F0F0F0',
    paddingVertical: 10, // Dynamic padding for vertical space
    paddingRight: 3, // Dynamic padding for horizontal space
    margin: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    flexDirection: 'row', // Row direction for icon + text
    alignItems: 'center', // Vertically center items
    justifyContent: 'center', // Center items horizontally
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  option: {
    backgroundColor: '#F0F0F0',
    paddingVertical: 10, // Dynamic padding for vertical space
    paddingRight: 5, // Dynamic padding for horizontal space
    margin: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    flexDirection: 'row', // Row direction for icon + text
    alignItems: 'center', // Vertically center items
    justifyContent: 'center', // Center items horizontally
  },
  optionSelected: {
    backgroundColor: '#fff',
    borderColor: '#21b78a',
    borderWidth: 2,
  },
  optionUnselected: {
    backgroundColor: '#D3D3D3', // Darker background for unselected options
  },
  optionText: {
    fontSize: 15,
    fontFamily: 'Poppins-Medium',
    color: '#333',
    marginLeft: 8,
  },
  optionTextUnselected: {
    color: '#777', // Darker text color for unselected options
  },
  updateButton: {
    backgroundColor: '#21b78a',
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
