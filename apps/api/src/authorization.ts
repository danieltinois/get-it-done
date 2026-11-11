import type { Prisma } from "@prisma/client";

// A user can reach a group when they own it or are one of its members.
// Use it in every query that reads or writes a group's data, so a request for
// another user's group finds nothing and the route answers 404.
export function groupAccessibleBy(userId: string): Prisma.GroupWhereInput {
  return {
    OR: [{ ownerId: userId }, { members: { some: { userId } } }],
  };
}
