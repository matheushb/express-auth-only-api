import * as request from "supertest";
import app from "../src/app";
import {
  CategoryEntity,
  Color,
} from "../src/category/entities/category.entity";
import { seed, unseed } from "./seeds/category.seed";

let category: CategoryEntity[];
let accessToken: string;
let id: string;
let categoryId: string;

beforeAll(async () => {
  category = await seed(120);

  const response = await request.default(app).post("/signup").send({
    name: "Matheus Teste",
    email: "matheus123@mail.com",
    password: "matheus123",
    weight: 80,
  });

  id = response.body.user.id;
  accessToken = response.body.access_token;
});

afterAll(async () => {
  await request
    .default(app)
    .delete(`/users/id/${id}`)
    .set("Authorization", `Bearer ${accessToken}`);

  await request
    .default(app)
    .delete(`/category/id/${categoryId}`)
    .set("Authorization", `Bearer ${accessToken}`);

  await unseed(category);
});

describe("Should test category endpoints", () => {
  it("should get all category", async () => {
    const response = await request
      .default(app)
      .get("/category")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it("should create a new category with valid credentials", async () => {
    const newCategory = {
      name: "New Category",
      color: Color.BLUE,
    };

    const response = await request
      .default(app)
      .post("/category")
      .send(newCategory)
      .set("Authorization", `Bearer ${accessToken}`);

    category.push(response.body);

    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
    expect(response.body.name).toBe(newCategory.name);
    expect(response.body.color).toBe(newCategory.color);
  });

  it("should throw bad request when creating category with missing required fields", async () => {
    const response = await request
      .default(app)
      .post("/category")
      .send({ color: Color.GREEN })
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(400);
  });

  it("should throw bad request when creating category with invalid color", async () => {
    const response = await request
      .default(app)
      .post("/category")
      .send({ name: "Invalid Category", color: "INVALID_COLOR" })
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(400);
  });

  it("should get a category by ID", async () => {
    const categoryId = category[0].id;
    const response = await request
      .default(app)
      .get(`/category/id/${categoryId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(categoryId);
  });

  it("should update a category with valid credentials", async () => {
    const categoryId = category[1].id;
    const updatedCategory = {
      name: "Updated Category Name",
      color: Color.PINK,
    };

    const response = await request
      .default(app)
      .patch(`/category/id/${categoryId}`)
      .send(updatedCategory)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(categoryId);
    expect(response.body.name).toBe(updatedCategory.name);
    expect(response.body.color).toBe(updatedCategory.color);
  });

  it("should throw not found when updating category with unexistent id", async () => {
    const response = await request
      .default(app)
      .patch(`/category/id/0`)
      .send({ name: "Updated Name" })
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(404);
  });

  it("should delete a category by ID", async () => {
    const categoryId = category[2].id;
    const response = await request
      .default(app)
      .delete(`/category/id/${categoryId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(204);
  });

  it("should throw not found when deleting category with unexistent id", async () => {
    const response = await request
      .default(app)
      .delete(`/category/id/0`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(404);
  });
});
