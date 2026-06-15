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
		const response = await api.get('/chat/history/full');
		return response.data as { role: string; content: string; createdAt: string }[];
	}
);

const chatSlice = createSlice({
	name: 'chat',
	initialState: {
		loading: false,
		error: null as string | null,
		history: [] as ConsoleMessage[],
		status: 'idle' as 'idle' | 'pending' | 'fulfilled' | 'rejected',
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(sendMessage.pending, (state, action) => {
			state.loading = true;
			state.status = 'pending';
			state.error = null;
			state.history.push({
				id: Date.now().toString(),
				agent: 'user',
				text: action.meta.arg,
				timestamp: new Date().toISOString(),

			});})

			.addCase(sendMessage.fulfilled, (state, action) => {
				state.loading = false;
				state.status = 'fulfilled';
				state.history.push({
					id: (Date.now() + 1).toString(),
					agent: 'assistant',
					text: action.payload,
					timestamp: new Date().toISOString(),
			});})

			.addCase(sendMessage.rejected, (state) => {
				state.loading = false;
				state.status = 'rejected';
			})

			.addCase(fetchHistory.fulfilled, (state, action) => {
				state.history = [...action.payload]
				// .reverse()
				.map((msg) => ({
					id: msg.createdAt,
					agent: msg.role === 'user' ?  'user' : 'assistant',
					agentColor: msg.role === 'user' ? '#94a3b8' : '#fe88f2',
					text: msg.content,
					timestamp: msg.createdAt,
					type: msg.role === 'user' ? 'info' as const : 'success' as const,
				}));
			});
	},
});

export default chatSlice.reducer;