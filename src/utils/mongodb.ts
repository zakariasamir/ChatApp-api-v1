import { Types } from "mongoose";

// Utility function to safely convert MongoDB ObjectId to string
export const toObjectId = (id: string | Types.ObjectId): Types.ObjectId => {
  if (typeof id === "string") {
    return new Types.ObjectId(id);
  }
  return id;
};

// Utility function to safely convert MongoDB document _id to string
export const getIdString = (doc: any): string => {
  return (doc._id as any).toString();
};

// Utility function to format user document
export const formatUser = (user: any) => ({
  id: getIdString(user),
  username: user.username,
  email: user.email,
  password: user.password,
  profile_picture: user.profile_picture,
  is_online: user.is_online,
  created_at: user.created_at,
  updated_at: user.updated_at,
});

// Utility function to format room document
export const formatRoom = (room: any) => ({
  id: getIdString(room),
  name: room.name,
  description: room.description,
  is_private: room.is_private,
  created_at: room.created_at,
  updated_at: room.updated_at,
});

// Utility function to format message document
export const formatMessage = (message: any) => ({
  id: getIdString(message),
  content: message.content,
  sender_id: message.sender_id,
  room_id: message.room_id?.toString(),
  receiver_id: message.receiver_id?.toString(),
  is_read: message.is_read,
  created_at: message.created_at,
  updated_at: message.updated_at,
  sender_name: (message.sender_id as any)?.username,
  sender_profile_picture: (message.sender_id as any)?.profile_picture,
});


