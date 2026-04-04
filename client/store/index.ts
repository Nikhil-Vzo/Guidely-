import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import quizReducer from "./slices/quizSlice";
import offlineReducer from "./slices/offlineSlice";
import userReducer from "./slices/userSlice";

export const store = configureStore({
  reducer: {
    quiz: quizReducer,
    offline: offlineReducer,
    user: userReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

// Inferred types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks — use these instead of raw useDispatch / useSelector
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
