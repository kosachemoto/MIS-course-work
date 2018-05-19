'use strict';

class LifePeriod {
  constructor(startTime, refusalTime, refusalDetectTime, recoveryTime) {
    this.startTime = startTime;
    this.refusalTime = refusalTime;
    this.refusalDetectTime = refusalDetectTime;
    this.recoveryTime = recoveryTime;
  }

  GetUptime() {
    return this.refusalTime - this.startTime;
  }
}

module.exports = LifePeriod;