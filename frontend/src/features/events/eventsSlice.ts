import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import API from '../../api/axiosConfig';
import type { Event, EventRequest, ApiError } from '../../types/types';

interface EventsState {
	events: Event[];
	currentEvent: Event | null;
	loading: boolean;
	error: ApiError | null;
	currentUserId: number | null; // для хранения ID текущего пользователя
}

const initialState: EventsState = {
	events: [],
	currentEvent: null,
	loading: false,
	error: null,
	currentUserId: null, 
};

type RejectValue = ApiError;

export const fetchEvents = createAsyncThunk<

	Event[],
	number, // Изменено: теперь принимает userId
	{ rejectValue: RejectValue }

>('events/fetchAll', async (_, { rejectWithValue }) => {

	try {
		const response = await API.get<Event[]>('/events/user');
		return response.data;
	} catch (error: unknown) {
		const apiError = error as { response?: { data: ApiError } };
		return rejectWithValue(apiError.response?.data as ApiError);
	}

});

export const fetchEventById = createAsyncThunk<

	Event,
	number,
	{ rejectValue: RejectValue }

>('events/fetchById', async (eventId, { rejectWithValue }) => {

	try {
		const response = await API.get<Event>(`/events/${eventId}`);
		return response.data;
	} catch (error: unknown) {
		const apiError = error as { response?: { data: ApiError } };
		return rejectWithValue(apiError.response?.data as ApiError);
	}
});

export const createEvent = createAsyncThunk<

	Event,
	EventRequest,
	{ rejectValue: RejectValue }

>('events/create', async (eventData, { rejectWithValue }) => {

	try {
		const response = await API.post<Event>('/events', eventData);
		return response.data;
	} catch (error: unknown) {
		const apiError = error as { response?: { data: ApiError } };
		return rejectWithValue(apiError.response?.data as ApiError);
	}
	
});

export const updateEvent = createAsyncThunk<

	Event,
	{ eventId: number; eventData: Partial<EventRequest> },
	{ rejectValue: RejectValue }

>('events/update', async ({ eventId, eventData }, { rejectWithValue }) => {

	try {
		const response = await API.put<Event>(`/events/${eventId}`, eventData);
		return response.data;
	} catch (error: unknown) {
		const apiError = error as { response?: { data: ApiError } };
		return rejectWithValue(apiError.response?.data as ApiError);
	}

});

export const deleteEvent = createAsyncThunk<

	number,
	number,
	{ rejectValue: RejectValue }

>('events/delete', async (eventId, { rejectWithValue }) => {

	try {
		await API.delete(`/events/${eventId}`);
		return eventId;
	} catch (error: unknown) {
		const apiError = error as { response?: { data: ApiError } };
		return rejectWithValue(apiError.response?.data as ApiError);
	}

});

export const fetchEventsByDate = createAsyncThunk<

	Event[],
	{ userId: number; date: string },
	{ rejectValue: RejectValue }

>('events/fetchByDate', async ({ date }, { rejectWithValue }) => {

	try {
		const response = await API.get<Event[]>(`/events/date?date=${date}`);
		return response.data;
	} catch (error: unknown) {
		const apiError = error as { response?: { data: ApiError } };
		return rejectWithValue(apiError.response?.data as ApiError);
	}

});

export const fetchEventsByMonth = createAsyncThunk<

	Event[],
	{ year: number; month: number },
	{ rejectValue: RejectValue }

>('events/fetchByMonth', async ({ year, month }, { rejectWithValue }) => {

	try {
		const response = await API.get<Event[]>(`/events/month?year=${year}&month=${month}`);
		return response.data;
	}catch (error: unknown) {
		const apiError = error as { response?: { data: ApiError } };
		return rejectWithValue(apiError.response?.data as ApiError);
  	}
	
});

export const searchEvents = createAsyncThunk<
	Event[],
	string,
	{ rejectValue: RejectValue }
>('events/search', async (keyword, { rejectWithValue }) => {
	try {
		const response = await API.get<Event[]>(`/events/search?keyword=${keyword}`);
		return response.data;
	} catch (error: unknown) {
		const apiError = error as { response?: { data: ApiError } };
		return rejectWithValue(apiError.response?.data as ApiError);
	}
});

const eventsSlice = createSlice({
	name: 'events',
	initialState,
	reducers: {
		clearCurrentEvent: (state) => {
		state.currentEvent = null;
		},
		clearEvents: (state) => {
		state.events = [];
		},
		setCurrentUserId: (state, action: PayloadAction<number>) => {
			state.currentUserId = action.payload;
		},
	},
	extraReducers: (builder) => {
	builder
		// Получение всех событий
		.addCase(fetchEvents.pending, (state) => {
		state.loading = true;
		state.error = null;
		})
		.addCase(fetchEvents.fulfilled, (state, action: PayloadAction<Event[]>) => {
		state.loading = false;
		state.events = action.payload;
		})
		.addCase(fetchEvents.rejected, (state, action) => {
		state.loading = false;
		state.error = action.payload ?? null;
		})

		// Получение события по ID
		.addCase(fetchEventById.fulfilled, (state, action: PayloadAction<Event>) => {
		state.currentEvent = action.payload;
		})

		// Создание события
		.addCase(createEvent.fulfilled, (state, action: PayloadAction<Event>) => {
		state.events.push(action.payload);
		})

		// Обновление события
		.addCase(updateEvent.fulfilled, (state, action: PayloadAction<Event>) => {
		const index = state.events.findIndex(e => e.id === action.payload.id);
		if (index !== -1) {
			state.events[index] = action.payload;
		}

		if (state.currentEvent?.id === action.payload.id) {
			state.currentEvent = action.payload;
		}
		})

		// Удаление события
		.addCase(deleteEvent.fulfilled, (state, action: PayloadAction<number>) => {
		state.events = state.events.filter(e => e.id !== action.payload);
		if (state.currentEvent?.id === action.payload) {
			state.currentEvent = null;
		}
		})

		// События по дате
		.addCase(fetchEventsByDate.fulfilled, (state, action: PayloadAction<Event[]>) => {
		state.events = action.payload;
		})

		// События по месяцу
		.addCase(fetchEventsByMonth.fulfilled, (state, action: PayloadAction<Event[]>) => {
		state.events = action.payload;
		})

		// Поиск событий
		.addCase(searchEvents.fulfilled, (state, action: PayloadAction<Event[]>) => {
		state.events = action.payload;
		});
  },
});

export const { clearCurrentEvent, clearEvents, setCurrentUserId } = eventsSlice.actions;
export default eventsSlice.reducer;