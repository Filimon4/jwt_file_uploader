import {Response} from "express"

type ErrorPayload = {
  message: string;
  stack?: string;
};

export default function sendError(res: Response, error: unknown, statusCode = 500) {
  const errPayload: ErrorPayload = {
    message: "Unknown error",
  };

  if (error instanceof Error) {
    errPayload.message = error.message;
    if (process.env.NODE_ENV !== "production") {
      errPayload.stack = error.stack;
    }
  } else if (typeof error === "string") {
    errPayload.message = error;
  } else if (typeof error === "object" && error !== null && "message" in error) {
    errPayload.message = String((error as {message: string}).message);
  }

  return res.status(statusCode).json({
    status: "error",
    message: JSON.stringify({
      ...errPayload
    }, null, 2)
  });
}