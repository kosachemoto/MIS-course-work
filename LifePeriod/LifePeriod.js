'use strict';

class LifePeriod {
  constructor(startTime, refusalTime, refusalDetectTime) {
    this.startTime = startTime;
    this.refusalTime = refusalTime;
    this.refusalDetectTime = refusalDetectTime;
  }

  GetUptime() {
    return this.refusalTime - this.startTime;
  }
}

module.exports = LifePeriod;