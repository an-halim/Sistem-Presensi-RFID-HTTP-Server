import supertest from "supertest";
const baseURL = "http://localhost:3000/api";

const getTenNumber = (length) => {
  const number = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
  let result = "";
  for (let i = 0; i < length; i++) {
    result += number[Math.floor(Math.random() * number.length)];
  }
  return result;
};

const validNumber = "62856478474" + getTenNumber(2);
const randomString = (length) => {
  const string =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += string[Math.floor(Math.random() * string.length)];
  }
  return result;
};

const body = {
  name: randomString(10),
  username: randomString(5),
  phone: getTenNumber(10),
  password: "false",
};

const validBody = {
  name: randomString(10),
  username: randomString(5),
  phone: "6281211453163",
  password: "false",
  apiKey: "5b313697-2bf3-4e94-9b70-348897b1bc0c",
  rfID: "aksmdaksdasa",
};

describe("POST /login", () => {
  it("should return 200", async () => {
    const loginBody = {
      email: "Sudirma@gmail.com",
      password: "oke",
    };
    const response = await supertest(baseURL).post("/login").send(loginBody);
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Success");
    global.responseBody = response.body;
  });
  it("should return 404 due invalid user", async () => {
    const response = await supertest(baseURL)
      .post("/login")
      .send({ email: "asasdas@gmail.com", password: "oke" });
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("User not found");
  });
});

describe("GET /detail", () => {
  it("should return 200", async () => {
    const response = await supertest(baseURL)
      .get("/detail")
      .set({
        Authorization: `Bearer ${global.responseBody.data.token}`,
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Success");
  });
  it("should return 401 due Unauthorized user", async () => {
    const response = await supertest(baseURL).get("/detail");
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("Unauthorized");
  });
});

// user
describe("GET /user", () => {
  it("should return 200", async () => {
    const response = await supertest(baseURL)
      .get("/user")
      .set({
        Authorization: `Bearer ${global.responseBody.data.token}`,
      });
    global.delete = response.body.data[0];
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Success");
  });
  it("should return 401 due Unauthorized user", async () => {
    const response = await supertest(baseURL).get("/user");
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("Unauthorized");
  });
});

describe("POST /user", () => {
  it("should return 201", async () => {
    const response = await supertest(baseURL)
      .post("/user")
      .set({
        Authorization: `Bearer ${global.responseBody.data.token}`,
      })
      .send({
        rfID: "alsdnjkasabd76asdvbashdbaa" + randomString(5),
        name: "Sudirma",
        email: randomString(5) + "audiramaa@gmail.com",
        password: "oke",
        roles: "pegawai",
        role: "admin",
      });
    global.data = response.body.data;

    expect(response.body.message).toBe("Success");
    expect(response.statusCode).toBe(201);
  });
  it("should return 401 due Unauthorized user", async () => {
    const response = await supertest(baseURL).get("/user");
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("Unauthorized");
  });
});

describe("PUT /user", () => {
  it("should return 200", async () => {
    let body = {
      rfID: global.data.rfID,
      name: "Sudirman",
    };
    const response = await supertest(baseURL)
      .put("/user")
      .set({
        Authorization: `Bearer ${global.responseBody.data.token}`,
      })
      .send(body);
    expect(response.body.message).toBe("Success");
    expect(response.statusCode).toBe(200);
  });

  it("should return 400 due invalid body", async () => {
    let body = {
      id: getTenNumber(),
    };
    const response = await supertest(baseURL)
      .put("/user")
      .set({
        Authorization: `Bearer ${global.responseBody.data.token}`,
      })
      .send(body);
    expect(response.body.message).toBe("Please fill all the required fields");
    expect(response.statusCode).toBe(400);
  });
  it("should return 401 due Unauthorized user", async () => {
    let body = {
      rfID: global.data.rfID,
    };
    const response = await supertest(baseURL).put("/user").send(body);
    expect(response.body.message).toBe("Unauthorized");
    expect(response.statusCode).toBe(401);
  });
});

describe("DELETE /user", () => {
  it("should return 200", async () => {
    let body = {
      rfID: global.delete.rfID,
    };
    const response = await supertest(baseURL)
      .delete("/user")
      .set({
        Authorization: `Bearer ${global.responseBody.data.token}`,
      })

      .send(body);
    expect(response.body.message).toBe("Success");
    expect(response.statusCode).toBe(200);
  });

  it("should return 400 due invalid body", async () => {
    let body = {
      rfID: randomString(5),
    };
    const response = await supertest(baseURL)
      .delete("/user")
      .set({
        Authorization: `Bearer ${global.responseBody.data.token}`,
      })
      .send(body);
    expect(response.body.message).toBe("Failed");
    expect(response.statusCode).toBe(400);
  });

  it("should return 401 due Unauthorized user", async () => {
    let body = {
      rfID: global.data.rfID,
    };
    const response = await supertest(baseURL).put("/hour").send(body);
    expect(response.body.message).toBe("Unauthorized");
    expect(response.statusCode).toBe(401);
  });
});

// hours
describe("GET /hour", () => {
  it("should return 200", async () => {
    const response = await supertest(baseURL).get("/hour");
    global.id = response.body.data[0].id;
    expect(response.body.message).toBe("Success");
    expect(response.statusCode).toBe(200);
  });
});

describe("POST /hour", () => {
  it("should return 201", async () => {
    let body = {
      tipe: "masuk",
      hour: "08:00:00",
      roles: "pegawai",
    };
    const response = await supertest(baseURL)
      .post("/hour")
      .set({
        Authorization: `Bearer ${global.responseBody.data.token}`,
      })
      .send(body);
    expect(response.body.message).toBe("Success");
    expect(response.statusCode).toBe(201);
  });

  it("should return 400 due invalid body", async () => {
    let body = {
      tipe: "masuk",
      hour: "08:00",
      roles: "pegawai",
    };
    const response = await supertest(baseURL)
      .post("/hour")
      .set({
        Authorization: `Bearer ${global.responseBody.data.token}`,
      })
      .send(body);
    expect(response.body.message).toBe("Failed");
    expect(response.statusCode).toBe(400);
  });
  it("should return 401 due Unauthorized user", async () => {
    let body = {
      tipe: "masuk",
      hour: "08:00",
      roles: "pegawai",
    };
    const response = await supertest(baseURL).post("/hour").send(body);
    expect(response.body.message).toBe("Unauthorized");
    expect(response.statusCode).toBe(401);
  });
});

describe("PUT /hour", () => {
  it("should return 200", async () => {
    let body = {
      id: global.id,
      tipe: "masuk",
      hour: "08:00:00",
      roles: "pegawai",
    };
    const response = await supertest(baseURL)
      .put("/hour")
      .set({
        Authorization: `Bearer ${global.responseBody.data.token}`,
      })
      .send(body);
    expect(response.body.message).toBe("Success");
    expect(response.statusCode).toBe(200);
  });

  it("should return 400 due invalid body", async () => {
    let body = {
      id: getTenNumber(),
    };
    const response = await supertest(baseURL)
      .put("/hour")
      .set({
        Authorization: `Bearer ${global.responseBody.data.token}`,
      })
      .send(body);
    expect(response.body.message).toBe(
      "Please fill all the required fields with valid format"
    );
    expect(response.statusCode).toBe(400);
  });
  it("should return 401 due Unauthorized user", async () => {
    let body = {
      id: 1,
    };
    const response = await supertest(baseURL).put("/hour").send(body);
    expect(response.body.message).toBe("Unauthorized");
    expect(response.statusCode).toBe(401);
  });
});

describe("DELETE /hour", () => {
  it("should return 200", async () => {
    let body = {
      id: global.id,
    };
    const response = await supertest(baseURL)
      .delete("/hour")
      .set({
        Authorization: `Bearer ${global.responseBody.data.token}`,
      })

      .send(body);
    expect(response.body.message).toBe("Success");
    expect(response.statusCode).toBe(200);
  });

  it("should return 400 due invalid body", async () => {
    let body = {
      id: 1000,
    };
    const response = await supertest(baseURL)
      .delete("/hour")
      .set({
        Authorization: `Bearer ${global.responseBody.data.token}`,
      })
      .send(body);
    expect(response.body.message).toBe("Failed");
    expect(response.statusCode).toBe(400);
  });

  it("should return 401 due Unauthorized user", async () => {
    let body = {
      id: 1,
    };
    const response = await supertest(baseURL).put("/hour").send(body);
    expect(response.body.message).toBe("Unauthorized");
    expect(response.statusCode).toBe(401);
  });
});

// presensi
describe("GET /presensi/do", () => {
  it("should return 201", async () => {
    const response = await supertest(baseURL).get(
      `/presensi/do?apiKey=${global.data.apiKey}&rfID=${global.data.rfID}&tipe=1`
    );
    expect(response.statusCode).toBe(201);
    // // expect body document
    expect(response.text).toBe("Success");
  });
  it("should return 404 due invalid user", async () => {
    const response = await supertest(baseURL).get(
      `/presensi/do?apiKey=${global.data.apiKey}&rfID=${
        global.data.rfID + "asdasd"
      }&tipe=1`
    );
    expect(response.statusCode).toBe(404);
    expect(response.text).toBe("User not found");
  });
  it("should return 401 due Unauthorized user", async () => {
    const response = await supertest(baseURL).get(
      `/presensi/do?apiKey=${global.data.apiKey + "asdasd"}&rfID=${
        global.data.rfID
      }&tipe=1`
    );
    expect(response.statusCode).toBe(401);
    expect(response.text).toBe("Unauthorized");
  });
  it("should return 400 due invalid tipe", async () => {
    const response = await supertest(baseURL).get(
      `/presensi/do?apiKey=${global.data.apiKey}&rfID=${
        global.data.rfID
      }&tipe=394865920364724`
    );
    expect(response.statusCode).toBe(400);
    expect(response.text).toBe("Tipe not found");
  });
});

describe("GET /presensi", () => {
  it("should return 200", async () => {
    const response = await supertest(baseURL)
      .get("/presensi")
      .set({
        Authorization: `Bearer ${global.responseBody.data.token}`,
      });
    global.presensiID = response.body.data[0].id;
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Success");
  });
  it("should return 401 due unauthorized user", async () => {
    const response = await supertest(baseURL).get("/presensi");
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("Unauthorized");
  });
});

describe("PUT /presensi", () => {
  it("should return 200", async () => {
    let body = {
      id: global.presensiID,
      status: "tepat",
    };
    const response = await supertest(baseURL)
      .put("/presensi")
      .set({
        Authorization: `Bearer ${global.responseBody.data.token}`,
      })
      .send(body);
    expect(response.body.message).toBe("Success");
    expect(response.statusCode).toBe(200);
  });

  it("should return 400 due invalid body", async () => {
    let body = {
      id: getTenNumber(),
    };
    const response = await supertest(baseURL)
      .put("/presensi")
      .set({
        Authorization: `Bearer ${global.responseBody.data.token}`,
      })
      .send(body);
    expect(response.body.message).toBe("Please fill all the required fields");
    expect(response.statusCode).toBe(400);
  });
  it("should return 401 due Unauthorized user", async () => {
    let body = {
      id: 1,
    };
    const response = await supertest(baseURL).put("/presensi").send(body);
    expect(response.body.message).toBe("Unauthorized");
    expect(response.statusCode).toBe(401);
  });
});

describe("DELETE /presensi", () => {
  it("should return 200", async () => {
    let body = {
      id: global.presensiID,
    };
    const response = await supertest(baseURL)
      .delete("/presensi")
      .set({
        Authorization: `Bearer ${global.responseBody.data.token}`,
      })

      .send(body);
    expect(response.body.message).toBe("Success");
    expect(response.statusCode).toBe(200);
  });

  it("should return 400 due invalid body", async () => {
    let body = {
      id: 1000,
    };
    const response = await supertest(baseURL)
      .delete("/presensi")
      .set({
        Authorization: `Bearer ${global.responseBody.data.token}`,
      })
      .send(body);
    expect(response.body.message).toBe("Failed");
    expect(response.statusCode).toBe(400);
  });

  it("should return 401 due Unauthorized user", async () => {
    let body = {
      id: 1,
    };
    const response = await supertest(baseURL).put("/presensi").send(body);
    expect(response.body.message).toBe("Unauthorized");
    expect(response.statusCode).toBe(401);
  });
});
