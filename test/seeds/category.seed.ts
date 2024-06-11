import { Prisma, PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { v4 } from "uuid";
import {
  CategoryEntity,
  Color,
} from "../../src/category/entities/category.entity";

const prisma = new PrismaClient();

const getRandomCategory = async () => {
  return {
    id: v4(),
    name: faker.commerce.productName(),
    color:
      Object.values(Color)[
        Math.floor(Math.random() * Object.values(Color).length)
      ],
  };
};

export async function seed(
  numberOfCategories: number = 3,
): Promise<CategoryEntity[]> {
  const addedCategories: any[] = [];

  for (let x = 0; x < numberOfCategories; x++) {
    const categoryPayload = await getRandomCategory();
    addedCategories.push(
      await prisma.category.create({ data: categoryPayload }),
    );
  }
  return await Promise.all(addedCategories);
}

export async function unseed(categories: CategoryEntity[]) {
  const ids = categories.map((category) => category.id);
  await prisma.category.deleteMany({ where: { id: { in: ids } } });
}
