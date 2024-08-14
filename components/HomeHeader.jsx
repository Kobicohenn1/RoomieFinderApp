import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { images } from '../constants';
import FilterModal from './FilterModal';

const { height } = Dimensions.get('screen');

const HomeHeader = ({ onClose }) => {
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  const handleCloseModal = () => {
    setIsFilterModalVisible(false);
  };
  return (
    <View style={styles.headerContainer}>
      <Image style={styles.logo} source={images.logo} />
      <Text style={styles.title}>Find Your Next Roomate...</Text>
      <View style={styles.iconContainer}>
        <TouchableOpacity style={styles.iconButton} onPress={() => {}}>
          <Ionicons name="notifications-outline" size={28} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setIsFilterModalVisible(true)}
        >
          <Ionicons name="options-outline" size={28} color="black" />
        </TouchableOpacity>
      </View>
      <FilterModal
        isVisible={isFilterModalVisible}
        onClose={handleCloseModal}
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
