//faltou adicionar o teste do payload de update
import * as request from "supertest";
import app from "../src/app";
import { seed, unseed } from "./seeds/user.seed";
import { UserEntity } from "../src/user/entities/user.entity";

let id = "";
let accessToken = "";
let users: UserEntity[] = [];

beforeAll(async () => {
  users = await seed(120);
});

afterAll(async () => {
  await unseed(users);
});

describe("Should test create user endpoint", () => {
  const createUserPayload = {
    name: "Matheus Teste",
    email: "matheus@mail.com",
    password: "matheus123",
    weight: 80,
  };

  it("should create user with valid credentals", async () => {
    const response = await request
      .default(app)
      .post("/signup")
      .send(createUserPayload);

    id = response.body.user.id;
    accessToken = response.body.access_token;
    expect(response.status).toBe(201);
    expect(response.body.access_token).toBeDefined();
    expect(response.body.user.id).toBeDefined();
    expect(response.body.user.email).toBeDefined();
    expect(response.body.user.name).toBeDefined();
    expect(response.body.user.weight).toBeDefined();
    expect(response.body.user.createdAt).toBeDefined();
    expect(response.body.user.updatedAt).toBeDefined();
  });

  it("should throw conflict exception when user with same email already exists", async () => {
    const response = await request
      .default(app)
      .post("/signup")
      .send(createUserPayload);

    expect(response.status).toBe(409);
  });

  it("should throw bad request when creating user with no body", async () => {
    const noPayloadResponse = await request
      .default(app)
      .post("/signup")
      .send({});

    expect(noPayloadResponse.status).toBe(400);
    expect(noPayloadResponse.body.message).toBe(
      "name is required, email is required, password is required, weight is required",
    );
  });

  it("should throw bad request when creating user with invalid email", async () => {
    const invalidEmailResponse = await request
      .default(app)
      .post("/signup")
      .send({
        name: "Matheus Teste",
        email: "matheusmail.com",
        password: "matheus123",
        weight: 80,
      });

    expect(invalidEmailResponse.status).toBe(400);
    expect(invalidEmailResponse.body.message).toBe(
      "email must be a valid email",
    );
  });

  it("should throw bad request when creating user with invalid weight", async () => {
    const invalidMinWeightResponse = await request
      .default(app)
      .post("/signup")
      .send({
        name: "Valid Name",
        email: "valid@mail.com",
        password: "valid123",
        weight: 10,
      });

    expect(invalidMinWeightResponse.status).toBe(400);
    expect(invalidMinWeightResponse.body.message).toBe(
      "weight must be at least 30",
    );

    const invalidMaxWeightResponse = await request
      .default(app)
      .post("/signup")
      .send({
        name: "Valid Name",
        email: "valid@mail.com",
        password: "valid123",
        weight: 301,
      });
    expect(invalidMaxWeightResponse.status).toBe(400);
    expect(invalidMaxWeightResponse.body.message).toBe(
      "weight must be less than 300",
    );
  });

  it("should throw bad request when creating user with invalid password", async () => {
    const invalidMinLengthPasswordResponse = await request
      .default(app)
      .post("/signup")
      .send({
        name: "Valid Name",
        email: "Valid@mail.com",
        password: "123",
        weight: 80,
      });

    expect(invalidMinLengthPasswordResponse.status).toBe(400);
    expect(invalidMinLengthPasswordResponse.body.message).toBe(
      "password must have at least 5 characters",
    );

    const invalidMaxLengthPasswordResponse2 = await request
      .default(app)
      .post("/signup")
      .send({
        name: "Valid Name",
        email: "Valid@mail.com",
        password: "012345678901234567890123456789",
        weight: 80,
      });

    expect(invalidMaxLengthPasswordResponse2.status).toBe(400);
    expect(invalidMaxLengthPasswordResponse2.body.message).toBe(
      "password must have less than 25 characters",
    );
  });
});

describe("Should test auth user endpoints", () => {
  it("should login with right credentials", async () => {
    const response = await request
      .default(app)
      .post("/signin")
      .send({ email: "matheus@mail.com", password: "matheus123" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("access_token");
    expect(response.body.access_token).toBeDefined();
  });

  it("should throw unauthorized exception login with wrong credentials", async () => {
    const response = await request
      .default(app)
      .post("/signin")
      .send({ email: "mat@mail.com", password: "matheus123" });

    expect(response.status).toBe(401);
  });
});

describe("Should test find all users endpoint", () => {
  it("should find all users", async () => {
    const response = await request
      .default(app)
      .get("/users")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });
});

describe("Should test find user by id endpoint", () => {
  it("should return created user by id", async () => {
    const response = await request
      .default(app)
      .get(`/users/id/${id}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(id);
  });

  it("should throw not found when user doesnt exist", async () => {
    const response = await request
      .default(app)
      .get(`/users/id/0`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(404);
  });
});

describe("Should test update user endpoint", () => {
  it("should update user with valid credentals", async () => {
    const response = await request
      .default(app)
      .patch(`/users/id/${id}`)
      .send({ name: "Matheus Updated Name" })
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(id);
    expect(response.body.name).toBe("Matheus Updated Name");
  });

  it("should throw not found when updating user with unexistant id", async () => {
    const response = await request
      .default(app)
      .put(`/users/id/0`)
      .send({ name: "Matheus Teste" })
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(404);
  });
});

describe("Should test delete user endpoint", () => {
  it("should throw not found when deleting user unexistant id", async () => {
    const response = await request
      .default(app)
      .delete(`/users/id/0`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(404);
  });

  it("should delete created user", async () => {
    const response = await request
      .default(app)
      .delete(`/users/id/${id}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(204);
  });
});
