import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Text } from 'react-native';

const SelectableIcon = ({ source, selected, onPress }) => {
  return (
    <>
      <TouchableOpacity onPress={onPress} style={styles.iconContainer}>
        <Image
          source={source}
          style={[styles.icon, selected && styles.selectedIcon]}
        />
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    margin: 10,
  },
  icon: {
    width: 50,
    height: 50,
    opacity: 0.5,
  },
  selectedIcon: {
    opacity: 1,
    borderRadius: 6,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 1,
    elevation: 10,
  },
});

export default SelectableIcon;
