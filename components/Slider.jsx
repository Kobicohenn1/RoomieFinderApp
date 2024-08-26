import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

const Slider = ({ label, range, min, max, step, onValuesChange }) => {
  return (
    <View style={styles.sliderContainer}>
      <Text style={styles.sliderLabel}>{range[0]}</Text>
      <MultiSlider
        values={range}
        min={min}
        max={max}
        step={step}
        onValuesChange={onValuesChange}
        selectedStyle={{ backgroundColor: '#21b78a' }}
        markerStyle={styles.sliderMarker}
        trackStyle={styles.sliderTrack}
        sliderLength={250}
      />
      <Text style={styles.sliderLabel}>{range[1]}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  sliderLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    width: 50,
    textAlign: 'center',
  },
  sliderMarker: {
    height: 25,
    width: 25,
    borderRadius: 12.5,
    backgroundColor: '#21b78a',
  },
  sliderTrack: {
    height: 8,
    width: '70%',
  },
});

export default Slider;
