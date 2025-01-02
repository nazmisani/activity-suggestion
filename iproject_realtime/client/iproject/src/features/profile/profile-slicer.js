import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchAsync = createAsyncThunk(
  "profile/fetchAsync",
  async ({ base_url, method, body }, { rejectWithValue }) => {
    try {
      const options = {
        method,
        headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
      };
      if (body instanceof FormData) {
        options.body = body;
      } else {
        options.headers["Content-Type"] = "application/json";
        options.body = JSON.stringify(body);
      }

      const response = await fetch(`${base_url}/profile`, options);

      if (!response.ok) throw new Error(await response.text());
      return await response.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    profile: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default profileSlice.reducer;
