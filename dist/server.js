"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = __importDefault(require("."));
const user_seeder_1 = require("./seeders/user-seeder");
const datasource_1 = __importDefault(require("./datasource"));
const PORT = 8080;
_1.default.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    try {
        await datasource_1.default.initialize();
        console.log("Connected to database");
        await user_seeder_1.seedDatabase();
    }
    catch (error) {
        console.error("Error connecting to database:", error);
    }
});
