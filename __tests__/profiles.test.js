const request = require("supertest");
const app = require("../server");

describe("Profiles Endpoints", () => {
  let id;
  let profId;
  let token;
  //   afterAll(async () => {
  //     await request(app)
  //       .delete("/api/users/delete")
  //       .set("authorization", `Bearer ${token}`)
  //       .send({ userId: id });
  //   });
  it("should login", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "admin@gmail.com",
      password: "admin1*",
    });
    token = res.body.token;
    id = res.body._id;
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("user");
  });

  it("should get profiles by userId", async () => {
    const res = await request(app)
      .get("/api/profiles/615559cf21d8c861693cf3f4")
      .set("authorization", `Bearer ${token}`);

    expect(res.statusCode).toEqual(201);
  });

  it("should get all profiles", async () => {
    const res = await request(app)
      .get("/api/profiles/")
      .set("authorization", `Bearer ${token}`);

    expect(res.statusCode).toEqual(201);
  });

  it("should create new profile", async () => {
    const res = await request(app)
      .post("/api/profiles/create")
      .set("authorization", `Bearer ${token}`)
      .send({
        name: "testProf",
        gender: "female",
        birthdate: new Date(2021, 9, 12),
        city: "Kyiv",
        owner: id,
      });
    profId = res.body._id;

    expect(res.statusCode).toEqual(201);
  });

  it("should edit exsisting profile", async () => {
    const res = await request(app)
      .patch("/api/profiles/edit")
      .set("authorization", `Bearer ${token}`)
      .send({
        _id: profId,
        name: "testProf1",
        gender: "female",
        birthdate: new Date(2021, 9, 12),
        city: "Kyiv",
        owner: id,
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("message");
  });

//   it("should fail editing exsisting profile because profile doesnt exist", async () => {
//     const res = await request(app)
//       .patch("/api/profiles/edit")
//       .set("authorization", `Bearer ${token}`)
//       .send({
//         _id: "not-valid",
//         name: "testProf1",
//         gender: "female",
//         birthdate: new Date(2021, 9, 12),
//         city: "Kyiv",
//         owner: id,
//       });

//     expect(res.statusCode).toEqual(400);
//     expect(res.body).toHaveProperty("errors");
//   });

//   it("should fail editing exsisting profile because profile is not users", async () => {
//     const res = await request(app)
//       .patch("/api/profiles/edit")
//       .set("authorization", `Bearer ${token}`)
//       .send({
//         _id: profId,
//         name: "testProf1",
//         gender: "female",
//         birthdate: new Date(2021, 9, 12),
//         city: "Kyiv",
//         owner: "not-valid",
//       });

//     expect(res.statusCode).toEqual(400);
//     expect(res.body).toHaveProperty("errors");
//   });

  it("should delete the profile", async () => {
    const res = await request(app)
      .delete("/api/profiles/delete")
      .set("authorization", `Bearer ${token}`)
      .send({
        _id: profId,
      });

    expect(res.statusCode).toEqual(201);
  });
});
