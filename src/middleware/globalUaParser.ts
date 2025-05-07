import { NextFunction, Request, Response } from "express";
import { UAParser } from "ua-parser-js";

export interface DeviceData {
  timestamp: string;
  ip: string;
  device: UAParser.IDevice;
  browser: UAParser.IBrowser;
  os: UAParser.IOS;
  endpoint: string;
  method: string;
}

export default function globalUaParser(req: Request, res: Response, next: NextFunction) {
  const userAgent = req.headers["user-agent"] || "unknown";
  const ip = req.ip || req.connection.remoteAddress || "";
  const parser = new UAParser(userAgent);
  const { browser, os, device } = parser.getResult();

  req.deviceData = {
    timestamp: new Date().toString(),
    ip: ip,
    device: device,
    browser: browser,
    os: os,
    endpoint: req.originalUrl,
    method: req.method,
  };

  next();
}
