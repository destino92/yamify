import prisma from "@/libs/prisma";

export const workspaceRepository = {
  listByUser: async (userId: string) => {
    return await prisma.workspace.findMany({ where: { userId } })
  },
  create: async (data: { name: string; userId: string }) => {
    return await prisma.workspace.create({ data })
  }, 
  delete: async (id: string) => {
    return await prisma.workspace.delete({ where: { id } })
  },
  findByName: async (name: string) => {
    return await prisma.workspace.findFirst({ where: { name } })},
  findById: async (id: string) => {
    return await prisma.workspace.findUnique({
      where: { id }
    });
  },
};