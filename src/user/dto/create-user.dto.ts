export interface CreateUserDto {
  name: string;
  password: string;
}

export const createUserDto = {
  name: {
    required: "user is required",
    minLength: 1,
    maxLength: 4,
  },
  password: {
    required: "password is required",
    minLength: 1,
    maxLength: 4,
  },
};
