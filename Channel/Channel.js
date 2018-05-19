'use strict';

class Channel {
  constructor() {
    this.incomingFlow = [];

    // Активность канала
    this.activity = [];
  }

  StateSlow(time) {
    let state = true;

    this.activity.forEach(function(lifePeriod) {
      if ((lifePeriod.startTime < time) && (time < lifePeriod.refusalTime)) {
        state = false;
      }
    }, 0);
    return state;
  }

  AddApplication(application) {
    this.incomingFlow.push(application);
  }

  AddLifePeriod(lifePeriod) {
    this.activity.push(lifePeriod);
  }

  ApplicationsCount() {
    return this.incomingFlow.length;
  }

  LastApplication() {
    return this.incomingFlow[this.incomingFlow.length - 1];
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
function GetMagicRand(time, timeError) {
  return time - timeError + Math.random() * timeError * 2;
}

module.exports = Channel;