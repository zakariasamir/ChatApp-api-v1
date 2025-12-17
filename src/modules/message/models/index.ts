import mongoose, { Schema } from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import mongooseLeanVirtuals from "mongoose-lean-virtuals";
import mongoosePaginate from "mongoose-paginate-v2";

const messageSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    sender_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: function () {
        return !this.room_id; // receiver_id is required if room_id is not provided
      },
    },
    room_id: {
      type: Schema.Types.ObjectId,
      ref: "Room",
      required: function () {
        return !this.receiver_id; // room_id is required if receiver_id is not provided
      },
    },
    is_read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

messageSchema.plugin(mongoosePaginate);
messageSchema.plugin(aggregatePaginate);
messageSchema.plugin(mongooseLeanVirtuals);

const Message = mongoose.model("Message", messageSchema);

export default Message;
