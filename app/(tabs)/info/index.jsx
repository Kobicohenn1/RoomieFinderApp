import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from 'react-native';

const { width } = Dimensions.get('screen');

const MoveInfo = () => {
  const [language, setLanguage] = useState('en'); // Default language is English

  const toggleLanguage = () => {
    setLanguage((prevLanguage) => (prevLanguage === 'en' ? 'he' : 'en'));
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View style={styles.languageSwitcher}>
          <TouchableOpacity
            onPress={toggleLanguage}
            style={styles.languageButton}
          >
            <Text style={styles.languageText}>
              {language === 'en' ? 'עברית' : 'English'}
            </Text>
          </TouchableOpacity>
        </View>

        {language === 'en' ? (
          <Text style={styles.text}>
            Moving to a new apartment can be a challenging experience, but with
            the right guidance, it can become a smooth and easy process. Our
            service helps you through every step of the move, ensuring that you
            settle into your new home with ease.
          </Text>
        ) : (
          <Text style={[styles.text, styles.hebrewText]}>
            מעבר לדירה חדשה יכול להיות חוויה מאתגרת, אך עם ההכוונה הנכונה, זה
            יכול להפוך לתהליך חלק וקל. השירות שלנו מסייע לכם בכל שלב במעבר,
            ומבטיח שתתמקמו בנוחות בדירה החדשה שלכם.
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    width: width * 0.9,
    alignSelf: 'center',
  },
  languageSwitcher: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  languageButton: {
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  languageText: {
    color: '#fff',
    fontFamily: 'Poppins-Medium',
  },
  text: {
    marginTop: 20,
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    fontFamily: 'Poppins-Regular',
  },
  hebrewText: {
    textAlign: 'right', // Align text to the right for Hebrew
  },
});

export default MoveInfo;
