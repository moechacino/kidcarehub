import { User } from "@prisma/client";

export type CreateUserRequest = {
  phone: string;
  name: string;
  password: string;
};

export type ChangePasswordUserRequest = {
  password: string;
  newPassword: string;
};

export type UserResponse = {
  id: number;
  phone: string;
  name: string;
  token?: string | null;
};

export type LoginUserRequest = {
  phone: string;
  password: string;
};

export function toUserResponse(user: User): UserResponse {
  return {
    name: user.name,
    phone: user.phone,
    id: user.id,
  };
}
