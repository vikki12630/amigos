import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserData {
  token: string;
  _id: string;
  name: string;
  lastname: string;
  email: string;
  profileImg: string;
  followers: string[];
  following: string[];
  isAuthenticated: boolean;
}

const initialState: UserData = {
  token: "",
  _id: "",
  name: "",
  lastname: "",
  email: "",
  profileImg: "",
  followers: [],
  following: [],
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<UserData>) => {
      state.isAuthenticated = true;
      state._id = action.payload._id;
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.lastname = action.payload.lastname;
      state.profileImg = action.payload.profileImg;
      state.followers = action.payload.followers;
      state.following = action.payload.following;
      state.token = action.payload.token;
    },

    logout: (state) => {
      state.isAuthenticated = initialState.isAuthenticated;
      state._id = initialState._id;
      state.email = initialState.email;
      state.name = initialState.name;
      state.lastname = initialState.lastname;
      state.profileImg = initialState.profileImg;
      state.followers = initialState.followers;
      state.following = initialState.following;
      state.token = initialState.token;
      // return initialState;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
