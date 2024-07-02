"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDatabase = void 0;
require("reflect-metadata");
const user_1 = __importDefault(require("../entity/user"));
const datasource_1 = __importDefault(require("../datasource"));
exports.seedDatabase = async () => {
    try {
        const data = await datasource_1.default.getRepository(user_1.default);
        const usersToCreate = {
            name: "John Doe",
            email: "john@example.com",
            password: "123456",
        };
        const existingUser = await data.findOne({
            where: { email: usersToCreate.email },
        });
        if (!existingUser) {
            await data.save(usersToCreate);
            console.log("Database seeded");
        }
        else {
            console.log("Database already seeded");
        }
    }
    catch (error) {
        console.log(error);
    }
};
