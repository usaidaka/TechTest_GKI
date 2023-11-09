import { configureStore } from "@reduxjs/toolkit";
import userDocumentReducer from "../features/userDoc";

export const store = configureStore({
  reducer: {
    userDocument: userDocumentReducer,
  },
});
