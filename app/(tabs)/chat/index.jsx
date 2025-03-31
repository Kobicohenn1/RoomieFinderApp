import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native'; // Add this import
import { API_BASE_URL } from '../../../constants';

const ChatScreen = () => {
  const router = useRouter();
  const [conversations, setConversations] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch conversations function
  const fetchConversations = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const id = await AsyncStorage.getItem('userId');
      setUserId(id);

      const response = await axios.get(`${API_BASE_URL}/conversations`, {
        headers: {
          'x-auth-token': token,
        },
      });
      setConversations(response.data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Use `useFocusEffect` to re-fetch conversations when the screen is focused
  useFocusEffect(
    useCallback(() => {
      setLoading(true); // Set loading true to show loader
      fetchConversations(); // Re-fetch conversations whenever the screen gains focus
    }, [])
  );

  useEffect(() => {
    if (selectedConversationId) {
      const initializeChat = async () => {
        try {
          const token = await AsyncStorage.getItem('token');

          const socketInstance = io('http://192.168.10.10:3500', {
            query: { token },
          });

          setSocket(socketInstance);

          socketInstance.emit('joinConversation', selectedConversationId);

          socketInstance.on('message', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
          });

          const response = await axios.get(
            `${API_BASE_URL}/conversations/${selectedConversationId}/messages`,
            {
              headers: {
                'x-auth-token': token,
              },
            }
          );
          setMessages(response.data);
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };

      initializeChat();

      return () => {
        if (socket) socket.disconnect();
      };
    }
  }, [selectedConversationId]);

  const sendMessage = () => {
    if (newMessage.trim()) {
      socket.emit('chatMessage', {
        conversationId: selectedConversationId,
        senderId: userId,
        message: newMessage,
      });
      setNewMessage('');
    }
  };

  const handleGoBack = () => {
    setSelectedConversationId(null); // Reset selected conversation to go back to the list of all chats
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#21b78a" />
      </View>
    );
  }

  if (!selectedConversationId) {
    return (
      <View style={styles.container}>
        <FlatList
          data={conversations}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => {
            const otherParticipant = item.participants.find(
              (participant) => participant._id !== userId
            );

            return (
              <TouchableOpacity
                style={styles.conversationItem}
                onPress={() => setSelectedConversationId(item._id)}
              >
                <Image
                  source={{
                    uri: `http://192.168.10.10:3500${otherParticipant.profileImageUrl}`,
                  }}
                  style={styles.avatar}
                />
                <View style={styles.textContainer}>
                  <Text style={styles.username}>
                    {otherParticipant.username}
                  </Text>
                  <Text style={styles.lastMessage}>
                    {item.lastMessage || 'No messages yet'}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <TouchableOpacity style={styles.goBackButton} onPress={handleGoBack}>
        <Text style={styles.goBackButtonText}>Go Back</Text>
      </TouchableOpacity>

      <FlatList
        data={messages}
        keyExtractor={(item, index) => `${item._id}-${index}`}
        renderItem={({ item }) => {
          const isCurrentUser = item.sender._id === userId;
          return (
            <View
              style={[
                styles.messageContainer,
                isCurrentUser
                  ? styles.currentUserMessage
                  : styles.otherUserMessage,
              ]}
            >
              <Image
                source={{
                  uri: `http://192.168.10.10:3500${item.sender.profileImageUrl}`,
                }}
                style={styles.avatar}
              />
              <View style={styles.textBubble}>
                <Text style={styles.messageSender}>{item.sender.username}</Text>
                <Text style={styles.messageText}>{item.message}</Text>
              </View>
            </View>
          );
        }}
      />
      <TextInput
        style={styles.input}
        value={newMessage}
        onChangeText={setNewMessage}
        placeholder="Type a message..."
        placeholderTextColor="#b2b2b2"
      />
      <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
        <Text style={styles.sendButtonText}>Send</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#e6e8e4',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goBackButton: {
    backgroundColor: '#21b78a',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  goBackButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  lastMessage: {
    color: '#888',
    marginTop: 2,
  },
  messageContainer: {
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentUserMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#dcf8c6',
    borderRadius: 10,
    padding: 8,
    maxWidth: '80%',
    marginLeft: '20%',
  },
  otherUserMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 8,
    maxWidth: '80%',
    marginRight: '20%',
  },
  textBubble: {
    padding: 8,
    borderRadius: 10,
    flex: 1,
  },
  messageSender: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#21b78a',
  },
  messageText: {
    marginTop: 3,
    fontSize: 14,
    color: '#333',
  },
  input: {
    borderColor: '#21b78a',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    color: '#333',
  },
  sendButton: {
    backgroundColor: '#21b78a',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChatScreen;
