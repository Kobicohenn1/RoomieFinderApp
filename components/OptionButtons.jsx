import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const OptionButtons = ({ options, selectedOption, onSelect }) => {
  return (
    <View style={styles.optionContainer}>
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          style={[
            styles.optionButton,
            selectedOption === option && styles.selectedOption,
          ]}
          onPress={() => onSelect(option)}
        >
          <Text
            style={[
              styles.optionText,
              selectedOption === option && styles.selectedOptionText,
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
  },
  optionText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#333',
  },
  selectedOption: {
    backgroundColor: '#4CAF50',
  },
  selectedOptionText: {
    color: '#fff',
  },
});

export default OptionButtons;
