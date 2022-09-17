import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { PrismaClientOptions } from "@prisma/client/runtime";

function setPrismaOptions(): Omit<PrismaClientOptions, "__internal"> {
  switch (process.env.NODE_ENV) {
    case "development":
      return {
        errorFormat: "pretty",
        log: ["info", "query", "error", "warn"],
      };
    case "production":
      return {};
    default:
      return {};
  }
}

class IDatabaseService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient(setPrismaOptions());

    this.prisma.$use((params: any, next: any) => {
      if (params.model === "User") {
        if (params.action === "create" && params.args.data.password) {
          params.args.data.password = bcrypt.hashSync(
            params.args.data.password,
            10
          );
        }
        if (params.action === "update" && params.args.data.password) {
          params.args.data.password.set = bcrypt.hashSync(
            params.args.data.password.set,
            10
          );
        }
      }
      return next(params);
    });
  }

  get client() {
    return this.prisma;
  }

  async disconnect() {
    await this.prisma.$disconnect();
  }
}

const DatabaseService = new IDatabaseService();

export default DatabaseService;

