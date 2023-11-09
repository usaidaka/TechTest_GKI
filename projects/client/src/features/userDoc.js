import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {},
};

export const userDoc = createSlice({
  name: "userDocument",
  initialState,
  reducers: {
    userDocuments: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { userDocuments } = userDoc.actions;

export default userDoc.reducer;
