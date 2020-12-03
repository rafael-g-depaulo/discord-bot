// define a composable object factory
export interface Composable<State extends {}, Composed extends {}> {
  (state: State): Composed,
}
