"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.MainAppError = void 0;
class MainAppError extends Error {
    constructor({ message, httpcode }) {
        super(message);
        this.httpcode = httpcode;
    }
}
exports.MainAppError = MainAppError;
const errorHandler = (err, req, res, next) => {
    console.error("Error:", err);
    res.status(err.httpcode || 500).json({ error: err.message });
};
exports.errorHandler = errorHandler;
