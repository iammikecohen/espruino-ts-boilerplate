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

    this.connection.on("message", function(msg) {
      console.log("received", msg.topic);
      console.log("data", msg.message);
      console.log("call cb");
      console.log(this.callbacks, msg.topic);
    });

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

  subscribe(msg, cb) {
    console.log(`subscribing to ${msg}`);
    this.callbacks[msg] = cb;
    this.connection.subscribe(msg);
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
