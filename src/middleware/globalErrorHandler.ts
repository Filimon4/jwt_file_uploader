import { NextFunction, Request, Response } from "express";

export default function globalErrorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  const status = 500;
  let message = "Internal Server Error";

  if (err instanceof Error) {
    message = err.message;
  }

  res.status(status).json({
    status: "error",
    message,
    ...(process.env.NODE_ENV !== "production" && {
      stack: err instanceof Error ? err.stack : undefined,
    }),
  });
  
}
