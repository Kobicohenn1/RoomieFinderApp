import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CitySelector from '../../../components/CitySelector';
import OptionButtons from '../../../components/OptionButtons';
import Slider from '../../../components/Slider';
import CustomButton from '../../../components/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';

const DEFAULT_GENDER = 'All';
const DEFAULT_AGE_RANGE = [18, 35];
const DEFAULT_PRICING_RANGE = [500, 3000];
const DEFAULT_SHARING_OPTION = 'Any';

const FilterScreen = ({ onFiltersApplied }) => {
  const { selectedOption, handleFiltersApplied } = useLocalSearchParams();
  const router = useRouter();

  // State for Room Filters
  const [pricingRange, setPricingRange] = useState(DEFAULT_PRICING_RANGE);
  const [sharingOption, setSharingOption] = useState(DEFAULT_SHARING_OPTION);
  const [city, setCity] = useState('');
  const [houseRules, setHouseRules] = useState([]); // Array to handle multiple selections

  // State for Roommate Filters
  const [gender, setGender] = useState(DEFAULT_GENDER);
  const [ageRange, setAgeRange] = useState(DEFAULT_AGE_RANGE);
  const [smokingHabit, setSmokingHabit] = useState('');
  const [occupation, setOccupation] = useState('');

  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        const token = await AsyncStorage.getItem('token');
        if (!userId || !token) {
          Alert.alert('Error', 'Authentication Error');
          return;
        }
        const userResponse = await axios.get(
          `http://192.168.10.10:3500/api/users/${userId}`,
          {
            headers: {
              'x-auth-token': token,
            },
          }
        );

        if (userResponse.data.filters) {
          const filterResponse = await axios.get(
            `http://192.168.10.10:3500/api/filters/${userResponse.data.filters}`,
            {
              headers: {
                'x-auth-token': token,
              },
            }
          );

          populateFilterData(filterResponse.data);
        }
      } catch (error) {
        console.error('Error fetching filter data', error.message);
        Alert.alert('Error', 'Failed to fetch filter data');
      }
    };
    fetchFilterData();
  }, []);

  const handleFilterSaved = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('token');
      if (!userId || !token) {
        Alert.alert('Auth Error');
        return;
      }

      const filterData = {
        roommateFilters: {
          gender,
          ageRange,
          smokingHabit: smokingHabit || undefined, // Only include if not empty
          occupation: occupation || undefined, // Only include if not empty
        },
        roomFilters: {
          pricingRange,
          sharingOption,
          city,
          houseRules,
        },
      };

      console.log(filterData);
      const response = await axios.post(
        `http://192.168.10.10:3500/api/filters/upload`,
        filterData,
        {
          headers: {
            'x-auth-token': token,
          },
        }
      );

      if (response.status === 200) {
        Alert.alert('Success', 'Filters saved successfully');
        //handleFiltersApplied?.(); // Call the function passed via props

        router.back();
        router.back();
      } else {
        Alert.alert('Error', 'Failed to save filters');
      }
    } catch (error) {
      console.error('Error updating filter', error.message);
      Alert.alert('Error', 'Server Error');
    }
  };

  const populateFilterData = (data) => {
    if (data) {
      setPricingRange(data.roomFilters.pricingRange || DEFAULT_PRICING_RANGE);
      setSharingOption(
        data.roomFilters.sharingOption || DEFAULT_SHARING_OPTION
      );
      setCity(data.roomFilters.city || '');
      setHouseRules(data.roomFilters.houseRules || []);
      setGender(data.roommateFilters.gender || DEFAULT_GENDER);
      setAgeRange(data.roommateFilters.ageRange || DEFAULT_AGE_RANGE);
      setSmokingHabit(data.roommateFilters.smokingHabit || '');
      setOccupation(data.roommateFilters.occupation || '');
    }
  };

  return (
    <View style={styles.screenContainer}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.modalContent}
        resetScrollToCoords={{ x: 0, y: 0 }}
        scrollEnabled={true}
      >
        <Text style={styles.title}>Filter Your Search</Text>

        {selectedOption === 'Room' && (
          <>
            <Text style={styles.sectionHeader}>Room Filters</Text>

            <Text style={styles.sectionTitle}>Pricing Range</Text>
            <Slider
              label="Pricing"
              range={pricingRange}
              min={500}
              max={5000}
              step={100}
              onValuesChange={setPricingRange}
            />

            <Text style={styles.sectionTitle}>Sharing Option</Text>
            <OptionButtons
              options={['Any', '1', '2', '3', '4+']}
              selectedOptions={sharingOption}
              onSelect={setSharingOption}
            />

            <Text style={styles.sectionTitle}>City</Text>
            <CitySelector
              label="Apartment in city"
              city={city}
              onCityChange={setCity}
            />

            <Text style={styles.sectionTitle}>House Rules</Text>
            <OptionButtons
              options={[
                'Smoker Friendly',
                'Pet Friendly',
                'Shabbat Observance',
              ]}
              selectedOptions={houseRules}
              onSelect={(selected) => {
                if (houseRules.includes(selected)) {
                  setHouseRules(houseRules.filter((rule) => rule !== selected));
                } else {
                  setHouseRules([...houseRules, selected]);
                }
              }}
            />
          </>
        )}

        {(selectedOption === 'Roommate' || selectedOption === 'Both') && (
          <>
            <Text style={styles.sectionHeader}>Roommate Filters</Text>

            <Text style={styles.sectionTitle}>Gender</Text>
            <OptionButtons
              options={['Female', 'Male', 'All']}
              selectedOptions={gender}
              onSelect={setGender}
            />

            <Text style={styles.sectionTitle}>Age Range</Text>
            <Slider
              label="Age"
              range={ageRange}
              min={18}
              max={40}
              step={1}
              onValuesChange={setAgeRange}
            />

            <Text style={styles.sectionTitle}>Smoking Habit</Text>
            <OptionButtons
              options={['Yes', 'No', 'Outside Only']}
              selectedOptions={smokingHabit}
              onSelect={setSmokingHabit}
            />

            <Text style={styles.sectionTitle}>Occupation Status</Text>
            <OptionButtons
              options={['Study', 'Work', 'Both']}
              selectedOptions={occupation}
              onSelect={setOccupation}
            />
          </>
        )}

        <View style={styles.buttonsContainer}>
          <CustomButton
            title="Apply Filters"
            handlePress={handleFilterSaved}
            containerStyle={styles.applyButton}
            textStyle={styles.applyText}
          />
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#ffffff',
  },
  modalContent: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 20,
  },
  sectionHeader: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    marginVertical: 15,
  },
  sectionTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    marginVertical: 10,
    color: '#000',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  applyButton: {
    flex: 1,
    backgroundColor: '#21b78a',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 40,
  },
  applyText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
});

export default FilterScreen;
