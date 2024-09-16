// import { Request, Response, NextFunction } from "express";
// import { MainAppError } from "./MainAppError";
// import { HTTPCODES } from "./HTTPCODES";

// export const errorHandler = (
//   err: Error | MainAppError, // Allow both Error and MainAppError types
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   console.error("Error:", err);

//   // Check if the error is an instance of MainAppError
//   if (err instanceof MainAppError) {
//     return res.status(err.httpcode).json({
//       message: err.message || "An error occurred",
//       // Optionally include the httpcode in the response for clarity
//       httpcode: err.httpcode,
//     });
//   }

//   // For any other errors, return a generic internal server error
//   return res.status(HTTPCODES.INTERNAL_SERVER_ERROR).json({
//     message: "Internal Server Error",
//     // Optionally include the error stack for debugging in development
//     error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
//   });
// };

import { Request, Response, NextFunction } from "express";
import { MainAppError } from "./errorUtils";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof MainAppError) {
    return res.status(err.httpcode).json({ error: err.message });
  }

  console.error("Unhandled error:", err);
  return res.status(500).json({ error: "An unexpected error occurred" });
};
