import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BugReportModal = ({ isVisible, onClose }) => {
  const [bugDescription, setBugDescription] = useState('');

  const handleBugReportSubmit = async () => {
    if (!bugDescription) {
      Alert.alert('Please enter a description of the bug.');
      return;
    }

    try {
      const userId = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('token');
      if (!userId || !token) {
        Alert.alert('Auth Error');
        return;
      }
      const response = await axios.post(
        'http://192.168.10.10:3500/api/bug-report',
        {
          description: bugDescription,
        },
        {
          headers: { 'x-auth-token': token },
        }
      );

      if (response.status === 200) {
        Alert.alert('Bug report submitted successfully.');
      } else {
        Alert.alert('Failed to submit bug report.');
      }
    } catch (error) {
      console.error('Error submitting bug report:', error);
      Alert.alert('An error occurred while submitting the bug report.');
    }

    setBugDescription('');
    onClose();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Report a Bug</Text>
              <TextInput
                style={styles.input}
                placeholder="Describe the bug you encountered"
                placeholderTextColor="#999"
                value={bugDescription}
                onChangeText={setBugDescription}
                multiline
              />
              <View style={styles.modalButtonsContainer}>
                <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleBugReportSubmit}
                >
                  <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    height: 100,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 15,
    textAlignVertical: 'top', // Ensure text input aligns at the top for multiline
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
  cancelButtonText: {
    color: '#333',
  },
  submitButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
  },
  submitButtonText: {
    color: 'white',
  },
});

export default BugReportModal;
