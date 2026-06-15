import axios from 'axios';

const API = axios.create({
	baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
	headers: {
		'Content-Type': 'application/json',
	},
});

API.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('token');
		const userId = localStorage.getItem('userId');
		
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		
		if (userId && !config.url?.includes('/auth/')) {
			config.headers['X-User-Id'] = userId;
		}
		
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

export default API;