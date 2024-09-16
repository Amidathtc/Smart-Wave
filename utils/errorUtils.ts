import { Request, Response, NextFunction } from "express";

export class MainAppError extends Error {
  public httpcode: number;

  constructor({ message, httpcode }: { message: string; httpcode: number }) {
    super(message);
    this.httpcode = httpcode;
  }
}

export const errorHandler = (err: MainAppError, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err);
  res.status(err.httpcode || 500).json({ error: err.message });
};
