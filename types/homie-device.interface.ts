import { HomieNode } from "./homie-node.interface";

export interface HomieDevice {
  homie: string;
  name: string;
  state: HomieDeviceState;
  nodes: HomieNode[];
  extensions: string;
  $implementation?: string;
}

export enum HomieDeviceState {
  init = "init",
  ready = "ready",
  disconnected = "disconnected",
  sleeping = "sleeping",
  lost = "lost",
  alert = "alert"
}
