import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const OptionButtons = ({ options, selectedOptions, onSelect }) => {
  return (
    <View style={styles.optionContainer}>
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          style={[
            styles.optionButton,
            selectedOptions.includes(option) && styles.selectedOption,
          ]}
          onPress={() => onSelect(option)}
        >
          <Text
            style={[
              styles.optionText,
              selectedOptions.includes(option) && styles.selectedOptionText,
            ]}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  optionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  optionButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
    marginBottom: 10, // Adjusted to handle multiple rows
  },
  optionText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#333',
  },
  selectedOption: {
    backgroundColor: '#21b78a',
  },
  selectedOptionText: {
    color: '#fff',
  },
});

export default OptionButtons;
