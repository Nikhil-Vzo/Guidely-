import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface GuidelyUser {
  id: string;
  email: string | null;
  name: string | null;
  avatar_url: string | null;
}

interface UserState {
  user: GuidelyUser | null;
  isAuthLoading: boolean;
}

const initialState: UserState = {
  user: null,
  isAuthLoading: true,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<GuidelyUser | null>) {
      state.user = action.payload;
      state.isAuthLoading = false;
    },
    setAuthLoading(state, action: PayloadAction<boolean>) {
      state.isAuthLoading = action.payload;
    },
    clearUser(state) {
      state.user = null;
      state.isAuthLoading = false;
    },
  },
});

export const { setUser, setAuthLoading, clearUser } = userSlice.actions;
export default userSlice.reducer;
