// features/chat/chatSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api/axiosConfig';
import type { ConsoleMessage } from '../../types/types';
export const sendMessage = createAsyncThunk(
	'chat/sendMessage',
	async (message: string) => {
		const response = await api.post('/chat', { message });
		return response.data.reply as string;
	}
);

export const fetchHistory = createAsyncThunk(
	'chat/fetchHistory',
	async () => {
		const response = await api.get('/chat/history');
		return response.data as { role: string; content: string; createdAt: string }[];
	}
);

const chatSlice = createSlice({
	name: 'chat',
	initialState: {
		loading: false,
		error: null as string | null,
		history: [] as ConsoleMessage[],
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(sendMessage.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(sendMessage.fulfilled, (state) => {
				state.loading = false;
			})
			.addCase(sendMessage.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message ?? 'Ошибка';
			})

			.addCase(fetchHistory.fulfilled, (state, action) => {
				state.history = action.payload
				.reverse()
				.map((msg) => ({
					id: msg.createdAt,
					agent: msg.role === 'user' ? 'user' : 'Alise',
					agentColor: msg.role === 'user' ? '#94a3b8' : '#fe88f2',
					text: msg.content,
					timestamp: msg.createdAt, // строка, не new Date()
					type: msg.role === 'user' ? 'info' as const : 'success' as const,
				}));
			});
	},
});

export default chatSlice.reducer;