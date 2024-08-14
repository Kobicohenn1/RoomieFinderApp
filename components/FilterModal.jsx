import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CitySelector from './CitySelector';
import OptionButtons from './OptionButtons';
import Slider from './Slider';
import CustomButton from './CustomButton';

const FilterModal = ({ isVisible, onClose }) => {
  const [city, setCity] = useState('');
  const [gender, setGender] = useState('Female');
  const [ageRange, setAgeRange] = useState([18, 25]);
  const [pricingRange, setPricingRange] = useState([500, 2000]);
  const [sharingOption, setSharingOption] = useState('Any');

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
              handlePress={onClose}
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
    backgroundColor: '#4CAF50',
    marginLeft: 10,
  },
  applyText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#fff',
  },
});

export default FilterModal;
