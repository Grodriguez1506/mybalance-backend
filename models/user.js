import { Schema, model } from "mongoose";

const UserSchema = Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  salary: {
    type: Number,
    default: 0,
  },
  currency: {
    type: String,
    default: "USD",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

export default model("User", UserSchema);
