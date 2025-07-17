import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import User from '../models/User.js'
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js'
export const protect = catchAsync(async (req, res, next) => {
  let token;

  // 1. Get token from Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // 2. Check if token exists
  if (!token) {
    return next(new AppError('You are not logged in', 401));
  }

  // 3. Verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET || 'your_jwt_secret');

  // 4. Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('User no longer exists', 401));
  }

  // 5. Grant access to protected route
  req.user = currentUser;
  next();
});
