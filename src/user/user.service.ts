import { BadRequestException } from "../common/exception/types/bad-request.exception";
import { ConflictException } from "../common/exception/types/conflict.exception";
import { NotFoundException } from "../common/exception/types/not-found.exception";
import { mergeObjects } from "../common/utils/merge-objects";
import { CreateUserDto, UpdateUserDto } from "./dto";
import { UserRepository } from "./user.repository";
import * as bcrypt from "bcrypt";

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto) {
    const userExists = await this.findByName(createUserDto.name);

    if (!!userExists) {
      throw new ConflictException("User already exists with this email");
    }

    createUserDto.password = bcrypt.hashSync(createUserDto.password, 10);
    const user = await this.userRepository.create(createUserDto);

    return user;
  }

  async findAll() {
    const users = await this.userRepository.findAll();
    return users;
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne(id);
    if (!user) throw new NotFoundException(`Unable to find user with id ${id}`);
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.update(id, updateUserDto);
    return user;
  }

  async remove(id: string) {
    await this.userRepository.remove(id);
  }

  async findByName(email: string) {
    const user = await this.userRepository.findByName(email);
    return user;
  }
}
