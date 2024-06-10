import { User } from "@prisma/client";

export type CreateUserRequest = {
  phoneNumber: string;
  name: string;
  password: string;
};

export type ChangePasswordUserRequest = {
  password: string;
  newPassword: string;
};

export type UserResponse = {
  id: number;
  phoneNumber: string;
  name: string;
  token?: string | null;
};

export type LoginUserRequest = {
  phoneNumber: string;
  password: string;
};

export function toUserResponse(user: User): UserResponse {
  return {
    name: user.name,
    phoneNumber: user.phoneNumber,
    id: user.id,
  };
}
