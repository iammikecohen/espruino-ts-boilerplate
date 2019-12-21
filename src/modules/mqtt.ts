import * as mqtt from "./tinyMQTT";

const address = __CONFIG__.mqtt.address,
  username = __CONFIG__.mqtt.username,
  password = __CONFIG__.mqtt.password,
  port = __CONFIG__.mqtt.port;
const debug = __CONFIG__.debug;

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

    this.connection.on("message", msg => {
      this.emit("data_received", msg);
      debug ? console.log("received", msg.topic) : null;
      debug ? console.log("data", msg.message) : null;
      debug ? console.log("call cb") : null;
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
    debug ? console.log(`subscribing to ${msg}`) : null;
    // this.callbacks[msg] = cb;
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
