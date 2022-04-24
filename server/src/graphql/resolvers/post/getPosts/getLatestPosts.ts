import { Arg, Ctx, Query, Resolver } from "type-graphql";
import { Post } from "../../../../../generated";
import { MyContext } from "../../../../utils/MyContext";
import { PostEntity } from "../../../entity/Post";
import { GetLatestPostsInput } from "../../../inputs/post/GetLatestPostsInput";

@Resolver(Post)
export class GetLatestPostsResolver {
  @Query(() => [PostEntity], { nullable: true })
  async latestPosts(
    @Ctx() { prisma }: MyContext,
    @Arg("input") input: GetLatestPostsInput
  ) {
    return prisma.$queryRaw<PostEntity[]>`
    SELECT * FROM post 
    ORDER BY "createdAt" DESC
    LIMIT ${input?.limit}
    `;
  }
}
