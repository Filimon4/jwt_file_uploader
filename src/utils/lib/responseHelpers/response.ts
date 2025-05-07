import {Response} from "express"

export default function sendResponse(res: Response, data: string | Record<string | number, string | number>, statusCode = 200, message = 'Success') {
  return res.status(statusCode).json({
      status: 'ok',
      message,
      data
  });
}