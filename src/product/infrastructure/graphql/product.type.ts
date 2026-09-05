import { Field, Float, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ProductType {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => Float)
  price: number;
}
