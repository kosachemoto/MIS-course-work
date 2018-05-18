'use strict';

class Channel {
  constructor() {
    this.incomingFlow = [];

    // Активность канала
    this.activity = [];
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