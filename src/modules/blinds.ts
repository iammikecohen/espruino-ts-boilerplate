const StepperMotor = require("StepperMotor");

const step1p1 = __CONFIG__.pins.step1p1,
  step1p2 = __CONFIG__.pins.step1p2,
  step1p3 = __CONFIG__.pins.step1p3,
  step1p4 = __CONFIG__.pins.step1p4;

export class Blinds {
  motor = new StepperMotor({
    pins: [step1p1, step1p2, step1p3, step1p4]
  });
  constructor() {}

  setHome() {
    this.motor.setHome();
  }

  goHome() {
    this.motor.moveTo(0);
  }

  move(difference: number) {
    this.motor.moveTo(this.motor.getPosition() + difference);
  }
}
