import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import { API_BASE_URL } from '../../../constants';
const { width } = Dimensions.get('screen');
import AsyncStorage from '@react-native-async-storage/async-storage';

const PreferenceSelection = () => {
  const router = useRouter();
  const { data, handleFiltersApplied } = useLocalSearchParams();
  const connectedProfileData = JSON.parse(data);

  const [selectedOption, setSelectedOption] = useState(
    connectedProfileData.hasApartment ? 'Roommate' : 'Room'
  );
  const [selectedPeople, setSelectedPeople] = useState('Two');

  const handleNextPress = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('token');
      await axios.put(
        `http://192.168.10.10:3500/api/profile/update-profile`,
        {
          userId,
          updates: {
            lookingFor: selectedOption,
          },
        },
        {
          headers: {
            'x-auth-token': token,
            'Content-Type': 'application/json',
          },
        }
      );

      router.push({
        pathname: '/home/filter',
        params: {
          handleFiltersApplied,
          selectedOption,
          selectedPeople,
        },
      });
    } catch (error) {
      console.error('Error updating lookingFor:', error);
      // Handle the error (e.g., show an alert)
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.questionText}>What are you looking for?</Text>

      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            selectedOption === 'Roommate' && styles.selectedToggle,
          ]}
          onPress={() => setSelectedOption('Roommate')}
        >
          <Text style={styles.toggleText}>Roommate</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            selectedOption === 'Room' && styles.selectedToggle,
          ]}
          onPress={() => setSelectedOption('Room')}
        >
          <Text style={styles.toggleText}>Room</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.questionText}>
        How many people are you looking for?
      </Text>

      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[
            styles.optionButton,
            selectedPeople === 'One' && styles.selectedOption,
          ]}
          onPress={() => setSelectedPeople('One')}
        >
          <Text style={styles.optionText}>One</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.optionButton,
            selectedPeople === 'Two' && styles.selectedOption,
          ]}
          onPress={() => setSelectedPeople('Two')}
        >
          <Text style={styles.optionText}>Two</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.optionButton,
            selectedPeople === 'Three' && styles.selectedOption,
          ]}
          onPress={() => setSelectedPeople('Three')}
        >
          <Text style={styles.optionText}>Three</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.optionButton,
            selectedPeople === 'More than three' && styles.selectedOption,
          ]}
          onPress={() => setSelectedPeople('More than three')}
        >
          <Text style={styles.optionText}>More than three</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.nextButton} onPress={handleNextPress}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  questionText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 5,
    borderRadius: 25,
    alignItems: 'center',
  },
  selectedToggle: {
    backgroundColor: '#ccc',
  },
  toggleText: {
    fontSize: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 30,
  },
  optionButton: {
    width: (width - 80) / 2,
    paddingVertical: 12,
    backgroundColor: '#f0f0f0',
    margin: 5,
    borderRadius: 25,
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#ccc',
  },
  optionText: {
    fontSize: 16,
  },
  nextButton: {
    backgroundColor: '#888',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginHorizontal: 50,
  },
  nextButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default PreferenceSelection;
