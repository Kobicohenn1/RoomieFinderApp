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
import { images } from '../../constants';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import { useRouter } from 'expo-router';
import { registerUser } from '../store/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';

const SignUp = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
  });

  const router = useRouter();
  const { isLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const submit = async () => {
    if (!form.username || !form.email || !form.password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const result = await dispatch(registerUser(form)).unwrap();
      if (result.isLoggedIn) {
        Alert.alert('Registration successful! You are now logged in.');
        setTimeout(() => {
          router.replace('/(tabs)/home');
        }, 1000);
      } else {
        // Registration successful but login failed
        Alert.alert(
          'Success',
          'Registration successful! Please log in to continue.'
        );
        router.push('/sign-in');
      }

      // Redirect to home screen if the registartion and the log in was success
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to register');
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
              title={isLoading ? 'Signing Up...' : 'Sign Up'}
              handlePress={submit}
              disabled={isLoading}
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
