import { Admin } from "@prisma/client";

export type LoginAdminRequest = {
  username: string;
  password: string;
};

export type AdminResponse = {
  id: number;
  username: string;
  password: string;
  token?: string | null;
};

export function toAdminResponse(admin: Admin): AdminResponse {
  return {
    id: admin.id,
    username: admin.username,
    password: admin.password,
    token: admin.token,
  };
}
