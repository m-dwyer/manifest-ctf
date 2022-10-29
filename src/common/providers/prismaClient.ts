import { PrismaClient } from "@prisma/client";

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ["query"],
  });

// middleware

prisma.$use(async (params, next) => {
  if (params.model === "Challenge") {
    if (params.action === "delete") {
      params.action = "update";
      params.args["data"] = { deleted: new Date() };
    }
  }

  return next(params);
});

prisma.$use(async (params, next) => {
  if (params.model === "Challenge") {
    if (
      params.action === "findMany" ||
      params.action === "findUnique" ||
      params.action === "findFirst"
    ) {
      if (params.args.where != undefined) {
        params.args.where["deleted"] = null;
      } else {
        params.args["where"] = { deleted: null };
      }
    }
  }

  return next(params);
});

if (process.env.NODE_ENV !== "production") global.prisma = prisma;
