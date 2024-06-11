import { Prisma, PrismaClient } from "@prisma/client";
import { CreateUserDto, UpdateUserDto } from "./dto";

const prisma = new PrismaClient();

const USER_SELECT_FIELDS = {
  id: true,
  name: true,
  createdAt: true,
  updatedAt: true,
} as Prisma.UserSelect;

export class UserRepository {
  async create(createUserDto: CreateUserDto) {
    return prisma.user.create({
      data: { ...createUserDto },
      select: USER_SELECT_FIELDS,
    });
  }

  async findAll() {
    return prisma.user.findMany({
      select: USER_SELECT_FIELDS,
    });
  }

  async findOne(id: string) {
    return prisma.user.findUnique({
      where: {
        id,
      },
      select: USER_SELECT_FIELDS,
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return prisma.user.update({
      where: {
        id,
      },
      data: {
        ...updateUserDto,
      },
      select: USER_SELECT_FIELDS,
    });
  }

  async remove(id: string) {
    return prisma.user.delete({
      where: {
        id,
      },
      select: USER_SELECT_FIELDS,
    });
  }

  async findByName(name: string) {
    return prisma.user.findUnique({
      where: {
        name,
      },
      select: {
        id: true,
        name: true,
        password: true,
      },
    });
  }
}
