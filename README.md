# RoomieFinder

A mobile app I built to help people find roommates and manage apartment listings. This project was my first experience building a full-stack mobile application using React Native and Node.js. It helped me learn about mobile development, API design, and handling real-world data.

## Features

- **User Authentication**: Secure login and registration system
- **Apartment Management**: Create and manage apartment listings with image upload
- **Profile System**: Customizable user profiles with image support
- **Search & Filter**: Find apartments based on location, price, and preferences
- **Real-time Updates**: Track apartment status and roommate matches

## Tech Stack

### Frontend

- React Native with Expo
- React Navigation v6
- Axios for API calls
- AsyncStorage for local data
- Custom UI components

### Backend

- Node.js & Express.js
- MongoDB for database
- JWT for authentication
- Multer for file uploads

## Installation

1. Clone and install dependencies:

```bash
git clone https://github.com/yourusername/RoomieFinder_app.git
cd RoomieFinder_app
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
│   └── routes/           # API routes
└── components/           # Reusable components
```

## API Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/users/profile` - Get user profile
- `POST /api/apartments` - Create apartment listing
- `GET /api/apartments` - Get all apartments

## What I Learned

- Building full-stack mobile applications with React Native
- Implementing secure authentication and file uploads
- Designing and building RESTful APIs
- Managing state and navigation in mobile apps
- Working with MongoDB and handling real-world data

## About This Project

This is a personal project I built while learning mobile development. It demonstrates my ability to work with modern web technologies and build practical applications. While there's room for improvement, I'm proud of what I've accomplished and the skills I've developed.

Feel free to check out the code and let me know if you have any questions or suggestions!
