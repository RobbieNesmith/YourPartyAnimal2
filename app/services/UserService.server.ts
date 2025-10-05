import { prisma } from "~/prisma.server";

export async function findOrCreate(provider_key: string, email: string) {
  const dbUser = await prisma.user.findFirst({
    where: {
      provider_key
    }
  });

  if (dbUser) {
    return dbUser;
  }

  return await prisma.user.create({
    data: {
      provider_key,
      name: email
    },
  });
}