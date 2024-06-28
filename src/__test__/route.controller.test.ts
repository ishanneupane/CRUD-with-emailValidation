import Koa from "koa";
import request from "supertest";
import bodyParser from "koa-bodyparser";
import { getRepository, Repository } from "typeorm";
import router from "../route.controller"; 
import * as bcrypt from "bcrypt";
import * as Jwt from "jsonwebtoken";
import User from "../entity/user";  

// Mock the User entity
jest.mock("typeorm", () => {
  const actualTypeorm = jest.requireActual("typeorm");
  return {
    ...actualTypeorm,
    getRepository: jest.fn(),
  };
});

const mockRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
};

(getRepository as jest.Mock).mockReturnValue(mockRepository);

const app = new Koa();
app.use(bodyParser());
app.use(router.routes()).use(router.allowedMethods());

describe("Koa Router", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("GET / - should return user data", async () => {
    mockRepository.find.mockResolvedValue([{ id: 7, email: "test@test.com" }]);

    const response = await request(app.callback()).get("/");
    expect(response.status).toBe(200);
    expect(response.body.data).toEqual([{ id: 7, email: "test@test.com" }]);
  });

  test("GET /:id - should return user data by id", async () => {
    mockRepository.findOne.mockResolvedValue({ id: 7, email: "test@test.com" });

    const response = await request(app.callback()).get("/7");
    expect(response.status).toBe(200);
    expect(response.body.data).toEqual({ id: 7, email: "test@test.com" });
  });

  test("GET /:id - should return 404 if user not found", async () => {
    mockRepository.findOne.mockResolvedValue(null);

    const response = await request(app.callback()).get("/7");
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("User not found");
  });

  test("POST /signup - should create a user", async () => {
    const user = { email: "test@test.com", password: "723456" };
    mockRepository.save.mockResolvedValue({ id: 7, ...user });
    jest.spyOn(bcrypt, "hash").mockResolvedValue("hashedPassword"as never);

    const response = await request(app.callback()).post("/signup").send(user);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("User created");
  });

  test("POST /login - should login a user and return token", async () => {
    const user = { id: 7, email: "test@test.com", password: "hashedPassword" };
    mockRepository.findOne.mockResolvedValue(user);
    jest.spyOn(bcrypt, "compare").mockResolvedValue(true as never);
    jest.spyOn(Jwt, "sign").mockReturnValue();

    const response = await request(app.callback()).post("/login").send({
      email: "test@test.com",
      password: "723456",
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("User logged in");
    expect(response.body.token).toBe("token");
  });

  test("POST /login - should return 404 if user not found", async () => {
    mockRepository.findOne.mockResolvedValue(null);

    const response = await request(app.callback()).post("/login").send({
      email: "test@test.com",
      password: "723456",
    });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("User not found");
  });

  test("POST /login - should return 407 if wrong password", async () => {
    const user = { id: 7, email: "test@test.com", password: "hashedPassword" };
    mockRepository.findOne.mockResolvedValue(user);
    jest.spyOn(bcrypt, "compare").mockResolvedValue(false as never);

    const response = await request(app.callback()).post("/login").send({
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
    jest.spyOn(bcrypt, "hash").mockResolvedValue("newHashedPassword" as never);

    const response = await request(app.callback()).put("/profile").send({
      email: "new@test.com",
      password: "newpassword",
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("UserData updated");
  });

  test("PUT /profile - should return 404 if user not found", async () => {
    mockRepository.findOne.mockResolvedValue(null);

    const response = await request(app.callback()).put("/profile").send({
      email: "new@test.com",
      password: "newpassword",
    });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("User not found");
  });
});
