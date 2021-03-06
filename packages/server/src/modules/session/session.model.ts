import { Request } from 'express'
import jwt from 'jsonwebtoken'
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm'
import uuid from 'uuid/v4'
import { JWTData } from '@scorekeep/constants'

import { User } from '@/modules/user/user.model'
import { setTokenCookie } from '@/modules/session/session.lib'
import { isNil, isUuid } from '@/utils'

const WEEK = 60 * 60 * 24 * 7
type Constructor = Pick<Session, 'user' | 'expiresAt'>

/**
 * A Session can either have a user or it can not.
 * It cannot go from being user-less to having a user.
 */
@Entity()
export class Session extends BaseEntity {
  @PrimaryColumn({ type: 'uuid' })
  public readonly uuid: string = uuid()

  @ManyToOne(() => User, { eager: true, nullable: false })
  @JoinColumn()
  public readonly user: User

  @Column()
  public readonly expiresAt: Date

  @Column()
  public cancelled: boolean = false

  constructor(options: Constructor) {
    super()

    this.user = options?.user
    this.expiresAt = options?.expiresAt
  }

  public static async generate(user: User) {
    const session = new Session({
      user,
      expiresAt: new Date(Date.now() + WEEK),
    })

    await session.save()

    return session
  }

  public static async findByUuid(uuid: string) {
    const session = await Session.findOne({ uuid })

    return session ?? null
  }

  public static async findByJWT(token?: string): Promise<Session | null> {
    if (isNil(token) || token.length < 1) return null

    let data: JWTData | null = null

    try {
      data = jwt.verify(token, 'scorekeep') as JWTData
    } catch(err) {
      if (err.message !== 'jwt malformed') {
        throw err
      }
    }

    if (isNil(data) || !isUuid(data.session)) {
      return null
    }

    return (await this.findOne({ uuid: data.session })) ?? null
  }

  /**
   * Does not return the new session since it can be found on req.session
   */
  public static async login(req: Request, user: User) {
    if (!isNil(req.session)) {
      await req.session.invalidate()
    }

    const session = await Session.generate(user)

    await setTokenCookie(req.res!)(session)
  }

  public static async invalidate(session: Session | string) {
    if (typeof session === 'string') {
      const gottenSession = await this.findByUuid(session)

      if (isNil(gottenSession)) return

      session = gottenSession
    }

    return session.invalidate()
  }

  public async invalidate() {
    this.cancelled = true

    return this.save()
  }

  public async getJWT() {
    const data: JWTData = {
      session: this.uuid,
      name: this.user.name,
      image: (await this.user.mainConnection())?.image ?? null,
    }

    return jwt.sign(data, 'scorekeep', {
      expiresIn: this.expiresAt.getTime() - Date.now(),
    })
  }
}
