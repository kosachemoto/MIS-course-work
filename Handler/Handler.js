'use strict';

const CONST = require('./../consants');
const Channel = require('./../Channel/Channel');
const LifePediod = require('./../LifePeriod/LifePeriod');

class Handler {
  constructor(channelsCount) {
    this.channels = Array(channelsCount).fill().map( () => new Channel() );
  }

  AddApplication(application) {
    let _this = this;
    let appStart = application.arrivalTime;
    let appEnd = application.arrivalTime + application.serviceTime;

    this.channels.forEach(function(channel, index) {
      channel.activity.forEach(function(lifePeriod) {
       if ( lifePeriod.startTime < appStart
            && appEnd < lifePeriod.refusalTime 
            && appEnd < CONST.FINAL_MODELING_TIME ) {
         _this.channels[index].AddApplication(application);
       }
      });
    });
  }

  AddLifePeriod() {
    let lastRefusalDetectTime = CONST.POWER_ON_TIME + this.ReserveChannel().LastRefusalDetectTime();
    let refusalTime = this.GetRefusalTime(lastRefusalDetectTime);
    let refusalDetectTime = this.GetRefusalDetectTime(refusalTime);

    let lifePeriod = new LifePediod(
      lastRefusalDetectTime, 
      refusalTime, 
      refusalDetectTime
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
function GetMagicRand(time, timeError) {
  return time - timeError + Math.random() * timeError * 2;
}

module.exports = Handler;