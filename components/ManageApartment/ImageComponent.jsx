import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ImageComponent = ({ uri, onRemove }) => (
  <View style={styles.imageContainer}>
    <Image source={{ uri }} style={styles.image} />
    <TouchableOpacity onPress={onRemove} style={styles.removeButton}>
      <Ionicons name="close" size={24} color="white" />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  imageContainer: {
    position: 'relative',
    margin: 5,
  },
  image: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
  },
  removeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'black',
    borderRadius: 12,
    padding: 2,
  },
});

export default ImageComponent;
