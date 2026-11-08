import api from '../api/client';
import type { Credentials, LoginResponse, PasswordChange, ProfileUpdate, Registration, User } from '../types/api';
export const accountService = {
  login: (credentials: Credentials) => api.post<LoginResponse>('/login/', credentials),
  register: (data: Registration) => api.post<User>('/register/', data),
  profile: () => api.get<User>('/profile/'),
  update: (data: ProfileUpdate) => api.put<User>('/profile/update/', data),
  password: (data: PasswordChange) => api.post<{ message: string }>('/profile/change-password/', data),
  image: (profile_image: string) => api.post<{ image_url: string }>('/profile/upload-image/', { profile_image }),
  removeImage: () => api.delete<void>('/profile/upload-image/'),
};
