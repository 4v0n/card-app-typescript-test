import { Entry } from "@prisma/client";
import Prisma from "../src/db";
import { server } from "../src/server";
import axios from "axios";

describe("server test", () => {
  describe("Schema tests", () => {
    let entry1: Entry;
    let entry2: Entry;

    beforeAll(async () => {
      await Prisma.$connect();
    });

    afterAll(async () => {
      await Prisma.$disconnect();
    });

    beforeEach(async () => {
      entry1 = await Prisma.entry.create({
        data: {
          id: "12345",
          title: "Title1",
          description: "Description1",
          scheduled_date: new Date(),
          created_at: new Date(),
        },
      });
      entry2 = await Prisma.entry.create({
        data: {
          title: "Title2",
          description: "Description2",
          scheduled_date: new Date(2024, 0, 29),
          created_at: new Date(),
        },
      });
    });

    afterEach(async () => {
      await Prisma.entry.deleteMany({});
    });

    it("should contain all correct fields in the Entry model", async () => {
      expect(entry1).toHaveProperty("id");
      expect(entry1).toHaveProperty("title");
      expect(entry1).toHaveProperty("description");
      expect(entry1).toHaveProperty("scheduled_date");
      expect(entry1).toHaveProperty("created_at");
    });

    it("should default to UUID for id when not provided", async () => {
      expect(entry2).toHaveProperty("id");
    });
  });

  describe("API tests", () => {
    const PORT = process.env.PORT || 3002;
    const url = `http://localhost:${PORT}`;

    beforeAll(async () => {
      await server.listen(PORT, "0.0.0.0");
    });

    afterAll(async () => {
      await server.close();
    });

    beforeEach(async () => {
      await Prisma.entry.create({
        data: {
          id: "12345",
          title: "Title1",
          description: "Description1",
          scheduled_date: new Date(),
          created_at: new Date(),
        },
      });
      await Prisma.entry.create({
        data: {
          title: "Title2",
          description: "Description2",
          scheduled_date: new Date(2024, 0, 29),
          created_at: new Date(),
        },
      });
    });

    afterEach(async () => {
      await Prisma.entry.deleteMany({});
    });

    it("GET /get/ should return all entries", async () => {
      const res = await axios.get(`${url}/get/`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.data)).toBe(true);
      expect(Array.from(res.data)).toHaveLength(2);
    });

    it("GET /get/:id should return a single specific entry", async () => {
      const entry = await Prisma.entry.findFirst({});
      if (!entry) fail("Entry not found.");
      
      // convert date fields to ISO string for comparison
      const expectedEntry = {
        ...entry,
        created_at: entry.created_at.toISOString(),
        scheduled_date: entry.scheduled_date.toISOString(),
      }

      const res = (await axios.get(`${url}/get/${entry.id}`));
      expect(res.status).toBe(200);
      expect(res.data).toMatchObject(expectedEntry);
    });

    it("POST /create/ should create a new entry", async () => {
      const res = await axios.post(`${url}/create/`, {
        title: "Title3",
        description: "Description3",
        scheduled_date: new Date(),
        created_at: new Date(),
      });

      expect(res.status).toBe(200);
      expect(res.data).toHaveProperty("id");

      const entry = await Prisma.entry.findUnique({where: {id: res.data.id}});
      if (!entry) fail("Entry not found.");
    });

    it("DELETE /delete/:id should delete an entry", async () =>{
      const entry = await Prisma.entry.findFirst({});
      if (!entry) fail("Entry not found.");

      const res = await axios.delete(`${url}/delete/${entry.id}`);
      expect(res.status).toBe(200);

      const searchedEntry = await Prisma.entry.findUnique({where: {id: entry.id}});
      expect(searchedEntry).toBeNull();
    });

    it("PUT /update/:id should update an entry", async () => {
      const entry = await Prisma.entry.findFirst({});
      if (!entry) fail("Entry not found.");

      const res = await axios.put(`${url}/update/${entry.id}`, {
        title: "newTitle",
        description: "newDescription"
      });
      expect(res.status).toBe(200);

      const searchedEntry = await Prisma.entry.findUnique({where: {id: entry.id}});
      if (!searchedEntry) fail("Entry not found")

      expect(searchedEntry.title).toBe("newTitle");
      expect(searchedEntry.description).toBe("newDescription");
    });
  });
});
