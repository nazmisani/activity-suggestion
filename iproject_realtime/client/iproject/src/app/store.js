import { configureStore } from "@reduxjs/toolkit";
import activity from "../features/activity/activity-slicer";

export default configureStore({
  reducer: {
    activity,
  },
});
