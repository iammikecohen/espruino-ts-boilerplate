import { MyWifi } from "./modules/wifi";
import { MyMQTT } from "./modules/mqtt";
import { Homie } from "./modules/homie";

function main() {
  const wifi = new MyWifi();
  const mqtt = new MyMQTT();
  const homie = new Homie();
  console.log("appStart");
  wifi.onConnect = () => {
    console.log("connected to wifi");
    const LWT = homie.getLWT();
    mqtt.connect(LWT);
  };

  mqtt.onConnect = () => {
    // blindsMotor.mqttSetup(mqtt);
    console.log("mqtt connected");
    homie.connectMQTT(mqtt);
  };
}

E.on("init", main);
