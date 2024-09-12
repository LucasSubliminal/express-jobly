const request = require("supertest");
const app = require("../app");  // Assuming app is where your express instance is created
const Job = require("../models/job");
const { ensureAdmin } = require("../middleware/auth");

// Mock the Job model
jest.mock("../models/job");

// Mock the ensureAdmin middleware for protected routes
jest.mock("../middleware/auth", () => ({
  ensureAdmin: jest.fn((req, res, next) => next())
}));

describe("POST /jobs", () => {
  const newJob = {
    title: "Test Job",
    salary: 50000,
    equity: "0.05",
    companyHandle: "test-company"
  };

  test("admin can create job", async () => {
    Job.create.mockResolvedValue({ id: 1, ...newJob });

    const response = await request(app)
      .post("/jobs")
      .send(newJob)
      .set("authorization", `Bearer admin-token`); // Mock token

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      job: { id: 1, ...newJob }
    });
  });

  test("invalid data returns error", async () => {
    const response = await request(app)
      .post("/jobs")
      .send({ title: "Test Job" }) // missing fields
      .set("authorization", `Bearer admin-token`);

    expect(response.statusCode).toBe(400);
  });
});

describe("GET /jobs", () => {
  const jobs = [
    { id: 1, title: "Test Job 1", salary: 50000, equity: "0.05", companyHandle: "test-company" },
    { id: 2, title: "Test Job 2", salary: 60000, equity: "0.08", companyHandle: "test-company-2" }
  ];

  test("can filter by title", async () => {
    Job.findAll.mockResolvedValue(jobs);

    const response = await request(app)
      .get("/jobs?title=Test")
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ jobs });
  });

  test("invalid filter returns error", async () => {
    const response = await request(app)
      .get("/jobs?minSalary=not-a-number")
      .send();

    expect(response.statusCode).toBe(400);
  });
});

describe("GET /jobs/:id", () => {
  const job = { id: 1, title: "Test Job", salary: 50000, equity: "0.05", companyHandle: "test-company" };

  test("can get job by id", async () => {
    Job.get.mockResolvedValue(job);

    const response = await request(app)
      .get("/jobs/1")
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ job });
  });

  test("invalid id returns error", async () => {
    Job.get.mockRejectedValue(new Error("Not Found"));

    const response = await request(app)
      .get("/jobs/9999")
      .send();

    expect(response.statusCode).toBe(404);
  });
});

describe("PATCH /jobs/:id", () => {
  const updatedJob = {
    id: 1,
    title: "Updated Job",
    salary: 60000,
    equity: "0.1",
    companyHandle: "test-company"
  };

  test("admin can update job", async () => {
    Job.update.mockResolvedValue(updatedJob);

    const response = await request(app)
      .patch("/jobs/1")
      .send({ title: "Updated Job", salary: 60000 })
      .set("authorization", `Bearer admin-token`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ job: updatedJob });
  });

  test("invalid data returns error", async () => {
    const response = await request(app)
      .patch("/jobs/1")
      .send({ salary: "not-a-number" })
      .set("authorization", `Bearer admin-token`);

    expect(response.statusCode).toBe(400);
  });
});

describe("DELETE /jobs/:id", () => {
  test("admin can delete job", async () => {
    Job.remove.mockResolvedValue(undefined);

    const response = await request(app)
      .delete("/jobs/1")
      .set("authorization", `Bearer admin-token`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ deleted: "1" });
  });

  test("non-existing job returns error", async () => {
    Job.remove.mockRejectedValue(new Error("Not Found"));

    const response = await request(app)
      .delete("/jobs/9999")
      .set("authorization", `Bearer admin-token`);

    expect(response.statusCode).toBe(404);
  });
});
