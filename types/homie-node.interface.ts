import { HomieProperties } from "homie-property.interface";

export interface HomieNode {
  $name: string;
  $type: string;
  $properties: string;
  [key: string]: string | HomieProperties;
}
