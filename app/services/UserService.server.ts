import { prisma } from "~/prisma.server";

export async function findOrCreate(provider_key: string, email: string, roles: string[]) {
  const approved = roles.includes("partyanimal-dj");
  const dbUser = await prisma.user.findFirst({
    where: {
      provider_key
    }
  });

  if (dbUser) {
    if (approved !== dbUser.approved) {
      return await prisma.user.update({
        data: {approved},
        where: {id: dbUser.id}
      });
    }
    return dbUser;
  }

  return await prisma.user.create({
    data: {
      provider_key,
      name: email,
      approved
    },
  });
}