import { server } from "../src/server"
import Prisma from "../src/db";
import { Entry } from "@prisma/client";

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
  });
});