import { ServiceResponse } from "@/common/types/ServiceResponse";
import { prisma } from "@/common/providers/prismaClient";
import { Category } from "@prisma/client";

export const fetchAllCategories = async (): Promise<
  ServiceResponse<Category[]>
> => {
  const result = await prisma.category.findMany();

  return { data: result, error: null };
};
