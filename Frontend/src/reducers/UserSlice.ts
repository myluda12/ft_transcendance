import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const USER_KEY = "user";

export interface IUserState {
	user: any | null;
	isLoggedIn: boolean;
	isLoading: boolean;
}

const initialState: IUserState = {
	user: null,
	isLoggedIn: false,
	isLoading: true,
};

export const userSlice = createSlice({
	name: "user",
	initialState: initialState,
	reducers: {
		login: (state, action: PayloadAction<any>) => {
			state.user = action.payload;
			state.isLoggedIn = true;
			localStorage.setItem(USER_KEY, JSON.stringify(state.user));
		},
		logout: (state) => {
			state.user = null;
			state.isLoggedIn = false;
			localStorage.removeItem(USER_KEY);
		},
		getUser: (state) => {
			const user = localStorage.getItem(USER_KEY);
			if (user) {
				// state.user = JSON.parse(user);
				state.isLoggedIn = true;
				state.isLoading = false;
				return ;
			}
			state.isLoading = false;
		},
	},
});

export default userSlice.reducer;

export const { login, logout, getUser } = userSlice.actions;