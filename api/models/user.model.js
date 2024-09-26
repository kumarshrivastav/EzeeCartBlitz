import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    avatar: {
      type: String,
      default:
        "https://th.bing.com/th/id/OIP.NYbU4qvZgLQtB1-qR0hjYwHaHa?rs=1&pid=ImgDetMain",
    },
  },
  { timestamps: true }
);

const userModel = mongoose.models.users || mongoose.model("users", userSchema);
export default userModel;
