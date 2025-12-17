import mongoose from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import mongooseLeanVirtuals from "mongoose-lean-virtuals";
import mongoosePaginate from "mongoose-paginate-v2";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profile_picture: {
      type: String,
      default:
        "https://res.cloudinary.com/demo/image/upload/v1580125066/samples/people/default-profile.jpg",
    },
    is_online: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Search with text index
userSchema.index({
  email: "text",
});

userSchema.plugin(mongoosePaginate);
userSchema.plugin(aggregatePaginate);
userSchema.plugin(mongooseLeanVirtuals);

const User = mongoose.model("User", userSchema);

export default User;
