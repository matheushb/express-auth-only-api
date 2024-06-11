import { Prisma, PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { v4 } from "uuid";
import { UserEntity } from "../../src/user/entities/user.entity";

const prisma = new PrismaClient();

const getRandomUser = async () => {
  return {
    id: v4(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 10 }),
    weight: Math.floor(Math.random() * 300) + 30,
  };
};

export async function seed(numberOfUsers: number = 3): Promise<UserEntity[]> {
  const addedUsers: any[] = [];

  for (let x = 0; x < numberOfUsers; x++) {
    const userPayload = await getRandomUser();
    addedUsers.push(await prisma.user.create({ data: userPayload }));
  }
  return await Promise.all(addedUsers);
}

export async function unseed(users: UserEntity[]) {
  const ids = users.map((user) => user.id);
  await prisma.user.deleteMany({ where: { id: { in: ids } } });
}
