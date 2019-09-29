const wifi = require("Wifi");
const ssid = __CONFIG__.wifi.ssid,
  password = __CONFIG__.wifi.password;

export class MyWifi {
  constructor() {
    this.connect();
  }

  connect() {
    console.log("connecting to wifi");
    wifi.on("connected", function(details) {
      console.log(details);
    });
    wifi.on("disconnected", function(details) {
      console.log(details);
    });
    wifi.connect(ssid, { password: password }, ap => {
      if (!ap) {
        console.log("connected?", ap);
        wifi.stopAP();
      }
      this.onConnect();
    });
  }

  onConnect() {}
}
