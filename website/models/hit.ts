import { Hitbox } from "./hitbox";

export interface Hit {
  id: number;
  start: number;
  end: number;
  hitboxes: Hitbox[];
}
