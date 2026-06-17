import jwt from 'jsonwebtoken';

export function authenticate(jwtSecret) {
  return (req, res, next) => {
    const header = req.get('Authorization') ?? '';
    const [scheme, token] = header.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ error: 'missing bearer token' });
    }

    try {
      jwt.verify(token, jwtSecret);
      return next();
    } catch {
      return res.status(401).json({ error: 'invalid token' });
    }
  };
}
