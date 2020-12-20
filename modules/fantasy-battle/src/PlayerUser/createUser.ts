export interface PlayerUser {
  userId: string,
  username: string,
}

export interface PlayerUserProps {
  userId: string,
  username: string,
}

export interface PlayerUserState {
}

export const createUser = (props: PlayerUserProps): PlayerUser => {
  // props
  const {
    userId,
    username,
  } = props

  // throw if bad props
  // throw if bad props

  // state
  const state: PlayerUserState = {
  }

  // methods
  // methods

  // return PlayerUser object
  return {
    userId,
    username,
  }
}

export default createUser
