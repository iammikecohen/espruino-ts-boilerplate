/**
 * This are the type definitions for the file.
 *
 * By decalring __CONFIG__ type you can autocomplete it.
 * Every prop there will later (in bundling time) be
 * replaced by it's value (avoiding a bunch of variables in espruino code)
 */
import { HomieDevice } from "homie-device.interface";

declare type __CONFIG__ = {
  pins: {
    sclPin: Pin;
    sdaPin: Pin;
    step1p1: Pin;
    step1p2: Pin;
    step1p3: Pin;
    step1p4: Pin;
    homeBtn: Pin;
  };

  // Your network name and password.
  wifi: {
    ssid: string;
    password: string;
  };

  mqtt: {
    username: string;
    address: string;
    password: string;
    port: number;
  };

  debug: boolean;
};

declare var __CONFIG__: __CONFIG__;
