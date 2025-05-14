import api from './index';

export const profileService = {
  uploadProfileImage: async (imageUri) => {
    const formData = new FormData();
    const imageFile = {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'profileImage',
    };

    formData.append('profileImage', imageFile);
    const response = await api.post('/users/profile/picture', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  updateApartmentSatatus: async (hasApartment) => {
    const response = await api.put('users/profile', {
      updates: { hasApartment },
    });
    return response.data.user.hasApartment;
  },
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },
};
