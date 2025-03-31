import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  Alert,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Calendar from 'expo-calendar';

const AddEventModal = ({ isVisible, onClose }) => {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isStartDatePickerVisible, setStartDatePickerVisibility] =
    useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);

  const showStartDatePicker = () => setStartDatePickerVisibility(true);
  const showEndDatePicker = () => setEndDatePickerVisibility(true);

  const createEvent = async () => {
    try {
      const calendarId = await Calendar.createCalendarAsync({
        title: 'Expo Calendar',
        color: '#21b78a',
        entityType: Calendar.EntityTypes.EVENT,
        sourceId: (await Calendar.getDefaultCalendarAsync()).source.id,
        name: 'internalCalendarName',
        ownerAccount: 'personal',
        accessLevel: Calendar.CalendarAccessLevel.OWNER,
      });
      const eventDetails = {
        title,
        startDate,
        endDate,
        timeZone: 'Asia/Jerusalem',
        location,
      };

      const eventId = await Calendar.createEventAsync(calendarId, eventDetails);
      Alert.alert('Success', `Event created successfully with ID: ${eventId}`);
      onClose();
    } catch (error) {
      console.error('Error creating event:', error);
      Alert.alert(
        'Error',
        `An error occurred while creating the event: ${error.message}`
      );
    }
  };

  const handleStartDatePress = () => {
    Keyboard.dismiss(); // Close the keyboard
    showStartDatePicker(); // Show the start date picker
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      onRequestClose={onClose}
      transparent
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContent}>
          <Text style={styles.title}>Add Event</Text>
          <TextInput
            style={styles.input}
            placeholder="Event Title"
            placeholderTextColor="#b2b2b2"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={styles.input}
            placeholder="Location"
            placeholderTextColor="#b2b2b2"
            value={location}
            onChangeText={setLocation}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={handleStartDatePress}
          >
            <Text style={styles.buttonText}>Select Start Date</Text>
          </TouchableOpacity>
          {isStartDatePickerVisible && (
            <DateTimePicker
              value={startDate}
              mode="datetime"
              display="default"
              onChange={(event, date) => {
                setStartDate(date || startDate);
                setStartDatePickerVisibility(false);
              }}
            />
          )}
          <TouchableOpacity style={styles.button} onPress={showEndDatePicker}>
            <Text style={styles.buttonText}>Select End Date</Text>
          </TouchableOpacity>
          {isEndDatePickerVisible && (
            <DateTimePicker
              value={endDate}
              mode="datetime"
              display="default"
              onChange={(event, date) => {
                setEndDate(date || endDate);
                setEndDatePickerVisibility(false);
              }}
            />
          )}
          <TouchableOpacity style={styles.createButton} onPress={createEvent}>
            <Text style={styles.createButtonText}>Create Event</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#e6e8e4',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#21b78a',
    marginBottom: 20,
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 20,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderColor: '#21b78a',
    color: '#000',
  },
  button: {
    backgroundColor: '#21b78a',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  createButton: {
    backgroundColor: '#21b78a',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  createButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#21b78a',
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#21b78a',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default AddEventModal;
