"use strict";
// import { Request, Response, NextFunction } from "express";
// import { MainAppError } from "./MainAppError";
// import { HTTPCODES } from "./HTTPCODES";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorUtils_1 = require("./errorUtils");
const errorHandler = (err, req, res, next) => {
    if (err instanceof errorUtils_1.MainAppError) {
        return res.status(err.httpcode).json({ error: err.message });
    }
    console.error("Unhandled error:", err);
    return res.status(500).json({ error: "An unexpected error occurred" });
};
exports.errorHandler = errorHandler;
