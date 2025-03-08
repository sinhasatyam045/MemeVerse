import { configureStore, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Load from local storage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('appState');
    return serializedState ? JSON.parse(serializedState) : undefined;
  } catch (err) {
    console.error('Failed to load state:', err);
    return undefined;
  }
};

// Save to local storage
const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('appState', serializedState);
  } catch (err) {
    console.error('Failed to save state:', err);
  }
};

// Async thunk to fetch memes from API
export const fetchMemes = createAsyncThunk('app/fetchMemes', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('https://api.imgflip.com/get_memes');
    return response.data.data.memes;
  } catch (error) {
    console.error('Error fetching memes:', error);
    return rejectWithValue(error.message);
  }
});

const initialState = loadState() || {
  user: null,
  theme: 'light',
  memes: [],
  interactions: {}, // { memeId: { likes: 0, dislikes: 0, comments: [] } }
  loading: false,
  error: null,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    
      if (state.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    likeMeme: (state, action) => {
      const { memeId } = action.payload;
      if (!state.interactions[memeId]) {
        state.interactions[memeId] = { likes: 0, dislikes: 0, comments: [] };
      }
      state.interactions[memeId].likes += 1;
    },
    dislikeMeme: (state, action) => {
      const { memeId } = action.payload;
      if (!state.interactions[memeId]) {
        state.interactions[memeId] = { likes: 0, dislikes: 0, comments: [] };
      }
      state.interactions[memeId].dislikes += 1;
    },
    addComment: (state, action) => {
      const { memeId, comment } = action.payload;
      if (!state.interactions[memeId]) {
        state.interactions[memeId] = { likes: 0, dislikes: 0, comments: [] };
      }
      state.interactions[memeId].comments.push(comment);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMemes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMemes.fulfilled, (state, action) => {
        state.loading = false;
        state.memes = action.payload;
      })
      .addCase(fetchMemes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setUser, toggleTheme, likeMeme, dislikeMeme, addComment } = appSlice.actions;

const store = configureStore({
  reducer: {
    app: appSlice.reducer
  }
});

store.subscribe(() => {
  saveState(store.getState().app);
});

 
export default store;
