const wifi = require("Wifi");
const ssid = __CONFIG__.wifi.ssid,
  password = __CONFIG__.wifi.password;

export class MyWifi {
  constructor() {
    this.connect();
  }

  connect() {
    const pass = password.length > 0 ? { password: password } : {};
    console.log("connecting to wifi");
    wifi.on("connected", function(details) {
      console.log(details);
    });
    wifi.on("disconnected", function(details) {
      console.log(details);
    });
    wifi.connect(ssid, pass, ap => {
      if (!ap) {
        console.log("connected?", ap);
        // wifi.stopAP();
      } else {
        // wifi.startAP();
      }
      this.onConnect();
    });
  }

  onConnect() {}
}
