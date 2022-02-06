import { MiddlewareFn } from "type-graphql";
import { MyContext } from "../../utils/MyContext";

export const isAuthor: MiddlewareFn<MyContext> = async (
  { context: { prisma, req } },
  next
) => {
  const { userId } = req.session;
  console.log("userId", userId);
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      role: true,
    },
  });

  if (user && user.role != "ADMIN") throw new Error("Not author");

  return next();
};
