import { isNil } from './functional'

export * from './functional'

export type OptionalUuid<T extends { uuid: string }> = Omit<T, 'uuid'> & {
  uuid?: string
}

export type PartialPick<T extends {}, K extends keyof T> = Partial<Pick<T, K>>

export const IS_DEV = process.env.NODE_ENV === 'development'

export const mapAsync = async <T, R>(
  items: T[],
  fn: (item: T) => Promise<R>,
) => {
  const promises = items.map(fn)

  return Promise.all(promises)
}

export const enumToArray = <T>(Enum: any): T[] =>
  Object.keys(Enum).map(key => Enum[key])

export const mapObjIndexed = <T extends {}, R extends {}>(
  mappingFunc: (value: T[keyof T], key: keyof T, obj: T) => any,
) => (obj: T): R => {
  const keys = Object.keys(obj)

  return keys.reduce(
    (newObj, key) => ({
      ...newObj,
      [key]: mappingFunc((obj as any)[key], key as any, obj as any),
    }),
    {} as any,
  ) as R
}

export const pick = <T extends {}, K extends Array<keyof T>>(
  obj: T,
  keys: K,
): Pick<T, K[number]> =>
  Object.entries(obj)
    .filter(([key]) => keys.includes(key as keyof T))
    .reduce<Pick<T, K[number]>>(
      (obj, [key, val]) => Object.assign(obj, { [key]: val }),
      {} as any,
    )

export const isUuid = (str?: string) =>
  !isNil(str) &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    str,
  )

export const randomItem = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)]

export const createDescription = (
  desc: string,
  options?: { login?: true; dev?: true; owner?: true },
) => {
  const loginStr = options?.login ? '\n_Requires login._' : ''
  const ownerStr = options?.owner ? '\n_Only accessible by the owner._' : ''
  const devStr = options?.dev ? '\n_Development only._' : ''

  return `${desc}${loginStr}${ownerStr}${devStr}`
}

export const removeDuplicates = <T>(arr: T[]): T[] => Array.from(new Set(arr))
