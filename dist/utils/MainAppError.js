"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainAppError = void 0;
class MainAppError extends Error {
    constructor(options) {
        super(options.message);
        this.httpcode = options.httpcode;
    }
}
exports.MainAppError = MainAppError;
