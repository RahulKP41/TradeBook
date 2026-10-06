import prisma from "@/lib/prisma";
import { User } from "@prisma/client";

export type UserWithoutPassword = Omit<User, "passwordHash">;

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function findUserById(id: string) {
  return prisma.user.findUnique({ where: { id } });
}

export async function createUser(data: {
  email: string;
  passwordHash: string;
}) {
  return prisma.user.create({ data });
}

export function toPublicUser(user: User): UserWithoutPassword {
  const { passwordHash: _hash, ...rest } = user;
  return rest;
}