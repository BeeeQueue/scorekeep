import { GraphQLJSONObject } from 'graphql-type-json'
import { Arg, ID, Mutation, Query, Resolver } from 'type-graphql'

import { Match } from '@/modules/match/match.model'
import { Boardgame } from '@/modules/boardgame/boardgame.model'
import { MinimumResults } from '@/modules/boardgame/boardgame.schema'
import { isNil, isNotNil } from '@/utils'

@Resolver()
export class MatchResolver {
  @Query(() => Match, { nullable: true })
  public async match(
    @Arg('uuid', () => ID) uuid: string,
  ): Promise<Match | null> {
    return (await Match.findOne({ uuid })) ?? null
  }

  @Mutation(() => Match)
  public async addMatch(
    @Arg('results', () => [GraphQLJSONObject])
    results: MinimumResults,
    @Arg('metadata', () => GraphQLJSONObject, { nullable: true })
    metadata: Record<string, any> | null,
    @Arg('game', () => ID) gameUuid: string,
    @Arg('club', () => ID, { nullable: true }) clubUuid: string,
  ) {
    const game = await Boardgame.findOne(gameUuid)

    if (isNil(game)) {
      throw new Error('Not found!')
    }

    await game.validateResults(results)

    if (!isNil(game.metadataSchema)) {
      await game.validateMetadata(metadata)
    }

    const playerUuids = results.map(({ player }) => player)
    const winnerUuids = results
      .map(({ player, winner }) => (winner ? player : null))
      .filter(isNotNil)

    const match = new Match({
      playerUuids,
      results,
      metadata,
      winnerUuids,
      gameUuid,
      clubUuid,
      date: new Date(),
    })

    return match.save()
  }
}
