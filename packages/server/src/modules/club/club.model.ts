import { Column, Entity } from 'typeorm'
import { Field, ObjectType } from 'type-graphql'
import { MaxLength } from 'class-validator'

import { EntityWithOwner } from '@/modules/exented-entity'
import { User } from '@/modules/user/user.model'
import { isNil, OptionalUuid } from '@/utils'

type ClubConstructor = OptionalUuid<
  Pick<Club, 'uuid' | 'name' | 'memberUuids' | 'ownerUuid'>
>

@Entity()
@ObjectType()
export class Club extends EntityWithOwner {
  @Column()
  @Field()
  @MaxLength(50)
  public name: string

  @Column({ type: 'simple-array' })
  public memberUuids: string[]
  @Field(() => [User])
  public async members(): Promise<User[]> {
    return User.find({
      where: this.memberUuids.map(memberUuid => ({
        uuid: memberUuid,
      })),
    })
  }

  @Column({ type: 'uuid' })
  public ownerUuid: string
  @Field(() => User, {
    description: 'A club owner must be a claimed player',
  })
  public async owner(): Promise<User> {
    const owner = await User.findOne({ uuid: this.ownerUuid })

    if (isNil(owner)) {
      throw this.shouldExistError(User, this.ownerUuid)
    }

    return owner
  }

  constructor(options: ClubConstructor) {
    super(options)

    this.name = options?.name
    this.memberUuids = options?.memberUuids
    this.ownerUuid = options?.ownerUuid
  }

  public async getOwners() {
    return [await this.owner()]
  }
}
