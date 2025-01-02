const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../models");
const { User } = require("../models");

beforeAll(async () => {
  await User.create({
    email: "hehehe@mail.com",
    password: "hehehe",
  });
});

afterAll(async () => {
  await sequelize.queryInterface.bulkDelete("Users", null, {
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
});

describe("POST /register", () => {
  describe("POST /register - succeed", () => {
    it("should be return an object with message", async () => {
      const body = { email: "abc@mail.com", password: "12345" };
      const response = await request(app).post("/register").send(body);

      expect(response.status).toBe(201);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", expect.any(String));
    });
  });

  describe("POST /register - fail", () => {
    it("should be return an object with error message", async () => {
      const body = { email: "", password: "12345" };
      const response = await request(app).post("/register").send(body);

      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", expect.any(String));
    });

    it("should be return an object with error message", async () => {
      const body = { email: "test@mail.com", password: "" };
      const response = await request(app).post("/register").send(body);

      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", expect.any(String));
    });
  });
});

describe("POST /login", () => {
  test("successfully login and send access_token", async () => {
    const response = await request(app)
      .post("/login")
      .send({ email: "hehehe@mail.com", password: "hehehe" });

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("access_token", expect.any(String));
  });

  test("Email not provided / not entered", async () => {
    const response = await request(app).post("/login").send({ password: "hehehe" });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Please input email or password");
  });

  test("Password not provided / not entered", async () => {
    const response = await request(app).post("/login").send({ email: "hehehe@mail.com" });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Please input email or password");
  });

  test("Invalid email provided / not registered", async () => {
    const response = await request(app).post("/login").send({ email: "a", password: "hehehe" });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid email or password");
  });

  test("incorrect password  / does not match", async () => {
    const response = await request(app)
      .post("/login")
      .send({ email: "hehehe@mail.com", password: "a" });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid email or password");
  });
});
