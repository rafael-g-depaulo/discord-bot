import { DiceProps } from "@discord-bot/dice"

export const damageDice: DiceProps[] = [
  { dieAmmount:  1, dieMax:  2, explode: 1 },   // ( 0)  1d2!
  
  { dieAmmount:  1, dieMax:  4, explode: 1 },   // ( 1)  1d4!
  { dieAmmount:  1, dieMax:  6, explode: 1 },   // ( 2)  1d6!
  { dieAmmount:  1, dieMax:  8, explode: 1 },   // ( 3)  1d8!
  { dieAmmount:  1, dieMax: 10, explode: 1 },   // ( 4)  1d10!
  { dieAmmount:  2, dieMax:  6, explode: 1 },   // ( 5)  2d6!

  { dieAmmount:  2, dieMax:  8, explode: 1 },   // ( 6)  2d8!
  { dieAmmount:  2, dieMax: 10, explode: 1 },   // ( 7)  2d10!
  { dieAmmount:  3, dieMax:  8, explode: 1 },   // ( 8)  3d8!
  { dieAmmount:  3, dieMax: 10, explode: 1 },   // ( 9)  3d10!
  { dieAmmount:  4, dieMax: 10, explode: 1 },   // (10)  4d10!
  
  { dieAmmount:  8, dieMax:  4, explode: 1 },   // (11)  8d4!
  { dieAmmount:  5, dieMax:  8, explode: 1 },   // (12)  5d8!
  { dieAmmount: 10, dieMax:  4, explode: 1 },   // (13) 10d4!
  { dieAmmount:  8, dieMax:  6, explode: 1 },   // (14)  8d6!
  { dieAmmount:  3, dieMax: 20, explode: 1 },   // (15)  3d20!
  
  { dieAmmount: 10, dieMax:  6, explode: 1 },   // (16) 10d6!
  { dieAmmount:  6, dieMax: 12, explode: 1 },   // (17)  6d12!
  { dieAmmount:  8, dieMax: 10, explode: 1 },   // (18)  8d10!
  { dieAmmount: 11, dieMax:  8, explode: 1 },   // (19) 11d8!
  { dieAmmount: 10, dieMax: 10, explode: 1 },   // (20) 10d10!
]

// get correct dice to roll for attribute value
export const getDmgDiceArg = (value: number) => {
  const attbValue = value - value % 1

  // attbValue of 0 or below
  if (attbValue <= 0) return damageDice[0]
  
  // if attbValue above the max, return the max
  if (attbValue >= damageDice.length) return damageDice[damageDice.length-1]
  
  // else, return damageDice in range
  return damageDice[attbValue]
}
