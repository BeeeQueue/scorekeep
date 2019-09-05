import { Arg, Ctx, ID, Query, Resolver } from 'type-graphql'

import { User } from '@/modules/user/user.model'
import { SessionContext } from '@/modules/session/session.lib'
import { isUuid } from '@/utils'

@Resolver()
export class UserResolver {
  // eslint-disable-next-line @typescript-eslint/require-await
  @Query(() => User, { nullable: true })
  public async user(@Arg('uuid', () => ID) uuid: string): Promise<User | null> {
    if (!isUuid(uuid)) return null

    return User.findByUuid(uuid)
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  @Query(() => User, { nullable: true })
  public async viewer(@Ctx() context: SessionContext): Promise<User | null> {
    return context.user
  }
}
