import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  Touchable,
} from 'react-native';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { icons } from '../constants';

export const profileCardWidth = Dimensions.get('screen').width * 0.8;

const ProfileCard = ({ profile }) => {
  //if (!profile) return null;//
  return (
    <View style={styles.card}>
      <Image
        source={{
          uri: `http://192.168.10.10:3500${profile.profileImageUrl}`,
        }}
        style={[StyleSheet.absoluteFillObject, styles.image]}
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={[StyleSheet.absoluteFillObject, styles.overlay]}
      />
      <View style={styles.footer}>
        <Text style={styles.name}>
          {profile.username}
          {profile.age ? ',' + profile.age : ''}
        </Text>
        <View style={styles.container}>
          <Text style={styles.city}>{profile.city}</Text>
          {profile.hasApartment ? (
            <View style={styles.iconContainer}>
              <Image style={styles.icon} source={icons.have_home} />
              <Text style={styles.haveHomeText}>Have a home</Text>
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: profileCardWidth,
    height: profileCardWidth * 1.67,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    position: 'absolute',
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    justifyContent: 'flex-end',

    elevation: 4,
  },
  image: {
    flex: 1,
    borderRadius: 15,
  },
  footer: {
    padding: 15,
    backgroundColor: 'white',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2.62,
  },
  overlay: {
    top: '50%',
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
  },
  name: {
    fontFamily: 'Poppins-Medium',
    fontSize: 30,
    color: 'black',
  },
  city: {
    fontFamily: 'Poppins-Regular',
    color: 'gray',
  },
  icon: {
    width: 25,
    height: 25,
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  haveHomeText: {
    marginLeft: 5,
  },
});

export default ProfileCard;
