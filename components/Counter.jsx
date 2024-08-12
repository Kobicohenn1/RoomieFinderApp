// Counter.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Counter = ({ label, value, onIncrement, onDecrement, noBorder }) => {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>

      <View style={noBorder ? styles.container : styles.noBorderContainer}>
        <View style={styles.counterContainer}>
          <TouchableOpacity style={styles.button} onPress={onDecrement}>
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.value}>{value}</Text>
          <TouchableOpacity style={styles.button} onPress={onIncrement}>
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  label: {
    fontFamily: 'Poppins-Medium',
    marginBottom: 5,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    padding: 10,
  },
  button: {
    backgroundColor: '#E0F7FA',
    borderRadius: 50,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 20,
    color: '#00796B',
  },
  value: {
    marginHorizontal: 20,
    fontSize: 18,
  },
  noBorderContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
});

export default Counter;
