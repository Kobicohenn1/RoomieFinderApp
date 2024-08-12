import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from '../../components/CustomButton';
import { API_BASE_URL } from '../../constants';

const EditProfile = () => {
  const [userData, setUserData] = useState({
    name: '',
    surname: '',
    dob: '',
    gender: '',
    occupation: '',
    studyField: '',
    roommatePreference: '',
    languages: '',
    personality: '',
    lifestyle: '',
    music: '',
    sports: '',
    movies: '',
    instagram: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const userId = await AsyncStorage.getItem('userId');
      if (!token || !userId) {
        Alert.alert('Error', 'Authentication error');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/users/${userId}`, {
        headers: {
          'x-auth-token': token,
        },
      });
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error.message);
      Alert.alert('Error', 'Failed to fetch user data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setUserData({
      ...userData,
      [field]: value,
    });
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const token = await AsyncStorage.getItem('token');
      const userId = await AsyncStorage.getItem('userId');

      if (!token || !userId) {
        Alert.alert('Error', 'Authentication error');
        setSaving(false);
        return;
      }

      const response = await axios.put(
        `${API_BASE_URL}/users/${userId}`,
        userData,
        {
          headers: {
            'x-auth-token': token,
          },
        }
      );

      if (response.status === 200) {
        Alert.alert('Success', 'Profile updated successfully');
        router.push('/');
      } else {
        Alert.alert('Error', 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error.message);
      Alert.alert('Error', 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.headerText}>My Profile</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Name *</Text>
          <TextInput
            style={styles.input}
            value={userData.name}
            onChangeText={(value) => handleInputChange('name', value)}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Surname *</Text>
          <TextInput
            style={styles.input}
            value={userData.surname}
            onChangeText={(value) => handleInputChange('surname', value)}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Date of birth *</Text>
          <TextInput
            style={styles.input}
            value={userData.dob}
            onChangeText={(value) => handleInputChange('dob', value)}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Gender *</Text>
          <View style={styles.radioGroup}>
            {['Female', 'Male', 'Non-binary'].map((gender) => (
              <TouchableOpacity
                key={gender}
                style={[
                  styles.radioOption,
                  userData.gender === gender && styles.radioOptionSelected,
                ]}
                onPress={() => handleInputChange('gender', gender)}
              >
                <Text style={styles.radioText}>{gender}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>What do you do? *</Text>
          <View style={styles.radioGroup}>
            {['Study', 'Work', 'Both'].map((occupation) => (
              <TouchableOpacity
                key={occupation}
                style={[
                  styles.radioOption,
                  userData.occupation === occupation &&
                    styles.radioOptionSelected,
                ]}
                onPress={() => handleInputChange('occupation', occupation)}
              >
                <Text style={styles.radioText}>{occupation}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>What are you studying? *</Text>
          <TextInput
            style={styles.input}
            value={userData.studyField}
            onChangeText={(value) => handleInputChange('studyField', value)}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Who's moving into the room?</Text>
          <View style={styles.radioGroup}>
            {['Just me', 'Another person and me'].map((preference) => (
              <TouchableOpacity
                key={preference}
                style={[
                  styles.radioOption,
                  userData.roommatePreference === preference &&
                    styles.radioOptionSelected,
                ]}
                onPress={() =>
                  handleInputChange('roommatePreference', preference)
                }
              >
                <Text style={styles.radioText}>{preference}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>What languages do you speak?</Text>
          <TextInput
            style={styles.input}
            value={userData.languages}
            onChangeText={(value) => handleInputChange('languages', value)}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About you</Text>
          {[
            { label: "What's your personality like?", field: 'personality' },
            { label: "What's your lifestyle like?", field: 'lifestyle' },
            { label: 'What music do you listen to?', field: 'music' },
            { label: 'What sports are you into?', field: 'sports' },
            { label: 'What movie genres do you like?', field: 'movies' },
          ].map(({ label, field }) => (
            <View key={field} style={styles.formGroup}>
              <Text style={styles.label}>{label}</Text>
              <TextInput
                style={styles.input}
                value={userData[field]}
                onChangeText={(value) => handleInputChange(field, value)}
              />
            </View>
          ))}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Instagram</Text>
          <TextInput
            style={styles.input}
            value={userData.instagram}
            onChangeText={(value) => handleInputChange('instagram', value)}
          />
        </View>

        <CustomButton
          title="Save profile"
          handlePress={handleSaveProfile}
          isLoading={saving}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  radioOption: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  radioOptionSelected: {
    backgroundColor: '#ccc',
  },
  radioText: {
    fontSize: 16,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default EditProfile;
