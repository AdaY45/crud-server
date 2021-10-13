const request = require("supertest");
const app = require("../server");

describe("Dashboard Endpoints", () => {
  let token;

  it("should login", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "admin@gmail.com",
      password: "admin1*",
    });
    token = res.body.token;
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("user");
  });

  it("should get dashboard data", async () => {
    const res = await request(app)
      .get("/api/dashboard/")
      .set("authorization", `Bearer ${token}`);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("usersCount");
  });
});
