import * as mqtt from "./tinyMQTT";

const address = __CONFIG__.mqtt.address,
  username = __CONFIG__.mqtt.username,
  password = __CONFIG__.mqtt.password,
  port = __CONFIG__.mqtt.port;

export class MyMQTT {
  connection;
  maxRetries = 4;
  retries = 0;
  constructor() {}

  connect(opts) {
    console.log("trying to connect mqtt", opts);
    this.connection = mqtt.create(address, {
      username,
      password,
      port,
      will_topic: opts.will_topic,
      will_payload: opts.will_payload
    });

    this.connection.connect();

    this.connection.on("connected", () => {
      this.retries = 0;
      this.onConnect();
    });

    // mqtt.on("message", function(msg){
    //     console.log(msg.topic);
    //     console.log(msg.message);
    // });

    // mqtt.on("published", function(){
    //     console.log("message sent");
    // });

    this.connection.on("disconnected", () => {
      this.onDisconnect();
    });
  }

  publish(msg) {
    this.connection.publish(msg.topic, msg.payload);
  }

  onConnect() {}

  onDisconnect() {
    this.retries++;
    if (this.retries < this.maxRetries) {
      this.connect({});
    } else {
      const err = new Error("Maximum number of retries exceeded");
      throw err;
    }
  }
}
