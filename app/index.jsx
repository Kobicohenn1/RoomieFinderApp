import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as dp,
} from 'react-native-responsive-screen';
import { Redirect, router } from 'expo-router';
import { images } from '../constants';
import { LinearGradient } from 'expo-linear-gradient';
import CustomButton from '../components/CustomButton';
import LogoAnimation from '../components/LogoAnimation';
import ProfileCard from '../components/ProfileCard';

export default function App() {
  const [animationCompleted, setAnimationCompleted] = useState(false);

  const handleAnimationEnd = () => {
    setAnimationCompleted(true);
  };

  if (!animationCompleted) {
    return <LogoAnimation onAnimationEnd={handleAnimationEnd} />;
  }

  return (
    <LinearGradient
      colors={['#B7B8B0', '#9C9791', '#9B8669', '#82663F']}
      style={{ flex: 1 }}
    >
      <ImageBackground
        source={images.opening}
        resizeMode="cover"
        style={styles.backgroundImage}
      />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.container}>
            <Image
              source={images.logo}
              resizeMode="contain"
              style={{ width: 200, height: 200, margin: 90, marginBottom: 45 }}
            />
            <View style={{ marginTop: 20 }}>
              <Text style={styles.text}>
                Find Your Perfect Roomie, Find Your Perfect Home!
              </Text>
              <View style={{ alignSelf: 'center', marginTop: 10 }}>
                <CustomButton
                  handlePress={() => {
                    router.push('/sign-in');
                  }}
                  title="Continue with Email"
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 26,
    color: 'white',
    textAlign: 'center',
    marginTop: 50,
  },
  backgroundImage: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
});
