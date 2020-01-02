const ssid = __CONFIG__.wifi.ssid,
  password = __CONFIG__.wifi.password;
const debug = __CONFIG__.debug;

export class MyWifi {
  wifi = require("Wifi");
  constructor() {
    this.connect();
  }

  connect() {
    const pass = password.length > 0 ? { password: password } : {};
    debug ? console.log("connecting to wifi") : null;
    this.wifi.on("connected", function(details) {
      debug ? console.log(details) : null;
    });
    this.wifi.on("disconnected", function(details) {
      debug ? console.log(details) : null;
    });
    this.wifi.connect(ssid, pass, ap => {
      if (!ap) {
        debug ? console.log("connected?", ap) : null;
        this.wifi.stopAP();
      } else {
        debug ? console.log("no ap", ap) : null;
        this.wifi.startAP();
      }
      this.onConnect();
    });
  }

  onConnect() {}
}
