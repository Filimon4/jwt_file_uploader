import {Response} from "express"

export default function sendError(res: Response, error: {message: string}, statusCode = 400) {
  return res.status(statusCode).json({
      status: 'error',
      message: error.message || 'Unknown error'
  });
}
