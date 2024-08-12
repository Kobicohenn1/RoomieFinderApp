import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import Animated, { FadeIn } from 'react-native-reanimated';

const CustomDateTimePicker = ({ value, onChange }) => {
  const [showPicker, setShowPicker] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    onChange(selectedDate);
    setShowPicker(false);
  };

  const formattedDate = moment(value).format('YYYY-MM-DD');

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setShowPicker(true)}>
        <Text style={styles.dateText}>{formattedDate}</Text>
      </TouchableOpacity>
      {showPicker && (
        <Animated.View entering={FadeIn}>
          <DateTimePicker
            value={value}
            mode="date"
            display="calendar"
            onChange={handleDateChange}
            style={styles.datePicker}
          />
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
  },
  dateText: {
    fontSize: 16,
    padding: 10,
  },
  datePicker: {
    // Add styles to customize the date picker's appearance if needed
  },
});

export default CustomDateTimePicker;
