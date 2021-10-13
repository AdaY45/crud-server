const request = require("supertest");
const app = require("../server");

describe("User Endpoints", () => {
  let id;
  let token;
  //   afterAll(async () => {
  //     await request(app)
  //       .delete("/api/users/delete")
  //       .set("authorization", `Bearer ${token}`)
  //       .send({ userId: id });
  //   });
  it("should login as admin", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "admin@gmail.com",
      password: "admin1*",
    });
    token = res.body.token;
    id = res.body.user._id;
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("user");
  });

  it("should get user by userId", async () => {
    const res = await request(app)
      .get(`/api/users/${id}`)
      .set("authorization", `Bearer ${token}`);

    expect(res.statusCode).toEqual(201);
  });

  it("should fail getting user by userId", async () => {
    const res = await request(app)
      .get(`/api/users/615559cf21d8c861`)
      .set("authorization", `Bearer ${token}`);

    expect(res.statusCode).toEqual(500);
  });

  it("should get all users", async () => {
    const res = await request(app)
      .get("/api/profiles/")
      .set("authorization", `Bearer ${token}`);

    expect(res.statusCode).toEqual(201);
  });

//   it("should create new profile", async () => {
//     const res = await request(app)
//       .post("/api/profiles/create")
//       .set("authorization", `Bearer ${token}`)
//       .send({
//         name: "testProf",
//         gender: "female",
//         birthdate: new Date(2021, 9, 12),
//         city: "Kyiv",
//         owner: id,
//       });
//     profId = res.body._id;

//     expect(res.statusCode).toEqual(201);
//   });

  it("should edit exsisting user", async () => {
    const res = await request(app)
      .patch("/api/users/edit")
      .set("authorization", `Bearer ${token}`)
      .send({
        _id: "61555467463789042d68ed18",
        username: "ada",
        email: "ada@gmail.com",
        type: "user"
      });

    expect(res.statusCode).toEqual(201);
  });

  it("should fail editing exsisting user because of wrong id", async () => {
    const res = await request(app)
      .patch("/api/users/edit")
      .set("authorization", `Bearer ${token}`)
      .send({
        _id: null,
        username: "ada",
        email: "ada@gmail.com",
        type: "user"
      });

    expect(res.statusCode).toEqual(404);
  });

  it("should fail deleting the user", async () => {
    const res = await request(app)
      .delete("/api/users/delete")
      .set("authorization", `Bearer ${token}`)
      .send({
        userId: "61555c2f954",
      });

    expect(res.statusCode).toEqual(500);
  });

  it("should login as user", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "user100@gmail.com",
      password: "user100*",
    });
    token = res.body.token;
    id = res.body.user._id;
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("user");
  });

  it("should fail editing exsisting user because of denied permission", async () => {
    const res = await request(app)
      .patch("/api/users/edit")
      .set("authorization", `Bearer ${token}`)
      .send({
        _id: "",
        username: "ada",
        email: "ada@gmail.com",
        type: "user"
      });

    expect(res.statusCode).toEqual(403);
  });

  it("should fail deleting the user", async () => {
    const res = await request(app)
      .delete("/api/users/delete")
      .set("authorization", `Bearer ${token}`)
      .send({
        userId: "61555c2f954d7136b888d993",
      });

    expect(res.statusCode).toEqual(403);
  });

//   it("should delete the user", async () => {
//     const res = await request(app)
//       .delete("/api/users/delete")
//       .set("authorization", `Bearer ${token}`)
//       .send({
//         userId: "61555c2f954d7136b885d993",
//       });

//     expect(res.statusCode).toEqual(201);
//   });
});
