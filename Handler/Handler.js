'use strict';

const Channel = require('./../Channel/Channel');

// Время возникновения отказа ( сек. )
const REFUSAL_TIME = 300;
// Погрешность времени возникновения отказа ( сек. )
const REFUSAL_ERROR_TIME = 30;
// Время восстановления MAIN_MACHINE ( сек. )
const RECOVERY_TIME = 100;

class Handler {
  constructor() {
    this.mainMachine = new Channel();
    this.reserveMachine = new Channel();

    this.refusalStartTime = 0;
    this.refusalEndTime = 0;
  }

  SetNextRefusall(startTime) {
    this.refusalStartTime = startTime + getMagicRand(REFUSAL_TIME, REFUSAL_ERROR_TIME);
    this.refusalEndTime = this.refusalStartTime + RECOVERY_TIME;
  }

  AddApplication(application) {
    if (this.MainMachineWork(application.arrivalTime)) {
      this.mainMachine.AddApplication(application);
    } else {
      this.reserveMachine.AddApplication(application);
    }
  }

  MainMachineWork(time) {
    if (this.refusalStartTime < time && time < this.refusalEndTime) {
      return false;
    } else {
      return true;
    }
  }

  HasRefusall(time) {
    if (time < this.refusalEndTime) {
      return true;
    } else {
      return false;
    }
  }
}

function getMagicRand(time, timeError) {
  return time - timeError + Math.random() * timeError * 2;
}

module.exports = Handler;