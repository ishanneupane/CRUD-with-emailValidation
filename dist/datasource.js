"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const path_1 = require("path");
const typeorm_1 = require("typeorm");
require("dotenv").config();
const parentDir = path_1.join(__dirname, "..");
const connectionOptions = {
    host: process.env.DB_HOST,
    type: "postgres",
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false,
    logging: false,
    entities: [
        path_1.join(parentDir, "entity", "*.ts"),
        path_1.join(parentDir, "entity", "*.js"),
    ],
    migrations: ["src/migrations/**/*.ts"],
};
const connection = new typeorm_1.DataSource(connectionOptions);
exports.default = connection;
