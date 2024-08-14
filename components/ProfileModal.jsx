import React, { useState, useEffect } from 'react';
import {
  Modal,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Image,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { icons } from '../constants';
import TagList from './TagList';

const { width, height } = Dimensions.get('screen');

const ProfileModal = ({ onClose, isModalVisible, profile }) => {
  const [apartmentData, setApartmentData] = useState(null);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);

  useEffect(() => {
    const fetchApartmentData = async () => {
      if (profile.hasApartment) {
        try {
          const token = await AsyncStorage.getItem('token');
          const apartmentResponse = await axios.get(
            `http://192.168.10.10:3500/api/apartment/${profile.apartment}`,
            {
              headers: {
                'x-auth-token': token,
              },
            }
          );
          if (apartmentResponse.data) {
            setApartmentData(apartmentResponse.data);
          }
        } catch (error) {
          console.error('Error fetching apartment data', error.message);
          Alert.alert('Error', 'Failed to fetch apartment data.');
        }
      } else {
        setApartmentData(null);
      }
    };

    if (isModalVisible) {
      fetchApartmentData();
    } else {
      setApartmentData(null);
    }
  }, [isModalVisible, profile]);

  const handleImagePress = (imageUrl) => {
    setSelectedImageUrl(imageUrl);
    setIsImageModalVisible(true);
  };

  const isEnglish = (text) => /^[A-Za-z0-9\s.,?!'"]+$/.test(text);

  return (
    <Modal
      visible={isModalVisible}
      onRequestClose={onClose}
      animationType="slide"
    >
      <StatusBar barStyle="dark-content" />
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Image
              source={{
                uri: `http://192.168.10.10:3500${profile.profileImageUrl}`,
              }}
              style={styles.profileImage}
            />
            <View style={styles.profileInfoContainer}>
              <Text style={styles.profileName}>{profile.username},</Text>
              <Text style={styles.profileAge}>{profile.age}</Text>
              <FontAwesome
                name={`${profile.gender?.toLowerCase()}`}
                size={24}
                color="black"
              />
            </View>
            <InfoRow
              IconComponent={Ionicons}
              iconProps={{ name: 'home', size: 24, color: 'gray' }}
              text={profile.city}
            />
            <InfoRow
              IconComponent={Ionicons}
              iconProps={{
                name: 'briefcase-outline',
                size: 24,
                color: 'gray',
              }}
              text={
                profile.occupation === 'Both'
                  ? 'Study and Work'
                  : profile.occupation
              }
            />
            <View style={styles.fullWidthSeparator} />
            <View>
              <Text style={styles.aboutMeText}>About Me...</Text>
              <Text
                style={[
                  styles.introduceYourselfText,
                  {
                    textAlign: isEnglish(profile.introduceYourself)
                      ? 'ltr'
                      : 'rtl',
                  },
                ]}
              >
                {profile.introduceYourself}
              </Text>
            </View>
            <View style={styles.fullWidthSeparator} />
            <TagList title="Music" items={profile.music} />
            <TagList title="Sports" items={profile.sports} />
            <TagList title="Movies" items={profile.movieGenres} />

            {apartmentData && (
              <>
                <View style={styles.fullWidthSeparator} />
                <Text style={styles.apartmentHeading}>Apartment Details</Text>
                <InfoRow
                  IconComponent={Ionicons}
                  iconProps={{
                    name: 'home-outline',
                    size: 24,
                    color: 'gray',
                  }}
                  text={apartmentData.city}
                />
                <InfoRow
                  IconComponent={Ionicons}
                  iconProps={{
                    name: 'location-outline',
                    size: 24,
                    color: 'gray',
                  }}
                  text={apartmentData.address}
                />
                <InfoRow
                  IconComponent={Ionicons}
                  iconProps={{ name: 'bed-outline', size: 24, color: 'gray' }}
                  text={`${apartmentData.numberOfRooms} Rooms`}
                />
                <InfoRow
                  IconComponent={Ionicons}
                  iconProps={{
                    name: 'people-outline',
                    size: 24,
                    color: 'gray',
                  }}
                  text={`Male: ${apartmentData.numberOfPeople.male}, Female: ${apartmentData.numberOfPeople.female}`}
                />
                <InfoRow
                  IconComponent={Ionicons}
                  iconProps={{
                    name: 'cash-outline',
                    size: 24,
                    color: 'gray',
                  }}
                  text={`Rent: ₪${apartmentData.rentPrice}`}
                />
                {apartmentData.description && (
                  <View style={styles.descriptionContainer}>
                    <Text
                      style={[
                        styles.descriptionText,
                        {
                          textAlign: isEnglish(apartmentData.description)
                            ? 'left'
                            : 'right',
                        },
                      ]}
                    >
                      {apartmentData.description}
                    </Text>
                  </View>
                )}
                <Text style={styles.rulesHeading}>House Rules</Text>
                <InfoRow
                  IconComponent={
                    apartmentData.houseRules.smokerFriendly
                      ? Image
                      : MaterialIcons
                  }
                  iconProps={
                    apartmentData.houseRules.smokerFriendly
                      ? {
                          source: icons.smoking_allowed,
                          style: { height: 25, width: 25 },
                        }
                      : {
                          name: 'smoke-free',
                          size: 24,
                          color: 'black',
                        }
                  }
                  text={
                    apartmentData.houseRules.smokerFriendly
                      ? 'Smoker Friendly'
                      : 'No Smoking Allowed'
                  }
                />
                <InfoRow
                  IconComponent={
                    apartmentData.houseRules.petFriendly ? MaterialIcons : Image
                  }
                  iconProps={
                    apartmentData.houseRules.petFriendly
                      ? { name: 'pets', size: 24, color: 'gray' }
                      : {
                          source: icons.pet_not_allowed,
                          style: { height: 25, width: 25 },
                        }
                  }
                  text={
                    apartmentData.houseRules.petFriendly
                      ? 'Pet Friendly'
                      : 'No Pets Allowed'
                  }
                />
                <InfoRow
                  IconComponent={Image}
                  iconProps={{
                    source: icons.shabbat,
                    style: { height: 25, width: 25 },
                    color: 'gray',
                  }}
                  text={
                    apartmentData.houseRules.shabbatObservance
                      ? 'Shabbat Observant'
                      : 'Not Shabbat Observant'
                  }
                />
                <View style={styles.fullWidthSeparator} />
                {apartmentData.images &&
                  apartmentData.images.map((image, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() =>
                        handleImagePress(`http://192.168.10.10:3500/${image}`)
                      }
                    >
                      <Image
                        style={styles.apartmentImage}
                        source={{ uri: `http://192.168.10.10:3500/${image}` }}
                      />
                    </TouchableOpacity>
                  ))}
              </>
            )}
          </ScrollView>
          <View style={{ paddingBottom: 25 }}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Full-Screen Image Modal */}
      <Modal
        visible={isImageModalVisible}
        transparent={true}
        onRequestClose={() => setIsImageModalVisible(false)}
      >
        <View style={styles.fullScreenImageContainer}>
          {/* Exit button */}
          <TouchableOpacity
            style={styles.exitButton}
            onPress={() => setIsImageModalVisible(false)}
          >
            <Ionicons name="close-circle" size={36} color="white" />
          </TouchableOpacity>

          <Image
            source={{ uri: selectedImageUrl }}
            style={styles.fullScreenImage}
            resizeMode="contain"
          />
        </View>
      </Modal>
    </Modal>
  );
};

const InfoRow = ({ IconComponent, iconProps, text }) => (
  <View style={styles.infoRow}>
    <IconComponent {...iconProps} />
    <Text style={styles.infoText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'white', // Set the background color to white
  },
  modalContent: {
    flex: 1, // Make sure the content takes up the full screen
    padding: 20,
  },
  scrollContainer: {
    paddingTop: 30,
  },
  profileImage: {
    width: width * 0.8,
    height: height * 0.3,
    borderRadius: 17,
    alignSelf: 'center', // Center the image horizontally
  },
  apartmentImage: {
    width: width * 0.8,
    height: height * 0.3,
    marginVertical: 10, // Add some spacing between images
    borderRadius: 20,
    borderWidth: 1,
  },
  fullScreenImageContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: '100%',
    height: '80%',
  },
  exitButton: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
  closeText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
    textAlign: 'center', // Center the text horizontally
  },
  profileInfoContainer: {
    alignItems: 'center',
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center', // Center the content horizontally
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    fontFamily: 'Poppins-Medium',
    marginHorizontal: 5,
  },
  profileAge: {
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
  },
  fullWidthSeparator: {
    width: '100%',
    height: 1,
    backgroundColor: 'gray',
    marginVertical: 10,
  },
  apartmentHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  rulesHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
  },
  descriptionContainer: {
    marginVertical: 10,
  },
  descriptionText: {
    fontFamily: 'Poppins-Medium',
    color: '#555',
  },
  closeButton: {
    marginTop: 20,
    alignSelf: 'center', // Center the close button horizontally
  },
  closeButtonText: {
    color: '#ff6b6b',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Poppins-SemiBold',
  },
  aboutMeText: { fontFamily: 'Poppins-Bold', marginBottom: 10 },
  introduceYourselfText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
  },
});

export default ProfileModal;
