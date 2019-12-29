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
    // processNode
    // declare node attributes
    // declare properties
    // declare property attributes
    this.declareNodes(homie.$nodes);
    this.setState(HomieDeviceState.ready);
  }

  declareNodes(d: any[]) {
    if (d.length > 0) {
      const node = d.shift();
      this.declareNodeAttributes(node).then(v => {
        const properties = node.$properties.split(",");
        this.declareProperties(node, properties).then(() => {
          console.log("next node", v, d);
          this.declareNodes(d);
        });
      });
    } else {
      console.log("done");
    }
  }

  declareNodeAttributes(node, attributes = ["$name", "$type", "$properties"]) {
    const attribute = attributes.shift();
    if (attribute) {
      const url = this.getUrlFor(`${node.$name}/${attribute}`);
      console.log("posting to", url);
      return this.mqtt
        .publish({
          topic: url,
          payload: node[attribute]
        })
        .then(msg => this.declareNodeAttributes(node, attributes));
    } else {
      return Promise.resolve();
    }
  }

  makeRequest() {}

  declareProperties(node, properties) {
    const property = properties.shift();

    if (property) {
      const requiredTopics = ["$name", "$datatype", "$settable"];
      return this.setTopic(node, property, requiredTopics).then(v => {
        console.log(`properties declared for ${property}`);
        return this.declareProperties(node, properties);
      });
    } else {
      console.log("done with properties");
      return Promise.resolve();
    }
  }

  setTopic(node, property, attributes) {
    const attribute = attributes.shift();

    if (attribute) {
      const url = this.getUrlFor(`${node.$name}/${property}/${attribute}`);
      console.log("posting to", url, node[property][attribute]);
      const subscriptionUrl = this.getUrlFor(`${node.$name}/${property}/set`);
      if (node[property].$settable) {
        this.mqtt.subscribe(subscriptionUrl, data => {
          this.emit(subscriptionUrl, data);
        });
      }

      return this.mqtt
        .publish({
          topic: url,
          payload: node[property][attribute]
        })
        .then(msg => this.setTopic(node, property, attributes));
    } else {
      console.log("done with topics");
      return Promise.resolve();
    }
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
