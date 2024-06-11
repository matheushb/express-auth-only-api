import { CreateUserDto, createUserDto } from "./create-user.dto";

export interface UpdateUserDto extends Partial<CreateUserDto> {}

export const updateUserDto = {
  name: {
    minLength: 1,
    maxLength: 4,
  },
  password: {
    minLength: 1,
    maxLength: 4,
  },
};
