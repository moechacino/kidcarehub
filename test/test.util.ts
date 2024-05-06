import { prismaClient } from "../src/config/database";
import bcrypt from "bcrypt";
export class UserTest {
  static async find() {
    const isExist = await prismaClient.user.findUnique({
      where: {
        phoneNumber: "0878",
      },
    });

    if (isExist) return true;
    else false;
  }
  static async delete() {
    await prismaClient.user.delete({
      where: {
        phoneNumber: "0878",
      },
    });
  }

  static async createUser() {
    const password = await bcrypt.hash("bambang", 10);
    await prismaClient.user.create({
      data: {
        phoneNumber: "0878",
        name: "bambang",
        password: password,
      },
    });
  }
}
