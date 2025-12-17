import mongoose, { Schema } from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import mongooseLeanVirtuals from "mongoose-lean-virtuals";
import mongoosePaginate from "mongoose-paginate-v2";

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    is_private: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

roomSchema.plugin(mongoosePaginate);
roomSchema.plugin(aggregatePaginate);
roomSchema.plugin(mongooseLeanVirtuals);

const Room = mongoose.model("Room", roomSchema);

export default Room;
