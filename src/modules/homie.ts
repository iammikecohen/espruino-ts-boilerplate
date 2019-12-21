import { HomieDeviceState } from "homie-device.interface";
import { MyMQTT } from "./mqtt";
import { homie } from "./homie.blinds.conf";

const debug = __CONFIG__.debug;

export class Homie {
  private mqtt: MyMQTT;
  deviceId: string;
  rootTopic = "homie";
  stateUrl;

  constructor() {
    this.deviceId = getSerial();
    this.stateUrl = this.getUrlFor("$state");
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
  }

  declareProperties() {
    homie.$nodes.forEach(node => {
      let i = 0;
      const requiredTopics = ["$name", "$type", "$properties"];
      requiredTopics.forEach(property => {
        i++;
        setTimeout(() => {
          this.mqtt.publish({
            topic: this.getUrlFor(`${node.$name}/${property}`),
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
            debug
              ? console.log(
                  this.getUrlFor(
                    `${node.$name}/${property}/${requiredProperty}`
                  ),
                  node[property][requiredProperty]
                )
              : null;

            this.mqtt.publish({
              topic: this.getUrlFor(
                `${node.$name}/${property}/${requiredProperty}`
              ),
              payload: node[property][requiredProperty]
            });
          }, i * 1000 + j * 300);
        });

        if (node[property].$settable) {
          this.mqtt.subscribe(
            this.getUrlFor(`${node.$name}/${property}/set`),
            data => {
              debug
                ? console.log(
                    this.getUrlFor(`${node.$name}/${property}/set`),
                    data
                  )
                : null;
            }
          );
        }
      });
    });
  }

  getUrlFor(endpoint: string) {
    return `${this.rootTopic}/${this.deviceId}/${endpoint}`;
  }

  setState(state: HomieDeviceState) {
    this.mqtt.publish({
      topic: this.stateUrl,
      payload: state
    });
  }
}
