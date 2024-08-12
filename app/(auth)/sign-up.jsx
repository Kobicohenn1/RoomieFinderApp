import React, { useState } from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { images } from '../../constants';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import { useRouter } from 'expo-router';

const SignUp = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const submit = async () => {
    if (!form.username || !form.email || !form.password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        'http://192.168.10.10:3500/api/register',
        form
      );
      Alert.alert('Success', response.data.msg);
      // Redirect to sign-in screen
      setTimeout(() => {
        router.push('/sign-in');
      }, 1000);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to register');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LinearGradient
      colors={['#B7B8B0', '#9C9791', '#9B8669', '#82663F']}
      style={{ flex: 1 }}
    >
      <ImageBackground
        source={images.signin}
        resizeMode="cover"
        style={styles.backgroundImage}
      />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.signInContainer}>
            <Text style={styles.signInText}>Sign Up to RoomieFinder</Text>
            <FormField
              title="User Name"
              value={form.username}
              handleChangeText={(e) => setForm({ ...form, username: e })}
              placeholder={'User Name'}
            />
            <FormField
              title="Email"
              value={form.email}
              handleChangeText={(e) => setForm({ ...form, email: e })}
              keyboardType="email-address"
              placeholder={'Email'}
            />
            <FormField
              title="Password"
              value={form.password}
              handleChangeText={(e) => setForm({ ...form, password: e })}
              placeholder={'Password'}
              secureTextEntry
            />
            <CustomButton
              title="Sign Up"
              handlePress={submit}
              disabled={isSubmitting}
            />
            <View style={styles.haveAccountContainer}>
              <Text style={styles.haveAccountText}>
                Already have an account?
              </Text>
              <TouchableOpacity onPress={() => router.push('/sign-in')}>
                <Text style={styles.signUp}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  signInContainer: {
    flex: 1,
    padding: 20,
    paddingTop: 200, // Adjust this value as needed based on your design
  },
  signInText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  haveAccountContainer: {
    justifyContent: 'center',
    paddingTop: 14,
    flexDirection: 'row',
  },
  haveAccountText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    paddingRight: 8,
  },
  signUp: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: '#FFA500',
  },
});

export default SignUp;
