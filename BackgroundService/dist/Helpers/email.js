"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
const pg_1 = require("pg");
const pgConfig = new pg_1.Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : undefined,
});
function createTransporter(pgConfig) {
    return nodemailer_1.default.createTransport(pgConfig);
}
let config = {
    host: 'smtp.gmail.com',
    service: 'gmail',
    port: 587,
    auth: {
        user: 'samuelnderitu495@gmail.com',
        pass: 'vlnanwdotnasiywb'
    }
};
const sendMail = (messageOptions) => __awaiter(void 0, void 0, void 0, function* () {
    let transporter = createTransporter(config);
    yield transporter.verify();
    yield transporter.sendMail(messageOptions, (err, info) => {
        console.log(info);
    });
});
exports.default = sendMail;
