// model Writer {
//   id        Int       @id @unique @default(autoincrement())
//   name      String    @db.VarChar(100)
//   phone     String    @unique @db.VarChar(20)
//   email     String    @unique @db.VarChar(100)
//   username  String    @unique @db.VarChar(50)
//   password  String    @db.VarChar(100)
//   token     String?   @db.VarChar(300)
//   articles  Article[]
//   createdAt DateTime  @default(now()) @db.Timestamp(0)
//   updatedAt DateTime  @updatedAt @db.Timestamp(0)

//   @@map("writer")
// }

import { Writer } from "@prisma/client";

export type CreateWriterRequest = {
  name: string;
  phone: string;
  email: string;
  username: string;
  password: string;
};

export type ChangePasswordWriterRequest = {
  password: string;
  newPassword: string;
};

export type WriterResponse = {
  id: number;
  name: string;
  phone: string;
  email: string;
  username: string;
  token?: string | null;
};

export type LoginWriterRequest = {
  username: string;
  password: string;
};

export function toWriterResponse(writer: Writer): WriterResponse {
  return {
    id: writer.id,
    name: writer.name,
    phone: writer.phone,
    email: writer.email,
    username: writer.username,
  };
}
