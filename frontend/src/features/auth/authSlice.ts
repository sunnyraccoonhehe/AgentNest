import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import API from '../../api/axiosConfig';

interface User {
	id?: number;
	email: string;
	username: string;
	phone?: string;
	verified?: boolean;
}

interface AuthState {
	user: User | null;
	token: string | null;
	isAuthenticated: boolean;
	loading: boolean;
	error: string | null;
}

const initialState: AuthState = {
	user: null,
	token: localStorage.getItem('token'),
	isAuthenticated: !!localStorage.getItem('token'),
	loading: false,
	error: null,
};

// Логин
export const login = createAsyncThunk(
	'auth/login',
	async (data: { email: string; password: string }, { dispatch, rejectWithValue }) => {
		try {
			const response = await API.post('/auth/login', data);
			const { token } = response.data;
			localStorage.setItem('token', token);
			await dispatch(fetchCurrentUser());
			return token;
		} catch (error: any) {
			return rejectWithValue(error.response?.data?.message || 'Ошибка входа');
		}
	}
);

// Регистрация
export const register = createAsyncThunk(
	'auth/register',
	async (
		data: { email: string; password: string; username?: string; phone?: string },
		{ dispatch, rejectWithValue }
	) => {
		try {
			const response = await API.post('/auth/register', data);
			const { token } = response.data;

			localStorage.setItem('token', token);

			await dispatch(fetchCurrentUser());

			return token;
		} catch (error: any) {
			return rejectWithValue(error.response?.data?.message || 'Ошибка регистрации');
		}
	}
);

// Получить текущего пользователя
export const fetchCurrentUser = createAsyncThunk(
	'auth/fetchCurrentUser',
	async (_, { rejectWithValue }) => {
		try {
			const response = await API.get('/auth/me');
			return response.data as User;
		} catch (error: any) {
			return rejectWithValue(error.response?.data?.message || 'Failed to fetch user');
		}
	}
);

// Обновление профиля
export const updateProfile = createAsyncThunk(
	'auth/updateProfile',
	async (data: { username: string }, { rejectWithValue }) => {
		try {
			const response = await API.post('/auth/profile', data);
			return response.data as User;
		} catch (error: any) {
			return rejectWithValue(error.response?.data?.message || 'Ошибка обновления профиля');
		}
	}
);

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		logout: (state) => {
			state.user = null;
			state.token = null;
			state.isAuthenticated = false;
			localStorage.removeItem('token');
			localStorage.removeItem('userId');
		},
		clearError: (state) => {
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(login.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(login.fulfilled, (state, action: PayloadAction<string>) => {
				state.token = action.payload;
				state.loading = false;
			})
			.addCase(login.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			})

			// Регистрация
			.addCase(register.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(register.fulfilled, (state, action: PayloadAction<string>) => {
				state.token = action.payload;
				state.isAuthenticated = true;
				state.loading = false;
			})
			.addCase(register.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			})

			// Текущий пользователь
			.addCase(fetchCurrentUser.fulfilled, (state, action: PayloadAction<User>) => {
				state.user = action.payload;
				state.isAuthenticated = true;
				localStorage.setItem('userId', String(action.payload.id));
			})
			.addCase(fetchCurrentUser.rejected, (state) => {
				state.user = null;
				state.token = null;
				state.isAuthenticated = false;
				localStorage.removeItem('token');
			})

			// Обновление профиля
			.addCase(updateProfile.fulfilled, (state, action: PayloadAction<User>) => {
				state.user = action.payload;
			})
			.addCase(updateProfile.rejected, (state, action) => {
				state.error = action.payload as string;
			});
	},
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;