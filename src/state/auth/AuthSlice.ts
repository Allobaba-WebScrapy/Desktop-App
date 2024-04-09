import { encryptData } from "@/lib/SecureCredentiels";
import { createSlice } from "@reduxjs/toolkit";

// Interface
interface AuthState {
  isLogin: boolean;
  code: string;
}

// Initial state
const initialState: AuthState = {
  isLogin: false,
  code: import.meta.env.VITE_CODE || "123456",
};

// Create slice
const auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state) => {
      state.isLogin = true;
    },

    logout: (state) => {
      state.isLogin = false;
    },
    setCookie: (state) => {
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 7);
      const expires = expirationDate.toUTCString();
      document.cookie = `user=${encryptData({
        code: state.code,
      })}; expires=${expires}; path=/`;
    },
    clearCookie: () => {
      document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    },
  },
});

export const { login, logout, setCookie, clearCookie } = auth.actions;

export default auth.reducer;
