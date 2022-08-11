"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUsername = exports.handleError = exports.generateRandomCode = void 0;
exports.generateRandomCode = function () { return Math.floor(100000 + Math.random() * 900000); };
exports.handleError = function (response, message) {
    return response.status(500).json({ error: message });
};
exports.generateUsername = function (name) {
    var randomDigit = Math.floor(100 + Math.random() * 900);
    if (name) {
        return "" + name.substring(0, 3) + randomDigit;
    }
    else {
        return "iamcool" + randomDigit;
    }
};
