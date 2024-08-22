import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { height } = Dimensions.get('screen');

const OptionItem = ({ iconName, text, onPress }) => (
  <TouchableOpacity style={styles.optionItem} onPress={onPress}>
    <Ionicons name={iconName} size={24} color="black" />
    <Text style={styles.optionText}>{text}</Text>
  </TouchableOpacity>
);

const OptionsModal = ({
  isVisible,
  onClose,
  onOpenFilterModal,
  onOpenBugReportModal,
}) => (
  <Modal
    visible={isVisible}
    transparent
    animationType="slide"
    onRequestClose={onClose}
  >
    <TouchableOpacity
      style={styles.modalOverlay}
      activeOpacity={1}
      onPress={onClose}
    >
      <View style={styles.optionsModalContainer}>
        <OptionItem
          iconName="options-outline"
          text="Filter"
          onPress={onOpenFilterModal}
        />
        <OptionItem
          iconName="help-circle-outline"
          text="Bugs Report"
          onPress={onOpenBugReportModal}
        />
      </View>
    </TouchableOpacity>
  </Modal>
);

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  optionsModalContainer: {
    backgroundColor: '#f0f0f0',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    // Add shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    // Add elevation for Android
    elevation: 8,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  optionText: {
    marginLeft: 15,
    fontSize: 16,
  },
});

export default OptionsModal;
