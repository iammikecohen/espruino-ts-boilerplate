const wifi = require("Wifi");
const ssid = __CONFIG__.wifi.ssid,
  password = __CONFIG__.wifi.password;
const debug = __CONFIG__.debug;

export class MyWifi {
  constructor() {
    this.connect();
  }

  connect() {
    const pass = password.length > 0 ? { password: password } : {};
    debug ? console.log("connecting to wifi") : null;
    wifi.on("connected", function(details) {
      debug ? console.log(details) : null;
    });
    wifi.on("disconnected", function(details) {
      debug ? console.log(details) : null;
    });
    wifi.connect(ssid, pass, ap => {
      if (!ap) {
        debug ? console.log("connected?", ap) : null;
        // wifi.stopAP();
      } else {
        // wifi.startAP();
      }
      this.onConnect();
    });
  }

  onConnect() {}
}
