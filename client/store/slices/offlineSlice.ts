import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface OfflineState {
  isOnline: boolean;
  isSWReady: boolean;
  cachedAt: string | null; // ISO string of last successful data sync
  canInstall: boolean;     // PWA install prompt available
}

const initialState: OfflineState = {
  isOnline: typeof navigator !== "undefined" ? navigator.onLine : true,
  isSWReady: false,
  cachedAt: localStorage.getItem("guidely:cached_at") ?? null,
  canInstall: false,
};

export const offlineSlice = createSlice({
  name: "offline",
  initialState,
  reducers: {
    setOnlineStatus(state, action: PayloadAction<boolean>) {
      state.isOnline = action.payload;
    },
    setSWReady(state) {
      state.isSWReady = true;
    },
    setCachedAt(state, action: PayloadAction<string>) {
      state.cachedAt = action.payload;
      try { localStorage.setItem("guidely:cached_at", action.payload); } catch {}
    },
    setCanInstall(state, action: PayloadAction<boolean>) {
      state.canInstall = action.payload;
    },
  },
});

export const { setOnlineStatus, setSWReady, setCachedAt, setCanInstall } = offlineSlice.actions;
export default offlineSlice.reducer;
