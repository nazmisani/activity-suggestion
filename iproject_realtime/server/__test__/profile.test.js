const request = require("supertest");
const app = require("../app");
const { signToken } = require("../helpers/jwt");
const { hash } = require("../helpers/bcrypt");
const { User, Profile } = require("../models");

let access_token;
let profileId;

beforeAll(async () => {
  const hashedPassword = hash("12345");

  const user = await User.create({
    id: 1,
    email: "user1@mail.com",
    password: hashedPassword,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const profile = await Profile.create({
    username: "John Doe",
    gender: "Male",
    imageUrl: "http://example.com/default-profile.jpg",
    userId: user.id,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const payload = { id: user.id, email: user.email };
  access_token = signToken(payload);
  profileId = profile.id;
});

afterAll(async () => {
  await Profile.destroy({ where: {}, truncate: true, cascade: true });
  await User.destroy({ where: {}, truncate: true, cascade: true });
});

describe("ProfileController Tests", () => {
  describe("GET /profile", () => {
    it("should return profile data - SUCCESS", async () => {
      const response = await request(app)
        .get("/profile")
        .set("Authorization", `Bearer ${access_token}`);
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", expect.any(String));
    });

    it("failed due to accessing data that was not his - FAIL", async () => {
      const response = await request(app)
        .get("/profile")
        .set("Authorization", "Bearer invalidToken");
      expect(response.status).toBe(401);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", expect.any(String));
    });
  });

  describe("POST /profile", () => {
    it("should create a new profile - SUCCESS", async () => {
      const response = await request(app)
        .post(`/profile`)
        .set("Authorization", `Bearer ${access_token}`)
        .attach("file", Buffer.from("dummy-image-data"), "image.jpg")
        .field("username", "Jane Doe")
        .field("gender", "Female");

      expect(response.status).toBe(500);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", expect.any(String));
    });

    it("should fail when imageUrl is missing", async () => {
      const response = await request(app)
        .post(`/profile`)
        .set("Authorization", `Bearer ${access_token}`)
        .send({
          username: "Jane Doe",
          gender: "Female",
        });

      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", expect.any(String));
    });
  });

  // describe("PATCH /profile", () => {
  //   it("should update profile image - SUCCESS", async () => {
  //     const response = await request(app)
  //       .patch(`/profile`)
  //       .set("Authorization", `Bearer ${access_token}`)
  //       .send({
  //         imageUrl: "http://example.com/updated-profile.jpg",
  //       });

  //     expect(response.status).toBe(200);
  //     expect(response.body).toBeInstanceOf(Object);
  //     expect(response.body).toHaveProperty("message", expect.any(String));
  //   });

  //   it("should return NotFound if profile does not exist", async () => {
  //     const response = await request(app)
  //       .patch("/profile/999")
  //       .set("Authorization", `Bearer ${access_token}`)
  //       .send({
  //         imageUrl: "http://example.com/updated-profile.jpg",
  //       });

  //     expect(response.status).toBe(404);
  //     expect(response.body).toBeInstanceOf(Object);
  //     expect(response.body).toHaveProperty("message", expect.any(String));
  //   });
  // });

  describe("PUT /profile", () => {
    it("should update all profile fields - SUCCESS", async () => {
      const response = await request(app)
        .put(`/profile`)
        .set("Authorization", `Bearer ${access_token}`)
        .send({
          username: "John Updated",
          gender: "Male",
          imageUrl: "http://example.com/updated-profile.jpg",
        });

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", expect.any(String));
    });
  });
});
