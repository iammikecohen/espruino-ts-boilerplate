import { MyWifi } from "./modules/wifi";
import { MyMQTT } from "./modules/mqtt";
import { Blinds } from "./modules/blinds";

function main() {
  const wifi = new MyWifi();
  const mqtt = new MyMQTT();
  const blindsMotor = new Blinds();

  console.log("appStart");

  wifi.onConnect = () => {
    console.log("connected to wifi");
    mqtt.connect();
  };

  mqtt.onConnect = () => {
    console.log("connected to mqtt");
    mqtt.connection.subscribe("espruino/test");

    mqtt.connection.on("message", function(msg) {
      console.log(msg.topic);
      console.log(msg.message);
      msg.message = JSON.parse(msg.message);
      if (msg.topic) {
        console.log(`checking: ${msg.message.func}`);
        switch (msg.message.func) {
          case "goHome":
            blindsMotor.goHome();
            break;
          case "move":
            console.log("moving");
            blindsMotor.move(msg.message.value);
            break;
          default:
            break;
        }
      }
    });
  };
}

E.on("init", main);
