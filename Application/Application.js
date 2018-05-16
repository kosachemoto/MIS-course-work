'use strict';

class Application {
  constructor(arrivalTime, serviceTime) {
    this.arrivalTime = arrivalTime;
    this.serviceTime = serviceTime;
    
    this.serviceStartTime = 0;
    this.serviceEndTime = 0;
    this.waitingTime = 0;
  };

  SetServiceStartTime(lastApplicationServiceEndTime) {
    this.serviceStartTime = lastApplicationServiceEndTime;
  };

  SetServiceEndTime() {
    this.serviceEndTime = this.serviceStartTime + this.serviceTime;
  };

  SetWaitingTime(lastApplicationServiceEndTime) {
    if (lastApplicationServiceEndTime > this.arrivalTime) {
      this.waitingTime = lastApplicationServiceEndTime - this.arrivalTime;
    } else {
      this.waitingTime = 0;
    }
  };
};

module.exports = Application;