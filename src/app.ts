import { MyWifi } from "./modules/wifi";
import { MyMQTT } from "./modules/mqtt";
import { Homie } from "./modules/homie";

const debug = __CONFIG__.debug;

function onInit() {
  const wifi = new MyWifi();
  const mqtt = new MyMQTT();
  const homie = new Homie();
  debug ? console.log("appStart") : null;
  wifi.onConnect = () => {
    debug ? console.log("connected to wifi") : null;
    const LWT = homie.getLWT();
    mqtt.connect(LWT);
  };

  mqtt.onConnect = () => {
    // blindsMotor.mqttSetup(mqtt);
    debug ? console.log("mqtt connected") : null;
    homie.connectMQTT(mqtt);
  };

  mqtt.on("data_received", ev => {
    debug ? console.log("main app has event", ev) : null;
  });
}

E.on("init", onInit);
