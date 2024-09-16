"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.flw = void 0;
// src/flutterwave.ts
const flutterwave_node_1 = __importDefault(require("flutterwave-node"));
const flw = new flutterwave_node_1.default("FLWPUBK_TEST-77aaaf1a9c574ab0152bc26c3adbd9fa-X", "FLWSECK_TEST-19f82b8deca6eea44606cbd91b6d431b-X", true);
exports.flw = flw;
