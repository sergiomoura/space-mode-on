type DamageFunction = (damage: number) => void;

type DieFunction = () => void;

export default interface Damageble {
  life: number
  getDamage: DamageFunction
  die: DieFunction
}
