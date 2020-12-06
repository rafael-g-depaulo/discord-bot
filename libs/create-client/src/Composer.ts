// define a composable object factory
export interface Composable<Props extends {}, Composed extends {}> {
  (state: Props): Composed,
}
