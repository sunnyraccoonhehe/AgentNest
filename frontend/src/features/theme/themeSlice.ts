import { createSlice } from '@reduxjs/toolkit';

type ThemeMode = 'light' | 'dark';

type ThemeState = {
	mode: ThemeMode;
};

const savedTheme = localStorage.getItem('app-theme') as ThemeMode | null;

const initialState: ThemeState = {
	mode: savedTheme || 'dark',
};

const themeSlice = createSlice({
	name: 'theme',
	initialState,

	reducers: {
		toggleTheme: (state) => {
			state.mode =
				state.mode === 'dark'
					? 'light'
					: 'dark';

			localStorage.setItem('app-theme', state.mode);
		},

		setTheme: (state, action) => {
			state.mode = action.payload;

			localStorage.setItem('app-theme', state.mode);
		},
	},
});

export const { toggleTheme, setTheme } = themeSlice.actions;

export default themeSlice.reducer;