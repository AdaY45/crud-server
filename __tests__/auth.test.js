const request = require("supertest");
const app = require("../server");

describe("Auth Endpoints", () => {
  let id;
  let token;
  afterAll(async () => {
    await request(app)
      .delete("/api/users/delete")
      .set("authorization", `Bearer ${token}`)
      .send({ userId: id });
  });
  it("should register", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "adminTest@gmail.com",
      password: "1234567*",
      type: "admin",
      username: "adminTest",
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("user");
  });

  it("should fail when trying to register as already exsisting user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "adminTest@gmail.com",
      password: "1234567*",
      type: "admin",
      username: "adminTest",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("errors");
  });

  it("should login", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "adminTest@gmail.com",
      password: "1234567*",
    });
    token = res.body.token;
    id = res.body.user._id;
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("user");
  });

  it("should login and fail because of non-existing credentials", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "false@gmail.com",
      password: "1234567*",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("errors");
  });

  it("should login and fail because of wrong password", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "adminTest@gmail.com",
      password: "123456rty*",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("errors");
  });

  it("should create new token", async () => {
    const res = await request(app)
      .get("/api/auth/newToken")
      .set("authorization", `Bearer ${token}`);
    token = res.body.token;

    console.log("new token " + token);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("token");
  });

  it("should fail creating new token", async () => {
    const res = await request(app)
      .get("/api/auth/newToken")
      .set("authorization", `Bearer test`);

    expect(res.statusCode).toEqual(403);
  });
});
