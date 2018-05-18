'use strict';

// Время возникновения отказа ( сек. )
const REFUSAL_TIME = 300;
// Погрешность времени возникновения отказа ( сек. )
const REFUSAL_ERROR_TIME = 30;
// Время восстановления MAIN_MACHINE ( сек. )
const RECOVERY_TIME = 100;
// Время включения резервного канала ( сек. )
const POWER_ON_TIME = 5;
// Периодичность сигнала о проверке ( сек. )
const CHECK_SIGNAL_PERIOD = 30;

class Channel {
  constructor() {
    this.incomingFlow = [];

    // Активность канала
    this.activity = [];
  }

  AddLifePeriod(lifePeriod) {
    this.activity.push(lifePeriod);
  }
  
  LastRefusalTime() {
    if (this.activity.length == 0) {
      return 0;
    } else {
      return this.activity[this.activity.length - 1].refusalTime;
    }
  }
  
  LastRefusalDetectTime() {
    if (this.activity.length == 0) {
      return 0;
    } else {
      return this.activity[this.activity.length - 1].refusalDetectTime;
    }
  }
}

// Common function
function getMagicRand(time, timeError) {
  return time - timeError + Math.random() * timeError * 2;
}

module.exports = Channel;