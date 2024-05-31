// import { prismaClient } from "../../src/config/database";
// import bcrypt from "bcrypt";
// import jwt, { Secret } from "jsonwebtoken";
// export class UserTest {
//   static async find() {
//     const isExist = await prismaClient.user.findUnique({
//       where: {
//         phoneNumber: "0878",
//       },
//     });

//     if (isExist) return true;
//     else false;
//   }
//   static async delete() {
//     await prismaClient.user.delete({
//       where: {
//         phoneNumber: "0878",
//       },
//     });
//   }

//   static async createUser() {
//     const password = await bcrypt.hash("bambang", 10);
//     await prismaClient.user.create({
//       data: {
//         phoneNumber: "0878",
//         name: "bambang",
//         password: password,
//       },
//     });
//   }

//   static async loginUser() {
//     const SECRET_KEY: Secret = "anjay secret";
//     let user = await prismaClient.user.findUnique({
//       where: {
//         phoneNumber: "0878",
//       },
//     });
//     const token = jwt.sign(
//       {
//         _id: user?.id,
//         name: user?.name,
//         phoneNumber: user?.phoneNumber,
//       },
//       SECRET_KEY,
//       {
//         expiresIn: "36000",
//       }
//     );
//     user = await prismaClient.user.update({
//       where: { id: user?.id },
//       data: {
//         token: token,
//       },
//     });

//     return user.token;
//   }
// }
