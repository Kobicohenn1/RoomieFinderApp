import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import OptionsModal from './OptionsModal';
import { images } from '../constants';
import FilterModal from './FilterModal';
import BugReportModal from './BugReportModal';

const { height } = Dimensions.get('screen');

const HomeHeader = ({ onClose, onFiltersApplied, onNavigateToPreference }) => {
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [isOptionsModalVisible, setIsOptionsModalVisible] = useState(false);
  const [isBugReportModalVisible, setIsBugReportModalVisible] = useState(false);

  const handleOpenOptionsModal = () => {
    setIsOptionsModalVisible(true);
  };

  const handleCloseOptionsModal = () => {
    setIsOptionsModalVisible(false);
  };

  const handleOpenFilterModal = () => {
    handleCloseOptionsModal();
    setIsFilterModalVisible(true);
  };

  const handleCloseFilterModal = () => {
    setIsFilterModalVisible(false);
  };
  const handleOpenBugReportModal = () => {
    handleCloseOptionsModal();
    setIsBugReportModalVisible(true);
  };

  const handleCloseBugReportModal = () => {
    setIsBugReportModalVisible(false);
  };
  return (
    <View style={styles.headerContainer}>
      <Image style={styles.logo} source={images.logo} />
      <Text style={styles.title}>Find Your Next Roomate...</Text>
      <View style={styles.iconContainer}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onNavigateToPreference}
        >
          <Ionicons name="options-outline" size={28} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={handleOpenOptionsModal}
        >
          <MaterialCommunityIcons
            name="dots-vertical"
            size={28}
            color="black"
          />
        </TouchableOpacity>
      </View>
      {/* Options Modal */}
      <OptionsModal
        isVisible={isOptionsModalVisible}
        onClose={handleCloseOptionsModal}
        onOpenFilterModal={() => {
          onNavigateToPreference();
          handleCloseOptionsModal();
        }}
        onOpenBugReportModal={handleOpenBugReportModal}
      />
      {/* Filter Modal */}
      <FilterModal
        isVisible={isFilterModalVisible}
        onClose={handleCloseFilterModal}
        onFiltersApplied={onFiltersApplied}
      />
      {/* Bug Report Modal */}
      <BugReportModal
        isVisible={isBugReportModalVisible}
        onClose={handleCloseBugReportModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e6e8e4',
    paddingHorizontal: 15,
    paddingBottom: 8,
    paddingTop: height / 16, // Adjusted for better spacing
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    tintColor: 'black',
  },
  iconContainer: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 10, // Space between the icons
  },
  title: {
    fontFamily: 'Poppins-ExtraBold',
    fontSize: 17,
    padding: 5,
  },
});

export default HomeHeader;
