import {Response} from "express"

export default function sendResponse(res: Response, data: any, statusCode = 200, message = 'Success') {
  return res.status(statusCode).json({
      status: 'ok',
      message,
      data
  });
}