import { configureStore } from "@reduxjs/toolkit";
import userSlicereducer from "../reducers/UserSlice";

const store = configureStore({
	reducer: {
		user: userSlicereducer,
	},
});

export default store;