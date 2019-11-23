import { resolve } from 'path'
import { buildSchema } from 'type-graphql'

import { BoardgameResolver } from '@/modules/boardgame/boardgame.resolvers'
import { ClubResolver } from '@/modules/club/club.resolvers'
import { MatchResolver } from '@/modules/match/match.resolvers'
import { UserResolver } from '@/modules/user/user.resolvers'

export const createSchema = async () =>
  buildSchema({
    emitSchemaFile: {
      commentDescriptions: true,
      path: resolve(__dirname, 'schema.snapshot'),
    },
    dateScalarMode: 'isoDate',
    resolvers: [BoardgameResolver, ClubResolver, MatchResolver, UserResolver],
  })
