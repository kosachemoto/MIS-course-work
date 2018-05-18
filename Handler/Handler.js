'use strict';

const Channel = require('./../Channel/Channel');
const LifePediod = require('./../LifePeriod/LifePeriod');

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

class Handler {
  constructor(channelsCount) {
    this.channels = Array(channelsCount).fill().map( () => new Channel() );
  }

  AddLifePeriod() {
    return (() => {
      let lastRefusalDetectTime = POWER_ON_TIME + this.ReserveChannel().LastRefusalDetectTime();
      let refusalTime = this.GetRefusalTime(lastRefusalDetectTime);
      let refusalDetectTime = this.GetRefusalDetectTime(refusalTime);
  
      let lifePeriod = new LifePediod(
        lastRefusalDetectTime, 
        refusalTime, 
        refusalDetectTime
      );
  
      this.ActiveChannel().AddLifePeriod(lifePeriod);
    })();
  }

  GetRefusalTime(startTime) {
    return + startTime + getMagicRand(REFUSAL_TIME, REFUSAL_ERROR_TIME);
  }

  GetRefusalDetectTime(refusalTime) {
    return Math.ceil(refusalTime / CHECK_SIGNAL_PERIOD) * CHECK_SIGNAL_PERIOD;
  }

  ActiveChannel() {
    return this.channels.sort((a, b) => {
      return a.LastRefusalTime() - b.LastRefusalTime();
    })[0];
  }
  
  ReserveChannel() {
    return this.channels.sort((a, b) => {
      return b.LastRefusalTime() - a.LastRefusalTime();
    })[0];
  }
}

// Common function
function getMagicRand(time, timeError) {
  return time - timeError + Math.random() * timeError * 2;
}

module.exports = Handler;