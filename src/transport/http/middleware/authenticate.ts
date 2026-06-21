import jwt from 'jsonwebtoken';
import type { RequestHandler } from 'express';

export function authenticate(jwtSecret: string): RequestHandler {

  return (req, res, next) => {
    const header = req.get('Authorization') ?? '';
    const [scheme, token] = header.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ error: 'falta el token bearer' });
    }

    try {
      
      jwt.verify(token, jwtSecret);
      return next();

    } catch {
      return res.status(401).json({ error: 'token invalido' });
    }
  };
}
