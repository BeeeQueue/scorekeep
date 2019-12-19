export enum AuthErrorCode {
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  NO_CODE = 'NO_CODE',
  EMAIL_REQUIRED = 'EMAIL_REQUIRED',
  ALREADY_CONNECTED = 'ALREADY_CONNECTED',
  ANOTHER_USER = 'ANOTHER_USER',
}

export type JWTData = {
  session: string
  name: string
  image: string | null
}
