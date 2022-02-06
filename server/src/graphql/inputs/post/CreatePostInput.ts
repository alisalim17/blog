import { Field, InputType } from "type-graphql";

@InputType()
export class CreatePostInput {
  @Field()
  content!: string;

  @Field()
  title!: string;
}
