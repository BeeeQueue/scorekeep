import { ArgsType, ClassType, Field, Int, ObjectType } from 'type-graphql'
import { Max, Min } from 'class-validator'

export const PaginatedResponse = <TItem>(TItemClass: ClassType<TItem>) => {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedResponseClass {
    @Field(() => [TItemClass])
    public items!: TItem[]

    @Field(() => Int, { nullable: true })
    public nextOffset!: number | null

    @Field(() => Int)
    public total!: number
  }

  return PaginatedResponseClass
}

@ArgsType()
export abstract class PaginationArgs {
  @Field(() => Int, { nullable: true })
  @Min(0)
  public offset: number = 0

  @Field(() => Int, { nullable: true })
  @Max(20)
  public limit: number = 20
}
