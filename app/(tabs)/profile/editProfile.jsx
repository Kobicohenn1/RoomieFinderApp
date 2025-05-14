import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { CITIES } from '../../../constants/cities';
import { emojis } from '../../../constants/emojis';

const DEFAULT_PROFILE = {
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
};

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
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [introduceYourself, setIntroduceYourself] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ success: '', error: '' });
  const scrollViewRef = useRef();
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        const token = await AsyncStorage.getItem('token');
        if (!userId || !token) throw new Error('Authentication error');

        const profileResponse = await axios.get(
          `http://192.168.10.10:3500/api/users/${userId}`,
          {
            headers: { 'x-auth-token': token },
          }
        );

        const profileData = profileResponse.data || {};
        setProfile({
          gender: profileData.gender || DEFAULT_PROFILE.gender,
          occupation: profileData.occupation || DEFAULT_PROFILE.occupation,
          personality: profileData.personality || DEFAULT_PROFILE.personality,
          lifestyle: profileData.lifestyle || DEFAULT_PROFILE.lifestyle,
          smokingHabit:
            profileData.smokingHabit || DEFAULT_PROFILE.smokingHabit,
          pets: profileData.pets || DEFAULT_PROFILE.pets,
          music: Array.isArray(profileData.music)
            ? profileData.music
            : DEFAULT_PROFILE.music,
          sports: Array.isArray(profileData.sports)
            ? profileData.sports
            : DEFAULT_PROFILE.sports,
          movieGenres: Array.isArray(profileData.movieGenres)
            ? profileData.movieGenres
            : DEFAULT_PROFILE.movieGenres,
          city: profileData.city || DEFAULT_PROFILE.city,
          age: profileData.age || DEFAULT_PROFILE.age,
        });
        setIntroduceYourself(profileData.introduceYourself || '');
      } catch (error) {
        setMessage({ success: '', error: 'Failed to load profile' });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('token');
      if (!userId || !token) throw new Error('Authentication error');

      const updates = {
        gender: profile.gender || DEFAULT_PROFILE.gender,
        occupation: profile.occupation || DEFAULT_PROFILE.occupation,
        personality: profile.personality || DEFAULT_PROFILE.personality,
        lifestyle: profile.lifestyle || DEFAULT_PROFILE.lifestyle,
        smokingHabit: profile.smokingHabit || DEFAULT_PROFILE.smokingHabit,
        pets: profile.pets || DEFAULT_PROFILE.pets,
        introduceYourself: introduceYourself || '',
        music: Array.isArray(profile.music)
          ? profile.music
          : DEFAULT_PROFILE.music,
        sports: Array.isArray(profile.sports)
          ? profile.sports
          : DEFAULT_PROFILE.sports,
        movieGenres: Array.isArray(profile.movieGenres)
          ? profile.movieGenres
          : DEFAULT_PROFILE.movieGenres,
        city: profile.city || DEFAULT_PROFILE.city,
        age: profile.age || DEFAULT_PROFILE.age,
      };

      const response = await axios.put(
        'http://192.168.10.10:3500/api/profile',
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
      setMessage({ success: '', error: 'Failed to update profile' });
    }
  };

  const handleChange = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleOption = (category, option) => {
    setProfile((prev) => {
      const currentValue = prev[category];
      if (!Array.isArray(currentValue)) return prev;

      return {
        ...prev,
        [category]: currentValue.includes(option)
          ? currentValue.filter((item) => item !== option)
          : [...currentValue, option],
      };
    });
  };

  const renderOption = (category, option) => {
    const isMultiSelect = Array.isArray(profile[category]);
    const emoji = emojis[category]?.[option] || '';
    const isSelected = isMultiSelect
      ? profile[category]?.includes(option)
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#21b78a" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
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
                  {options[category]?.map((opt) => renderOption(category, opt))}
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
                {options[category]?.map((option) =>
                  renderOption(category, option)
                )}
              </View>
            </View>
          ))}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Smoking Habit</Text>
            <View style={styles.radioContainer}>
              {options.smokingHabit?.map((opt) =>
                renderOption('smokingHabit', opt)
              )}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Do You Have Pets?</Text>
            <View style={styles.radioContainer}>
              {options.pets?.map((opt) => renderOption('pets', opt))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>City</Text>
            <Picker
              selectedValue={profile.city || ''}
              onValueChange={(itemValue) =>
                setProfile((prev) => ({ ...prev, city: itemValue }))
              }
            >
              <Picker.Item label="Select a city" value="" />
              {CITIES?.map((city) => (
                <Picker.Item key={city} label={city} value={city} />
              ))}
            </Picker>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Age</Text>
            <Picker
              selectedValue={profile.age || ''}
              onValueChange={(itemValue) =>
                setProfile((prev) => ({ ...prev, age: itemValue }))
              }
            >
              <Picker.Item label="Select an age" value="" />
              {ages?.map((age) => (
                <Picker.Item key={age} label={age.toString()} value={age} />
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
              scrollViewRef.current?.scrollToEnd({ animated: true });
            }}
          />
          <Text style={styles.charCount}>
            {400 - (introduceYourself?.length || 0)} characters left
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
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  option: {
    backgroundColor: '#F0F0F0',
    paddingVertical: 10,
    paddingRight: 5,
    margin: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionSelected: {
    backgroundColor: '#fff',
    borderColor: '#21b78a',
    borderWidth: 2,
  },
  optionUnselected: {
    backgroundColor: '#D3D3D3',
  },
  optionText: {
    fontSize: 15,
    fontFamily: 'Poppins-Medium',
    color: '#333',
    marginLeft: 8,
  },
  optionTextUnselected: {
    color: '#777',
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
