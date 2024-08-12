import { View, Text, StyleSheet } from 'react-native';
import React from 'react';

const TagList = ({ title, items }) => {
  return items.length > 0 ? (
    <View>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.tagsContainer}>
        {items.map((item, index) => (
          <View key={index} style={styles.tag}>
            <Text style={{ fontFamily: 'Poppins-Regular' }}>{item}</Text>
          </View>
        ))}
      </View>
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  title: {
    fontFamily: 'Poppins-Bold',
    marginBottom: 10,
    fontSize: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    alignSelf: 'flex-start',
    borderRadius: 20,
    borderWidth: 1,
    padding: 7,
    marginRight: 10,
    marginBottom: 10,
  },
  tagText: {
    fontFamily: 'Poppins-Regular',
  },
});

export default TagList;
