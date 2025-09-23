"use strict";
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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const SettingsSchema = new mongoose_1.Schema({
    minPayoutUsd: {
        type: Number,
        required: true,
        default: 5
    },
    payoutCooldownHours: {
        type: Number,
        required: true,
        default: 48
    },
    maxDailyEarnUsd: {
        type: Number,
        required: true,
        default: 0.5
    },
    safetyMargin: {
        type: Number,
        required: true,
        default: 0.6
    },
    eCPM_USD: {
        type: Number,
        required: true,
        default: 1.5
    },
    impressionsToday: {
        type: Number,
        required: true,
        default: 0
    },
    appPepper: {
        type: String,
        required: true
    },
    emulatorPayouts: {
        type: Boolean,
        required: true,
        default: false
    },
    coinToUsdRate: {
        type: Number,
        required: true,
        default: 0.001
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});
// Ensure only one settings document exists
SettingsSchema.index({}, { unique: true });
exports.default = mongoose_1.default.model('Settings', SettingsSchema);
//# sourceMappingURL=Settings.js.map