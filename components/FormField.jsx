import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { icons } from '../constants';
import React, { useState } from 'react';

const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <View style={{ marginVertical: 3 }}>
      <Text style={styles.title}>{title}</Text>
      <View
        style={{
          width: '100%',
          height: 16,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 4,
          ...styles.input,
        }}
      >
        <TextInput
          value={value}
          placeholder={placeholder}
          onChangeText={handleChangeText}
          secureTextEntry={title === 'Password' && !showPassword}
          placeholderTextColor="rgba(255, 255, 255, 0.7)"
          style={{
            flex: 1,
            fontFamily: 'Poppins-SemiBold',
            fontSize: 18,
          }}
        />
        {title === 'Password' && (
          <TouchableOpacity
            onPress={() => {
              setShowPassword(!showPassword);
            }}
          >
            <Image
              source={icons.eye}
              resizeMode="contain"
              style={{ width: 40, height: 40 }}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;

const styles = StyleSheet.create({
  title: {
    fontFamily: 'Poppins-Medium',
  },
  input: {
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 10,
    color: 'white',
    paddingHorizontal: 10,
    borderRadius: 8,
  },
});
