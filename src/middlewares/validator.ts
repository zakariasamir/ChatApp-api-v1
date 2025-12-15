import { Request, Response, NextFunction } from "express";

// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password strength validation
export const isStrongPassword = (
  password: string
): {
  valid: boolean;
  message?: string;
} => {
  if (password.length < 6) {
    return {
      valid: false,
      message: "Password must be at least 6 characters long",
    };
  }
  return { valid: true };
};

// Username validation
export const isValidUsername = (
  username: string
): {
  valid: boolean;
  message?: string;
} => {
  if (username.length < 3) {
    return {
      valid: false,
      message: "Username must be at least 3 characters long",
    };
  }
  if (username.length > 20) {
    return {
      valid: false,
      message: "Username must be less than 20 characters long",
    };
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return {
      valid: false,
      message: "Username can only contain letters, numbers, and underscores",
    };
  }
  return { valid: true };
};

// Validate register request
export const validateRegister = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  const usernameCheck = isValidUsername(username);
  if (!usernameCheck.valid) {
    res.status(400).json({ message: usernameCheck.message });
    return;
  }

  if (!isValidEmail(email)) {
    res.status(400).json({ message: "Invalid email format" });
    return;
  }

  const passwordCheck = isStrongPassword(password);
  if (!passwordCheck.valid) {
    res.status(400).json({ message: passwordCheck.message });
    return;
  }

  next();
};

// Validate login request
export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Email and password are required" });
    return;
  }

  if (!isValidEmail(email)) {
    res.status(400).json({ message: "Invalid email format" });
    return;
  }

  next();
};

// Validate room creation
export const validateCreateRoom = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { name } = req.body;

  if (!name) {
    res.status(400).json({ message: "Room name is required" });
    return;
  }

  if (name.length < 1 || name.length > 50) {
    res.status(400).json({
      message: "Room name must be between 1 and 50 characters",
    });
    return;
  }

  next();
};

// Validate message creation
export const validateCreateMessage = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { content } = req.body;

  if (!content || typeof content !== "string") {
    res.status(400).json({ message: "Message content is required" });
    return;
  }

  if (content.trim().length === 0) {
    res.status(400).json({ message: "Message cannot be empty" });
    return;
  }

  if (content.length > 1000) {
    res.status(400).json({
      message: "Message must be less than 1000 characters",
    });
    return;
  }

  next();
};
