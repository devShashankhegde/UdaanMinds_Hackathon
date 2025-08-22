export interface JWTPayload {
  userId: string;
  email: string;
  userType: string;
}

export const generateToken = (payload: JWTPayload): string => {
  const jwt = require('jsonwebtoken');
  const secret = process.env.JWT_SECRET || 'krishilink_jwt_secret_key_2024';
  const expiresIn = process.env.JWT_EXPIRE || '24h';
  return jwt.sign(payload, secret, { expiresIn });
};

export const generateRefreshToken = (payload: JWTPayload): string => {
  const jwt = require('jsonwebtoken');
  const secret = process.env.REFRESH_TOKEN_SECRET || 'krishilink_refresh_token_secret_2024';
  return jwt.sign(payload, secret, { expiresIn: '7d' });
};

export const verifyToken = (token: string): JWTPayload => {
  const jwt = require('jsonwebtoken');
  const secret = process.env.JWT_SECRET || 'krishilink_jwt_secret_key_2024';
  return jwt.verify(token, secret) as JWTPayload;
};

export const verifyRefreshToken = (token: string): JWTPayload => {
  const jwt = require('jsonwebtoken');
  const secret = process.env.REFRESH_TOKEN_SECRET || 'krishilink_refresh_token_secret_2024';
  return jwt.verify(token, secret) as JWTPayload;
};
