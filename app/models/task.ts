import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    payload: { type: Object },
    is_processed: { type: Boolean, required: false, default: false }
  },
  { collection: "tasks", autoCreate: true }
);

const task_model = mongoose.model("Task", schema);

export { task_model };
