"use strict";
/**
 * Baseline Buddy Core - Core Baseline detection and analysis logic
 *
 * This module provides the foundational functionality for detecting
 * and analyzing web features against Baseline status.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
// Working implementations
__exportStar(require("./working-baseline-detector"), exports);
__exportStar(require("./working-feature-analyzer"), exports);
__exportStar(require("./working-ai-suggestions"), exports);
__exportStar(require("./working-utils"), exports);
// AI Auto-Fix Engine
__exportStar(require("./ai-auto-fix-engine"), exports);
//# sourceMappingURL=index.js.map