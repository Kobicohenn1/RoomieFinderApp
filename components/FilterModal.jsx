import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CitySelector from './CitySelector';
import OptionButtons from './OptionButtons';
import Slider from './Slider';
import CustomButton from './CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const DEFAULT_GENDER = 'All';
const DEFAULT_AGE_RANGE = [18, 35];
const DEFAULT_PRICING_RANGE = [500, 3000];
const DEFAULT_SHARING_OPTION = 'Any';

const FilterModal = ({ isVisible, onClose, onFiltersApplied }) => {
  const [city, setCity] = useState('');
  const [gender, setGender] = useState(DEFAULT_GENDER);
  const [ageRange, setAgeRange] = useState(() => DEFAULT_AGE_RANGE);
  const [pricingRange, setPricingRange] = useState(() => DEFAULT_PRICING_RANGE);
  const [sharingOption, setSharingOption] = useState(DEFAULT_SHARING_OPTION);

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
        city,
        gender,
        ageRange,
        pricingRange,
        sharingOption,
      };

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
        onFiltersApplied();
        onClose();
      } else {
        Alert.alert('Error', 'Failed to save filters');
      }
    } catch (error) {
      console.error('Error update filter', error.message);
      Alert.alert('Error', 'Server Error');
    }
  };

  const populateFilterData = (data) => {
    setGender(data.gender || DEFAULT_GENDER);
    setAgeRange(data.ageRange || DEFAULT_AGE_RANGE);
    setPricingRange(data.pricingRange || DEFAULT_PRICING_RANGE);
    setSharingOption(data.sharingOption || DEFAULT_SHARING_OPTION);
    setCity(data.city || '');
  };

  return (
    <Modal visible={isVisible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <KeyboardAwareScrollView
          contentContainerStyle={styles.modalContent}
          resetScrollToCoords={{ x: 0, y: 0 }}
          scrollEnabled={true}
        >
          <Text style={styles.title}>Filters</Text>

          <Text style={styles.sectionTitle}>Gender</Text>
          <OptionButtons
            options={['Male', 'Female', 'All']}
            selectedOption={gender}
            onSelect={setGender}
          />

          <Text style={styles.sectionTitle}>Age</Text>
          <Slider
            label="Age"
            range={ageRange}
            min={18}
            max={60}
            step={1}
            onValuesChange={setAgeRange}
          />

          <Text style={styles.sectionTitle}>Pricing</Text>
          <Slider
            label="Pricing"
            range={pricingRange}
            min={500}
            max={5000}
            step={100}
            onValuesChange={setPricingRange}
          />

          <Text style={styles.sectionTitle}>Sharing</Text>
          <OptionButtons
            options={['Any', '1', '2', '3', '4+']}
            selectedOption={sharingOption}
            onSelect={setSharingOption}
          />

          <Text style={styles.sectionTitle}>City</Text>
          <CitySelector
            label="Apartment in city"
            city={city}
            onCityChange={setCity}
          />

          <View style={styles.buttonsContainer}>
            <CustomButton
              title="Cancel"
              handlePress={onClose}
              containerStyle={styles.cancelButton}
              textStyle={styles.cancelText}
            />
            <CustomButton
              title="Apply Filter"
              handlePress={handleFilterSaved}
              containerStyle={styles.applyButton}
              textStyle={styles.applyText}
            />
          </View>
        </KeyboardAwareScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    flexGrow: 1,
    backgroundColor: '#e6e8e4',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    marginVertical: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
  },
  cancelText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#333',
  },
  applyButton: {
    flex: 1,
    backgroundColor: 'white',
    marginLeft: 10,
  },
  applyText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#fff',
  },
});

export default FilterModal;
