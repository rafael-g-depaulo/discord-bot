import { createDice, Dice, DiceProps } from "@discord-bot/dice"
import { Attribute } from "."

const damageDice: DiceProps[] = [
  { dieAmmount:  1, dieMax:  2 },   // ( 0)  1d2
  
  { dieAmmount:  1, dieMax:  4 },   // ( 1)  1d4
  { dieAmmount:  1, dieMax:  6 },   // ( 2)  1d6
  { dieAmmount:  1, dieMax:  8 },   // ( 3)  1d8
  { dieAmmount:  1, dieMax: 10 },   // ( 4)  1d10
  { dieAmmount:  2, dieMax:  6 },   // ( 5)  2d6

  { dieAmmount:  2, dieMax:  8 },   // ( 6)  2d8
  { dieAmmount:  2, dieMax: 10 },   // ( 7)  2d10
  { dieAmmount:  3, dieMax:  8 },   // ( 8)  3d8
  { dieAmmount:  3, dieMax: 10 },   // ( 9)  3d10
  { dieAmmount:  4, dieMax: 10 },   // (10)  4d10
  
  { dieAmmount:  8, dieMax:  4 },   // (11)  8d4
  { dieAmmount:  5, dieMax:  8 },   // (12)  5d8
  { dieAmmount: 10, dieMax:  4 },   // (13) 10d4
  { dieAmmount:  8, dieMax:  6 },   // (14)  8d6
  { dieAmmount:  3, dieMax: 20 },   // (15)  3d20
  
  { dieAmmount: 10, dieMax:  6 },   // (16) 10d6
  { dieAmmount:  6, dieMax: 12 },   // (17)  6d12
  { dieAmmount:  8, dieMax: 10 },   // (18)  8d10
  { dieAmmount: 11, dieMax:  8 },   // (19) 11d8
  { dieAmmount: 10, dieMax: 10 },   // (20) 10d10
]

export const getDamageDice = (attb: Attribute): Dice => {
  const attbValue = attb.value + attb.bonus

  // attbValue of 0 or below
  if (attbValue <= 0) return createDice(damageDice[0])
  
  // if attbValue above the max, return the max
  if (attbValue >= damageDice.length) return createDice(damageDice[damageDice.length-1])
  
  return createDice(damageDice[attbValue])
}

export default getDamageDice