import type { RequestHandler } from 'express';

export function openApiJsonHandler(openApiSpec: unknown): RequestHandler {
  return (req, res) => {
    res.json(openApiSpec);
  };
}
