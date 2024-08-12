import { View, Text, TextInput, StyleSheet } from 'react-native';
import React, { useState } from 'react';

const Input = ({ label, textInputConfig }) => {
  const [error, setError] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{label}</Text>
      <TextInput
        style={[styles.input, error ? styles.inputError : null]}
        {...textInputConfig}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  title: {
    fontFamily: 'Poppins-Medium',
    marginBottom: 5,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 5,
  },
  inputError: {
    borderBottomColor: 'red',
  },
  errorText: {
    color: 'red',
    marginTop: 5,
  },
});
