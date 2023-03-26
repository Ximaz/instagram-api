"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserContent = void 0;
const axios_1 = __importDefault(require("axios"));
async function getUserContent(username, ctx) {
    return (await axios_1.default.get(`https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`, { headers: ctx })).data;
}
exports.getUserContent = getUserContent;
