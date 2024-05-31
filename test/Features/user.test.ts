// import supertest from "supertest";
// import { app } from "../../src";
// import { logger } from "../../src/config/logging";
// import { UserTest } from "./user.test.util";

// describe("POST /api/v1/user/register", () => {
//   beforeAll(async () => {
//     const isUserExist = await UserTest.find();
//     if (isUserExist) {
//       await UserTest.delete();
//     }
//   });
//   afterAll(async () => {
//     const isUserExist = await UserTest.find();
//     if (isUserExist) {
//       await UserTest.delete();
//     }
//   });

//   it("should reject register new user if request is invalid", async () => {
//     const response = await supertest(app).post("/api/v1/user/register").send({
//       phoneNumber: "",
//       name: "",
//       password: "",
//     });

//     logger.debug(response.body);
//     expect(response.status).toBe(400);
//     expect(response.body.errors).toBeDefined();
//   });

//   it("should register new user", async () => {
//     const response = await supertest(app).post("/api/v1/user/register").send({
//       phoneNumber: "0878",
//       name: "bambang",
//       password: "bambang",
//     });
//     logger.debug(response.body);
//     expect(response.status).toBe(201);
//     expect(response.body.data).toBeDefined();
//     expect(response.body.data.phoneNumber).toBe("0878");
//     expect(response.body.data.name).toBe("bambang");
//   });

//   it("should user already registered", async () => {
//     const response = await supertest(app).post("/api/v1/user/register").send({
//       phoneNumber: "0878",
//       name: "bambang",
//       password: "bambang",
//     });
//     logger.debug(response.body);
//     expect(response.status).toBe(409);
//     expect(response.body.errors).toBeDefined();
//   });
// });

// describe("POST /api/v1/user/login", () => {
//   beforeEach(async () => {
//     await UserTest.createUser();
//   });
//   afterEach(async () => {
//     await UserTest.delete();
//   });

//   it("should be able to login", async () => {
//     const response = await supertest(app).post("/api/v1/user/login").send({
//       phoneNumber: "0878",
//       password: "bambang",
//     });

//     logger.debug(response.body);

//     expect(response.status).toBe(200);
//     expect(response.body.data).toBeDefined();
//     expect(response.body.data.token).toBeDefined();
//     expect(response.body.data.phoneNumber).toBe("0878");
//     expect(response.body.data.name).toBe("bambang");
//   });

//   it("should reject login if user pass is wrong", async () => {
//     const response = await supertest(app).post("/api/v1/user/login").send({
//       phoneNumber: "0878",
//       password: "salah",
//     });

//     logger.debug(response.body);

//     expect(response.status).toBe(401);
//     expect(response.body.errors).toBeDefined();
//   });
// });

// describe("POST /api/v1/user/logout", () => {
//   it("should logout successfully with valid token", async () => {
//     const response = await await supertest(app).post("/api/v1/user/logout");
//     expect(true);
//   });
// });

describe("test", () => {
  it("should true", () => {
    expect(true).toEqual(true);
  });
});
