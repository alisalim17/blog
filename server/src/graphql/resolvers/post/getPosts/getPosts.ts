import { Prisma } from "@prisma/client";
import { Arg, Ctx, Query, Resolver } from "type-graphql";
import { Post } from "../../../../../generated";
import { MyContext } from "../../../../utils/MyContext";
import { PostEntity } from "../../../entity/Post";
import { GetPostsInput } from "../../../inputs/post/GetPostsInput";
import { PostsResponse } from "../../../responses/post/PostsResponse";

// update post set "documentWithWeights" = setweight(to_tsvector(title), 'A')
// CREATE INDEX document_weights_idx
// ON post
// USING GIN ("documentWithWeights");
//     CREATE FUNCTION post_tsvector_trigger() RETURNS trigger AS $$
// begin
// new."documentWithWeights" :=
// setweight(to_tsvector('english', coalesce(new.title, '')), 'A')
// return new;
// end
// $$ LANGUAGE plpgsql;
// CREATE TRIGGER tsvectorupdate BEFORE INSERT OR UPDATE
// ON post FOR EACH ROW EXECUTE PROCEDURE post_tsvector_trigger();

@Resolver(Post)
export class GetPostsResolver {
  @Query(() => PostsResponse, { nullable: true })
  async posts(
    @Ctx() { prisma }: MyContext,
    @Arg("input") input: GetPostsInput
  ) {
    const realLimit = Math.min(50, input.limit);
    const realLimitPlusOne = realLimit + 1;

    const { cursor, query } = input;
    const posts = await prisma.$queryRaw<PostEntity[]>`
    SELECT p.*,json_agg(json_build_object('id',t.id,'name',t.name)) tags FROM post p
    join posts_categories pc on pc."postId" = p.id
    join categories_tags ct on ct."categoryId" =  pc."categoryId"
    join tag t on t.id = ct."tagId"
    ${cursor || query ? Prisma.sql`WHERE` : Prisma.empty}
    ${cursor ? Prisma.sql`p."createdAt" < ${cursor}` : Prisma.empty}
    ${cursor && query ? Prisma.sql`and` : Prisma.empty}
    ${
      query
        ? Prisma.sql`
         to_tsvector(t.name  || ' ' || p.title || ' ' || p.url) @@ plainto_tsquery(${query})
          `
        : Prisma.empty
    }
    GROUP BY p.id
    ORDER BY p."createdAt" DESC
    LIMIT ${realLimitPlusOne}
    `;
    console.log("getposts : ", posts);
    return {
      posts: posts.slice(0, realLimit),
      hasMore: posts.length === realLimitPlusOne,
    };
  }
}
