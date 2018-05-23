'use strict';

class Channel {
  constructor() {
    this.incomingFlow = [];

    // Активность канала
    this.activity = [];
  }

  TotalSlowTime() {
    return this.activity.reduce(function(totalSlowTime, lifePeriod) {
      return totalSlowTime + lifePeriod.recoveryTime - lifePeriod.refusalDetectTime;
    }, 0);
  }

  WorkTime() {
    return this.incomingFlow.reduce(function(workTime, application) {
      return workTime + application.serviceTime;
    }, 0);
  }

  ServiceEndTime() {
    let lastApplicationIndex = this.incomingFlow.length - 1;
    let lastApplication = this.incomingFlow[lastApplicationIndex];
    
    if (lastApplication === undefined) {
      return 'UNDEFINED => ServiceEndTime()'
    } else {
      return lastApplication.arrivalTime + lastApplication.serviceTime;
    }
  }

  InWork(time) {
    let state = false;

    this.activity.forEach(function(lifePeriod) {
      if ((lifePeriod.startTime < time) && (time < lifePeriod.refusalTime)) {
        state = true;
      }
    }, 0);

    return state;
  }

  InRecovery(time) {
    let state = false;

    this.activity.forEach(function(lifePeriod) {
      if ((lifePeriod.refusalTime < time) && (time < lifePeriod.recoveryTime)) {
        state = true;
      }
    });

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

  LastRecoveryTime() {
    if (this.activity.length == 0) {
      return 0;
    } else {
      return this.activity[this.activity.length - 1].recoveryTime;
    }
  }
}

// Common function
function GetMagicRand(time, timeError) {
  return time - timeError + Math.random() * timeError * 2;
}

module.exports = Channel;