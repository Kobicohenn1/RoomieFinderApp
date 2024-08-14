import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import React, { useState } from 'react';
import { CITIES } from '../constants/cities';
import Input from './ManageApartment/Input';

const CitySelector = ({ label, city, onCityChange }) => {
  const [filteredCities, setFilteredCities] = useState([]);

  const handleCityChange = (text) => {
    onCityChange(text);
    if (text === '') {
      setFilteredCities([]);
    } else {
      const newFilteredCities = CITIES.filter((city) =>
        city.toLowerCase().startsWith(text.toLowerCase())
      );
      setFilteredCities(newFilteredCities);
    }
  };

  const handleCitySelect = (chosenCity) => {
    onCityChange(chosenCity);
    setFilteredCities([]);
  };

  return (
    <View style={styles.container}>
      <Input
        label="* City"
        textInputConfig={{
          value: city,
          onChangeText: handleCityChange,
          placeholder: 'Enter City',
          autoCapitalize: 'words',
        }}
      />
      {filteredCities.length > 0 &&
        filteredCities.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              Keyboard.dismiss();
              handleCitySelect(item);
            }}
          >
            <Text style={styles.cityItem}>{item}</Text>
          </TouchableOpacity>
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    fontFamily: 'Poppins-Regular',
    backgroundColor: '#fff', // Match other input fields
  },
  cityItem: {
    paddingVertical: 10,
    fontFamily: 'Poppins-Regular',
  },
});

export default CitySelector;
