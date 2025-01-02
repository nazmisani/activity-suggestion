import { configureStore } from "@reduxjs/toolkit";
import activity from "../features/activity/activity-slicer";
import profile from "../features/profile/profile-slicer";

export default configureStore({
  reducer: {
    activity,
    profile,
  },
});
