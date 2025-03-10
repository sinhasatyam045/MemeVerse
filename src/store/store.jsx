import { configureStore, createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Load state from local storage with improved error handling
const loadState = () => {
  try {
    const storedState = localStorage.getItem("appState");
    return storedState ? JSON.parse(storedState) : undefined;
  } catch (err) {
    console.error("Failed to load state:", err);
    return undefined;
  }
};

// Save state to local storage with improved efficiency
const saveState = (state) => {
  try {
    // Create a copy of the state to avoid mutating the original
    const stateCopy = JSON.stringify(state);
    localStorage.setItem("appState", stateCopy);
    
    // Additionally save profile photo separately to ensure it persists
    if (state.user && state.user.profilePhoto) {
      localStorage.setItem("userProfilePhoto", state.user.profilePhoto);
    }
  } catch (err) {
    console.error("Failed to save state:", err);
  }
};

// Async thunk to fetch memes from API
export const fetchMemes = createAsyncThunk("app/fetchMemes", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get("https://api.imgflip.com/get_memes");
    return response.data.data.memes;
  } catch (error) {
    console.error("Error fetching memes:", error);
    return rejectWithValue(error.message);
  }
});

// Async thunk to generate AI captions for memes
export const generateAICaption = createAsyncThunk("memes/generateCaption", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get("https://api.memegen.link/api/templates");

    if (response.status !== 200) {
      throw new Error("Failed to fetch meme templates");
    }

    const templates = response.data;
    const selectedTemplate = templates[Math.floor(Math.random() * templates.length)];

    const memeResponse = await axios.post(`https://api.memegen.link/images/${selectedTemplate.id}`, {
      text: ["AI Generated Caption"],
    });

    if (memeResponse.status !== 201) {
      throw new Error("Failed to generate meme with AI caption");
    }

    return memeResponse.data.url; // Return generated meme URL
  } catch (error) {
    console.error("Error generating AI caption:", error);
    return rejectWithValue(error.message);
  }
});

// Async thunk to update profile photo
export const updateProfilePhoto = createAsyncThunk(
  "app/updateProfilePhoto",
  async (photoData, { getState, dispatch }) => {
    try {
      // In a real app, you might upload the image to a server here
      // and get back a URL. For now, we'll use the data URL directly.
      
      // Update the user with the new profile photo
      dispatch(updateUser({ profilePhoto: photoData }));
      
      // Ensure we save the photo to localStorage immediately
      localStorage.setItem("userProfilePhoto", photoData);
      
      return photoData;
    } catch (error) {
      console.error("Error updating profile photo:", error);
      throw error;
    }
  }
);

// Try to load profile photo from localStorage
const loadProfilePhoto = () => {
  try {
    return localStorage.getItem("userProfilePhoto") || "";
  } catch (err) {
    console.error("Failed to load profile photo:", err);
    return "";
  }
};

// Initial state with default values
const initialState = (() => {
  const storedState = loadState();
  if (storedState) {
    // Make sure to restore the profile photo from dedicated storage
    const profilePhoto = loadProfilePhoto();
    return {
      ...storedState,
      user: {
        ...storedState.user,
        profilePhoto: profilePhoto
      }
    };
  }
  
  return {
    user: {
      name: "Satyam",
      username: "satyam_25",
      bio: "Frontend Dev & Meme Enthusiast",
      profilePhoto: loadProfilePhoto(), // Try to load saved profile photo
    },
    theme: "light",
    memes: [],
    uploadedMemes: [],
    interactions: {}, // { memeId: { likes: 0, dislikes: 0, comments: [] } }
    likedMemes: [],
    savedMemes: [],
    totalPosts: 0,
    likedPosts: 0,
    totalComments: 0,
    loading: false,
    error: null,
    isEditingProfile: false,
  };
})();

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
      document.documentElement.classList.toggle("dark", state.theme === "dark");
    },
    likeMeme: (state, action) => {
      console.log("Entered liked reducer");
      const memeId = action.payload.memeId;
      console.log(memeId);
      console.log(state);
    
      // Initialize interactions for this meme if it doesn't exist
      if (!state.interactions[memeId]) {
        console.log("State interactions:", state.interactions);
        state.interactions[memeId] = { likes: 0, comments: [] };
      }
      console.log("State interactions:", state.interactions);
      console.log("State.interactions[memeId]:", state.interactions[memeId]);
      state.interactions[memeId].likes += 1;
    
      // Find the liked meme
      const likedMeme = state.memes.find(meme => meme.id === memeId);
      console.log("Liked Meme:", likedMeme);
      
      // Make sure state.likedMemes is an array before using .some()
      if (!Array.isArray(state.likedMemes)) {
        state.likedMemes = [];
      }
      
      // Add the meme to likedMemes if it's not already there
      if (likedMeme && !state.likedMemes.some(meme => meme.id === memeId)) {
        state.likedMemes.push(likedMeme);
        localStorage.setItem("likedMemes", JSON.stringify(state.likedMemes)); // Save to local storage
      }
    },
    dislikeMeme: (state, action) => {
      const { memeId } = action.payload;
      state.interactions[memeId] = state.interactions[memeId] || { likes: 0, dislikes: 0, comments: [] };
      state.interactions[memeId].dislikes -= 1;
    },
    addComment: (state, action) => {
      const { memeId, comment } = action.payload;
      state.interactions[memeId] = state.interactions[memeId] || { likes: 0, dislikes: 0, comments: [] };
      state.interactions[memeId].comments.push(comment);
      state.totalComments += 1;
    },
    deleteComment: (state, action) => {
      const { memeId, commentIndex } = action.payload;
      if (state.interactions[memeId] && state.interactions[memeId].comments[commentIndex]) {
        state.interactions[memeId].comments.splice(commentIndex, 1); // Remove comment at commentIndex
        state.totalComments -= 1; // Decrement totalComments count
      }
    },
    addMeme: (state, action) => {
      const newMeme = {
        ...action.payload,
        id: Date.now(),
        timestamp: new Date().toISOString(),
        // Add user information to the meme
        user: {
          name: state.user.name,
          username: state.user.username,
          profilePhoto: state.user.profilePhoto
        }
      };
      console.log("New Meme:", newMeme);
      
      // Add to uploadedMemes array
      state.uploadedMemes.unshift(newMeme);
      state.totalPosts += 1;
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      
      // If profile photo is being updated, also update it in uploaded memes
      // and save it to localStorage immediately
      if (action.payload.profilePhoto !== undefined) {
        // Update the photo in uploaded memes
        state.uploadedMemes = state.uploadedMemes.map(meme => ({
          ...meme,
          user: {
            ...meme.user,
            profilePhoto: action.payload.profilePhoto
          }
        }));
        
        // Save to localStorage immediately for redundancy
        localStorage.setItem("userProfilePhoto", action.payload.profilePhoto);
      }
    },
    toggleEditProfile: (state) => {
      state.isEditingProfile = !state.isEditingProfile;
    },
    saveMeme: (state, action) => {
      const { memeId } = action.payload;
      if (!state.savedMemes.includes(memeId)) {
        state.savedMemes.push(memeId);
      }
    },
    removeSavedMeme: (state, action) => {
      state.savedMemes = state.savedMemes.filter((id) => id !== action.payload.memeId);
    },
    setLikedMemes: (state, action) => {
      state.likedMemes = action.payload;
    },
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
      })
      .addCase(generateAICaption.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateProfilePhoto.fulfilled, (state, action) => {
        state.loading = false;
        // The actual state update happens in the updateUser reducer
      })
      .addCase(updateProfilePhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = "Failed to update profile photo";
      })
      .addCase(updateProfilePhoto.pending, (state) => {
        state.loading = true;
      });
  },
});

export const {
  setUser,
  toggleTheme,
  likeMeme,
  dislikeMeme,
  addComment,
  deleteComment,
  addMeme,
  updateUser,
  toggleEditProfile,
  saveMeme,
  removeSavedMeme,
  setLikedMemes,
} = appSlice.actions;

const store = configureStore({
  reducer: {
    app: appSlice.reducer,
  },
});

// Set up the store subscriber to save state changes
store.subscribe(() => {
  saveState(store.getState().app);
});

export default store;