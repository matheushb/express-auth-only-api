import { Prisma, PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import * as bcrypt from "bcrypt";
import { v4 } from "uuid";
import { TaskEntity } from "../../src/task/entities/task.entity";
import { Priority, Status } from "../../src/task/entities/task.entity";

const prisma = new PrismaClient();
const userPayload = {
  name: "Matheus Teste",
  email: "guahseeuasheu@gmail.com",
  password: bcrypt.hashSync("teste123", 10),
  weight: Math.floor(Math.random() * 300) + 30,
};

const getRandomtask = async (id: string) => {
  return {
    id: v4(),
    title: faker.lorem.sentence({ max: 10, min: 2 }),
    description: faker.lorem.sentence({ max: 10, min: 2 }),
    user: {
      connect: {
        id,
      },
    },
    status:
      Math.floor(Math.random() * 3) == 1
        ? Status.DONE
        : Math.floor(Math.random() * 3) == 2
        ? Status.DOING
        : Status.PENDING,
    conclusion: Math.floor(Math.random() * 2) == 1 ? new Date() : null,
    priority:
      Math.floor(Math.random() * 3) == 1
        ? Priority.HIGH
        : Math.floor(Math.random() * 3) == 2
        ? Priority.MEDIUM
        : Priority.LOW,
  } as Prisma.TaskCreateInput;
};

export async function seed(numberOftasks: number = 3): Promise<TaskEntity[]> {
  const addedtasks: any[] = [];
  const user = await prisma.user.create({ data: userPayload });

  for (let x = 0; x < numberOftasks; x++) {
    const taskPayload = await getRandomtask(user.id);
    addedtasks.push(await prisma.task.create({ data: taskPayload }));
  }
  return await Promise.all(addedtasks);
}

export async function unseed(tasks: TaskEntity[]) {
  const ids = tasks.map((task) => task.id);
  await prisma.user.delete({ where: { id: tasks[0].user_id } });
  await prisma.task.deleteMany({ where: { id: { in: ids } } });
}
