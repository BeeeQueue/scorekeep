import { resolve } from 'path'
import { AuthChecker, buildSchema } from 'type-graphql'

import { EntityWithOwner } from '@/modules/exented-entity'
import { BoardgameResolver } from '@/modules/boardgame/boardgame.resolvers'
import { ClubResolver } from '@/modules/club/club.resolvers'
import { ConnectionResolver } from '@/modules/connection/connection.resolvers'
import { MatchResolver } from '@/modules/match/match.resolvers'
import { UserResolver } from '@/modules/user/user.resolvers'
import { SessionContext } from '@/modules/session/session.lib'

export const enum Role {
  OWNER = 'OWNER',
}

const authChecker: AuthChecker<SessionContext, Role | Role[] | undefined> = async (
  { root, context },
  roles,
) => {
  if(!context.isLoggedIn) {
    throw new Error('You have to be logged in to access this field.')
  }

  if (!Array.isArray(roles)) {
    roles = [roles]
  }

  if (roles.includes(Role.OWNER)) {
    if (!(root instanceof EntityWithOwner)) {
      throw new Error(
        `Required OWNER role on model without owner (${root.name})!`,
      )
    }

    return context.user?.uuid === (await root.getOwner()).uuid
  }

  return false
}

export const createSchema = async (generateSnapshot = true) =>
  buildSchema({
    emitSchemaFile: !generateSnapshot
      ? false
      : { path: resolve(__dirname, 'snapshot.graphql') },
    dateScalarMode: 'isoDate',
    resolvers: [BoardgameResolver, ClubResolver, ConnectionResolver, MatchResolver, UserResolver],
    authChecker,
  })
