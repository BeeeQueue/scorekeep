import { Arg, Ctx, ID, Query, Resolver, Mutation } from 'type-graphql'

import { User } from '@/modules/user/user.model'
import { SessionContext } from '@/modules/session/session.lib'
import { Session } from '@/modules/session/session.model'
import { isNil, isUuid } from '@/utils'
import uuid from 'uuid/v4'

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

  @Mutation(() => User)
  public async addUser(@Arg('name') name: string) {
    const user = User.from({
      uuid: uuid(),
      name,
      mainConnectionUuid: uuid(),
    })

    return user.save()
  }

  @Mutation(() => Boolean)
  public async useUser(
    @Ctx() context: SessionContext,
    @Arg('uuid') uuid: string,
  ) {
    const user = await User.findByUuid(uuid)
    if (isNil(user)) {
      throw new Error('User does not exist!')
    }

    const session = await Session.generate(user)

    context.setSession(session)

    return true
  }
}
