'use strict';

const CONST = require('./../consants');
const Channel = require('./../Channel/Channel');
const LifePeriod = require('./../LifePeriod/LifePeriod');

class Handler {
  constructor(channelsCount) {
    this.channels = Array(channelsCount).fill().map( () => new Channel() );
  }

  TotalSlowTime() {
    return this.channels.reduce(function(totalSlowTime, channel) {
      return totalSlowTime + channel.TotalSlowTime();
    }, 0);
  }

  InSlow(time) { 
    return this.channels.some(function(channel) {
      return channel.InRecovery(time);
    });
  }

  AddApplication(application) {
    let _this = this;
    let appStart = application.arrivalTime;
    let appEnd = application.arrivalTime + application.serviceTime;
    let appShouldBeAdd = true;

    this.channels.forEach(function(channel, index) {
      channel.activity.forEach(function(lifePeriod) {
        // Обработка входящих заявок
        if ( lifePeriod.startTime < appStart
            && appEnd < lifePeriod.refusalTime 
            && appEnd < CONST.FINAL_MODELING_TIME
            && appShouldBeAdd ) {
          _this.channels[index].AddApplication(application);
          appShouldBeAdd = false;
        }
        // Если не был получен управляющий сигнал
        // if ( lifePeriod.startTime < appStart 
        //     && lifePeriod.refusalTime < appEnd 
        //     && lifePeriod.refusalDetectTime > appEnd ) {
        //   lifePeriod.refusalDetectTime = appEnd;
        // }
      });
    });
  }

  AddLifePeriod() {
    let lastRefusalDetectTime;

    if (CONST.CHANNELS_COUNT === 1) {
      lastRefusalDetectTime = CONST.POWER_ON_TIME + this.channels[0].LastRecoveryTime();
    } else {
      // lastRefusalDetectTime = CONST.POWER_ON_TIME + this.ReserveChannel().LastRefusalDetectTime();
      lastRefusalDetectTime = CONST.POWER_ON_TIME + this.ReserveChannel().LastRefusalTime();
    }

    if (this.ReserveChannel().activity.length !== 0) {
      lastRefusalDetectTime -= CONST.REFUSAL_ERROR_TIME - CONST.POWER_ON_TIME;
    }

    let refusalTime = this.GetRefusalTime(lastRefusalDetectTime);
    let refusalDetectTime = this.GetRefusalDetectTime(refusalTime);
    let recoveryTime = refusalDetectTime + CONST.RECOVERY_TIME;

    let lifePeriod = new LifePeriod(
      lastRefusalDetectTime, 
      refusalTime, 
      refusalDetectTime,
      recoveryTime
    );

    this.ActiveChannel().AddLifePeriod(lifePeriod);
  }

  GetRefusalTime(startTime) {
    return + startTime + GetMagicRand(CONST.REFUSAL_TIME, CONST.REFUSAL_ERROR_TIME);
  }

  GetRefusalDetectTime(refusalTime) {
    return Math.ceil(refusalTime / CONST.CHECK_SIGNAL_PERIOD) * CONST.CHECK_SIGNAL_PERIOD;
  }

  ApplicationsCount() {
    return this.channels.reduce(function(applicationsCount, channel) {
      return applicationsCount += channel.ApplicationsCount();
    }, 0);
  }

  ActiveChannel() {
    if (CONST.CHANNELS_COUNT === 1) {
      return this.channels[0];
    } else {
      return this.channels.sort((a, b) => {
        return a.LastRefusalTime() - b.LastRefusalTime();
      })[0];
    }
  }
  
  ReserveChannel() {
    if (CONST.CHANNELS_COUNT === 1) {
      return this.channels[0];
    } else {
      return this.channels.sort((a, b) => {
        return b.LastRefusalTime() - a.LastRefusalTime();
      })[0];
    }
  }

  WorkTime() {
    return this.channels.reduce(function(workTime, channel) {
      return workTime + channel.WorkTime();
    }, 0);
  }


  ServiceEndTime() {
    return this.channels.reduce(function(serviceEndTime, channel) {
      if (serviceEndTime < channel.ServiceEndTime()) {
        return channel.ServiceEndTime();
      } else {
        return serviceEndTime;
      }
    }, 0);
  }

  UseRate() {
    return this.WorkTime() / this.ServiceEndTime() / this.channels.length;
  }
}

// Common function
function GetMagicRand(time, timeError) {
  return time - timeError + Math.random() * timeError * 2;
}

module.exports = Handler;