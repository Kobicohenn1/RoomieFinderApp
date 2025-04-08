# RoomieFinder

A mobile app I built to help people find roommates and manage apartment listings. This project was my first experience building a full-stack mobile application using React Native and Node.js. It helped me learn about mobile development, API design, and handling real-world data.

## Features

- **User Authentication**: Secure login and registration system with automatic login after registration
- **Apartment Management**: Create and manage apartment listings with image upload
- **Profile System**: Customizable user profiles with image support and preference settings
- **Search & Filter**: Find apartments based on location, price, and preferences
- **Real-time Updates**: Track apartment status and roommate matches

## Demo

[![RoomieFinder Demo](https://img.youtube.com/vi/-spYLN6l9Mk/0.jpg)](https://www.youtube.com/watch?v=-spYLN6l9Mk)

This video demonstrates the key features of RoomieFinder, including user registration, profile management, and apartment listings.

## Tech Stack

### Frontend

- React Native with Expo
- React Navigation v6
- Redux Toolkit for state management
- Axios for API calls
- AsyncStorage for local data
- Custom UI components

### Backend

- Node.js & Express.js
- MongoDB for database
- JWT for authentication
- Multer for file uploads
- Express static file serving

## Installation

1. Clone and install dependencies:

```bash
git clone https://github.com/Kobicohenn1/RoomieFinderApp.git
cd RoomieFinderApp
npm install
```

2. Set up environment variables in `.env`:

```env
API_BASE_URL=your_api_url
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

3. Start the app:

```bash
npm start
```

## Project Structure

```
RoomieFinder_app/
├── app/                    # Main app screens
│   ├── (auth)/            # Authentication screens
│   ├── (tabs)/            # Main tab screens
│   │   ├── home/          # Home tab
│   │   ├── profile/       # Profile tab
│   │   ├── chat/         # Chat tab
│   │   └── info/         # Info tab
│   └── search/           # Search screen
├── api/                    # Backend API
│   ├── controllers/       # Route controllers
│   ├── model/           # Database models
│   ├── middleware/      # Custom middleware
│   └── routes/           # API routes
├── components/           # Reusable components
└── store/                # Redux store and slices
```

## Authentication Flow

The app uses JWT for authentication with the following flow:

1. User registers with email, password, and username
2. Backend validates credentials and creates user
3. User is automatically logged in after registration
4. JWT token is stored in AsyncStorage for persistent sessions
5. Protected routes require valid JWT token

## State Management

Redux Toolkit is used for state management with the following structure:

- **Auth Slice**: Handles authentication state (login, registration, token)
- **Profile Slice**: Manages user profile data
- **Apartment Slice**: Handles apartment listings and preferences

## API Endpoints

### Authentication

- `POST /api/register` - Register new user
- `POST /api/login` - User login

### Profile

- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/:id` - Update user profile
- `POST /api/profile/upload` - Upload profile picture

### Apartments

- `GET /api/apartments` - Get all apartments
- `POST /api/apartments` - Create apartment listing
- `GET /api/apartments/:id` - Get apartment details

## What I Learned

- Building full-stack mobile applications with React Native
- Implementing secure authentication and file uploads
- Designing and building RESTful APIs
- Managing state with Redux Toolkit
- Working with MongoDB and handling real-world data
- Implementing proper error handling and user feedback
- Separating concerns between controllers and routes

## About This Project

This is a personal project I built while learning mobile development. It demonstrates my ability to work with modern web technologies and build practical applications. I've recently improved the authentication flow, added better error handling, and implemented Redux for state management. While there's room for improvement, I'm proud of what I've accomplished and the skills I've developed.

Feel free to check out the code and let me know if you have any questions or suggestions!
