import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';

const CustomButton = ({
  title,
  handlePress,
  containerStyle,
  textStyle,
  isLoading,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={styles.button}
      onPress={handlePress}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    color: 'black',
    borderRadius: 10,
    backgroundColor: '#8B6244',
    padding: 13,
    marginTop: 10,
    shadowOpacity: 1,
    shadowOffset: 2,
  },
  text: { fontFamily: 'Poppins-SemiBold', fontSize: 20 },
});
