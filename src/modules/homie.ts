import { HomieDeviceState } from "homie-device.interface";
import { MyMQTT } from "./mqtt";

export class Homie {
  private mqtt: MyMQTT;
  deviceId: string;
  rootTopic = "homie";
  stateUrl;

  constructor() {
    this.deviceId = getSerial();
    this.stateUrl = `${this.rootTopic}/${this.deviceId}/$state`;
  }

  getLWT() {
    return {
      will_topic: this.stateUrl,
      will_payload: HomieDeviceState.lost
    };
  }

  connectMQTT(mqtt) {
    this.mqtt = mqtt;
    this.setState(HomieDeviceState.ready);
  }

  setState(state: HomieDeviceState) {
    this.mqtt.publish({
      topic: this.stateUrl,
      payload: state
    });
  }
}
