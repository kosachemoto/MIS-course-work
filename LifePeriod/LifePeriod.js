'use strict';

class LifePeriod {
  constructor(startTime, refusalTime, refusalDetectTime, recoveryTime) {
    this.startTime = startTime;
    this.refusalTime = refusalTime;
    this.refusalDetectTime = refusalDetectTime;
    this.recoveryTime = recoveryTime;
  }
}

module.exports = LifePeriod;