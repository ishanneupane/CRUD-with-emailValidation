"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("koa"));
const supertest_1 = __importDefault(require("supertest"));
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const typeorm_1 = require("typeorm");
const route_controller_1 = __importDefault(require("../route.controller"));
const bcrypt = __importStar(require("bcrypt"));
const Jwt = __importStar(require("jsonwebtoken"));
// Mock the User entity
jest.mock("typeorm", () => {
    const actualTypeorm = jest.requireActual("typeorm");
    return Object.assign(Object.assign({}, actualTypeorm), { getRepository: jest.fn() });
});
const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
};
typeorm_1.getRepository.mockReturnValue(mockRepository);
const app = new koa_1.default();
app.use(koa_bodyparser_1.default());
app.use(route_controller_1.default.routes()).use(route_controller_1.default.allowedMethods());
describe("Koa Router", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test("GET / - should return user data", async () => {
        mockRepository.find.mockResolvedValue([{ id: 7, email: "test@test.com" }]);
        const response = await supertest_1.default(app.callback()).get("/");
        expect(response.status).toBe(200);
        expect(response.body.data).toEqual([{ id: 7, email: "test@test.com" }]);
    });
    test("GET /:id - should return user data by id", async () => {
        mockRepository.findOne.mockResolvedValue({ id: 7, email: "test@test.com" });
        const response = await supertest_1.default(app.callback()).get("/7");
        expect(response.status).toBe(200);
        expect(response.body.data).toEqual({ id: 7, email: "test@test.com" });
    });
    test("GET /:id - should return 404 if user not found", async () => {
        mockRepository.findOne.mockResolvedValue(null);
        const response = await supertest_1.default(app.callback()).get("/7");
        expect(response.status).toBe(404);
        expect(response.body.message).toBe("User not found");
    });
    test("POST /signup - should create a user", async () => {
        const user = { email: "test@test.com", password: "723456" };
        mockRepository.save.mockResolvedValue(Object.assign({ id: 7 }, user));
        jest.spyOn(bcrypt, "hash").mockResolvedValue("hashedPassword");
        const response = await supertest_1.default(app.callback()).post("/signup").send(user);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("User created");
    });
    test("POST /login - should login a user and return token", async () => {
        const user = { id: 7, email: "test@test.com", password: "hashedPassword" };
        mockRepository.findOne.mockResolvedValue(user);
        jest.spyOn(bcrypt, "compare").mockResolvedValue(true);
        jest.spyOn(Jwt, "sign").mockReturnValue();
        const response = await supertest_1.default(app.callback()).post("/login").send({
            email: "test@test.com",
            password: "723456",
        });
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("User logged in");
        expect(response.body.token).toBe("token");
    });
    test("POST /login - should return 404 if user not found", async () => {
        mockRepository.findOne.mockResolvedValue(null);
        const response = await supertest_1.default(app.callback()).post("/login").send({
            email: "test@test.com",
            password: "723456",
        });
        expect(response.status).toBe(404);
        expect(response.body.message).toBe("User not found");
    });
    test("POST /login - should return 407 if wrong password", async () => {
        const user = { id: 7, email: "test@test.com", password: "hashedPassword" };
        mockRepository.findOne.mockResolvedValue(user);
        jest.spyOn(bcrypt, "compare").mockResolvedValue(false);
        const response = await supertest_1.default(app.callback()).post("/login").send({
            email: "test@test.com",
            password: "723456",
        });
        expect(response.status).toBe(407);
        expect(response.body.message).toBe("Wrong password");
    });
    test("PUT /profile - should update user data", async () => {
        const user = { id: 7, email: "test@test.com", password: "hashedPassword" };
        const updatedData = { email: "new@test.com" };
        mockRepository.findOne.mockResolvedValue(user);
        mockRepository.update.mockResolvedValue({ affected: 7 });
        jest.spyOn(bcrypt, "hash").mockResolvedValue("newHashedPassword");
        const response = await supertest_1.default(app.callback()).put("/profile").send({
            email: "new@test.com",
            password: "newpassword",
        });
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("UserData updated");
    });
    test("PUT /profile - should return 404 if user not found", async () => {
        mockRepository.findOne.mockResolvedValue(null);
        const response = await supertest_1.default(app.callback()).put("/profile").send({
            email: "new@test.com",
            password: "newpassword",
        });
        expect(response.status).toBe(404);
        expect(response.body.message).toBe("User not found");
    });
});
