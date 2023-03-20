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
const pg_1 = require("pg");
const Config_1 = require("../Config");
const ejs_1 = __importDefault(require("ejs"));
const email_1 = __importDefault(require("../Helpers/email"));
// const poolConfig: Pool = pgConfig;
const poolConfig = Config_1.pgConfig;
const sendWelcomeEmail = () => __awaiter(void 0, void 0, void 0, function* () {
    const pool = new pg_1.Pool(poolConfig);
    const client = yield pool.connect();
    const users = yield (yield client.query("SELECT * FROM users WHERE isSent = false")).rows;
    for (let user of users) {
        ejs_1.default.renderFile('Templates/registration.ejs', { name: user.name }, (error, html) => __awaiter(void 0, void 0, void 0, function* () {
            const message = {
                from: "samuelnderitu495@gmail.com",
                to: user.email,
                subject: "Nodemailer Test",
                html
            };
            try {
                yield (0, email_1.default)(message);
                yield client.query(`UPDATE users SET isSent = true WHERE id = '${user.id}'`);
            }
            catch (error) {
                console.log(error);
            }
        }));
    }
    client.release();
});
exports.default = sendWelcomeEmail;
