import { HomieDeviceState } from "homie-device.interface";
import { MyMQTT } from "./mqtt";
import { homie } from "./homie.conf";

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
    this.setState(HomieDeviceState.init);
    this.declareProperties();
    this.setState(HomieDeviceState.ready);
    this.mqtt.emit.on("incoming", d => {
      console.log("found", d);
    });
  }

  declareProperties() {
    homie.$nodes.forEach(node => {
      let i = 0;
      const requiredTopics = ["$name", "$type", "$properties"];
      requiredTopics.forEach(property => {
        i++;
        setTimeout(() => {
          this.mqtt.publish({
            topic: `${this.rootTopic}/${this.deviceId}/${node.$name}/${property}`,
            payload: node[property]
          });
        }, i * 300);
      });
      let j = 0;
      const properties = node.$properties.split(",");
      properties.forEach((property: string) => {
        j++;
        const requiredTopics = ["$name", "$datatype", "$settable"];
        requiredTopics.forEach(requiredProperty => {
          setTimeout(() => {
            console.log(
              `${this.rootTopic}/${this.deviceId}/${node.$name}/${property}/${requiredProperty}`,
              node[property][requiredProperty]
            );

            this.mqtt.publish({
              topic: `${this.rootTopic}/${this.deviceId}/${node.$name}/${property}/${requiredProperty}`,
              payload: node[property][requiredProperty]
            });
          }, i * 1000 + j * 300);
        });

        if (node[property].$settable) {
          this.mqtt.subscribe(
            `${this.rootTopic}/${this.deviceId}/${node.$name}/${property}/set`,
            data => {
              console.log(
                `${this.rootTopic}/${this.deviceId}/${node.$name}/${property}/set`,
                data
              );
            }
          );
        }
      });
    });
  }

  setState(state: HomieDeviceState) {
    this.mqtt.publish({
      topic: this.stateUrl,
      payload: state
    });
  }
}
