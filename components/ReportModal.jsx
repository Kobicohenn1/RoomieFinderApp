import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ReportModal = ({ isVisible, onClose, profile }) => {
  const [reportReason, setReportReason] = useState('');

  const handleReportSubmit = async () => {
    if (!reportReason) {
      Alert.alert('Please enter a reason for the report.');
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
        'http://192.168.10.10:3500/api/report',
        {
          username: profile.username,
          reason: reportReason,
        },
        {
          headers: {
            'x-auth-token': token,
          },
        }
      );

      if (response.status === 200) {
        Alert.alert('Report submitted successfully.');
      } else {
        Alert.alert('Failed to submit report.');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      Alert.alert('An error occurred while submitting the report.');
    }

    setReportReason('');
    onClose();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Report User</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter reason for reporting"
            placeholderTextColor="#999"
            value={reportReason}
            onChangeText={setReportReason}
          />
          <View style={styles.modalButtonsContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleReportSubmit}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
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

export default ReportModal;
