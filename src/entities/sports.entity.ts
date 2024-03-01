import { Base } from "./base.entity";
import { Column, Entity } from "typeorm";

@Entity({
  name: "sports",
})
export default class Sports extends Base {
  @Column({ type: "text" })
  name: string;
}
