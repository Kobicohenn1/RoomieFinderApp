import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  ScrollView,
  Dimensions,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { data } from '../../../assets/data/movingHomeContent'; // Ensure correct path

const { width } = Dimensions.get('screen');

const MoveInfo = () => {
  const [language, setLanguage] = useState('en'); // Default to English

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
  };

  const openLink = (url) => {
    Linking.openURL(url);
  };

  const renderContent = (category) => {
    return (
      <View key={category.key} style={styles.categoryContainer}>
        <Text style={[styles.title, language === 'he' && styles.hebrewTitle]}>
          {category.title}
        </Text>
        {category.image && (
          <Image source={category.image} style={styles.image} />
        )}
        <Text style={[styles.text, language === 'he' && styles.hebrewText]}>
          {category.content}
        </Text>
        {category.services && category.services.length > 0 && (
          <View
            style={[
              styles.servicesContainer,
              language === 'he' && styles.hebrewServicesContainer,
            ]}
          >
            <Text style={styles.servicesTitle}>
              {language === 'en' ? 'Services:' : 'שירותים:'}
            </Text>
            {category.services.map((service, index) => (
              <View
                key={index}
                style={[
                  styles.serviceItem,
                  language === 'he' && styles.hebrewServiceItem,
                ]}
              >
                <Text
                  style={[
                    styles.serviceName,
                    language === 'he' && styles.hebrewServiceName,
                  ]}
                >
                  {service.name}
                </Text>
                <Text
                  style={[
                    styles.serviceDescription,
                    language === 'he' && styles.hebrewServiceDescription,
                  ]}
                >
                  {service.description}
                </Text>
                {service.link && (
                  <TouchableOpacity
                    onPress={() => openLink(service.link)}
                    style={styles.linkButton}
                  >
                    <Text style={styles.linkText}>
                      {language === 'en' ? 'Visit Website' : 'בקר באתר'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        )}
        {category.link && (
          <TouchableOpacity
            onPress={() => openLink(category.link)}
            style={styles.linkButton}
          >
            <Text style={styles.linkText}>
              {language === 'en' ? 'Visit Website' : 'בקר באתר'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  // Find the content for the current language
  const currentContent = data.find((item) => item.language === language);

  return (
    <View style={styles.container}>
      <View style={styles.languageSwitcher}>
        <TouchableOpacity
          style={[
            styles.languageButton,
            language === 'en' && styles.activeLanguageButton,
          ]}
          onPress={() => handleLanguageChange('en')}
        >
          <Text
            style={[
              styles.languageButtonText,
              language === 'en' && styles.activeLanguageButtonText,
            ]}
          >
            English
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.languageButton,
            language === 'he' && styles.activeLanguageButton,
          ]}
          onPress={() => handleLanguageChange('he')}
        >
          <Text
            style={[
              styles.languageButtonText,
              language === 'he' && styles.activeLanguageButtonText,
            ]}
          >
            עברית
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {currentContent.categories.map(renderContent)}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    width: width * 0.9,
    alignSelf: 'center',
    marginVertical: 20,
  },
  languageSwitcher: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  languageButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    backgroundColor: '#fff',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#21b78a',
  },
  activeLanguageButton: {
    backgroundColor: '#21b78a',
  },
  languageButtonText: {
    color: '#21b78a',
    fontSize: 16,
    fontWeight: 'bold',
  },
  activeLanguageButtonText: {
    color: '#fff',
  },
  scrollView: {
    marginTop: 10,
  },
  categoryContainer: {
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  hebrewTitle: {
    textAlign: 'right',
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
  },
  hebrewText: {
    textAlign: 'right', // Right-align text for Hebrew
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  servicesContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  hebrewServicesContainer: {
    alignItems: 'flex-end',
  },
  servicesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  serviceItem: {
    marginBottom: 15,
  },
  hebrewServiceItem: {
    alignItems: 'flex-end',
  },
  serviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#21b78a',
  },
  hebrewServiceName: {
    textAlign: 'right',
  },
  serviceDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  hebrewServiceDescription: {
    textAlign: 'right',
  },
  linkButton: {
    marginTop: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 10, // Adjusted for a more rounded appearance
    borderWidth: 2,
    borderColor: '#21b78a',
    alignItems: 'center',
  },
  linkText: {
    color: '#21b78a',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MoveInfo;
