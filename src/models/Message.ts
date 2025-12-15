import mongoose, { Document, Schema, Types } from "mongoose";
import { Message as MessageType } from "@/types";

const MessageSchema = new Schema<MessageType>(
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
    timestamps: true, // This automatically adds created_at and updated_at
  }
);

// Index for better query performance
MessageSchema.index({ sender_id: 1 });
MessageSchema.index({ receiver_id: 1 });
MessageSchema.index({ room_id: 1 });
MessageSchema.index({ created_at: -1 });
MessageSchema.index({ is_read: 1 });

// Compound indexes for common queries
MessageSchema.index({ sender_id: 1, receiver_id: 1 });
MessageSchema.index({ room_id: 1, created_at: -1 });

export default mongoose.model<MessageType>("Message", MessageSchema);
