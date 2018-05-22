'use strict';

const CONST = require('./consants');
const Application = require('./Application/Application');
const Channel = require('./Channel/Channel');
const Handler = require('./Handler/Handler');

let globalIncomingFlow = [];
let rejectedApplications = [];

let application = new Application(GetMagicRand(CONST.ARRIVAL_TIME, CONST.ARRIVAL_ERROR_TIME), CONST.SERVICE_TIME);
let channel = new Channel();
let handler = new Handler(CONST.CHANNELS_COUNT);

function main() {
  let arrivalTime = CONST.INITIAL_MODELING_TIME;

  handler = GetHandler(CONST.FINAL_MODELING_TIME);
  arrivalTime += GetMagicRand(CONST.ARRIVAL_TIME, CONST.ARRIVAL_ERROR_TIME);
  
  do { 
    let application = new Application(arrivalTime, CONST.SERVICE_TIME);
    
    globalIncomingFlow.push(application);
    handler.AddApplication(application);
    
    if (handler.InSlow(arrivalTime)) {
      arrivalTime += GetMagicRand(CONST.ARRIVAL_TIME * 2, CONST.ARRIVAL_ERROR_TIME * 2);
    } else {
      arrivalTime += GetMagicRand(CONST.ARRIVAL_TIME, CONST.ARRIVAL_ERROR_TIME);
    }

  } while (arrivalTime  < CONST.FINAL_MODELING_TIME)
}

main();

console.log('> Applications count: ' + globalIncomingFlow.length);
console.log('> Last Application: ' + JSON.stringify(globalIncomingFlow[globalIncomingFlow.length - 1]));
console.log('> Handler applications count: ' + handler.ApplicationsCount());
console.log('> Average missed applications count: ' + MissedApplicationsCount(handler, globalIncomingFlow));
console.log('> Average slow time: ' + handler.TotalSlowTime());

// Количество отклонённых заявок
function MissedApplicationsCount(handler, incomingFLow) {
  let incomingApplicationsCount = incomingFLow.length;
  let servisedApplicationsCount = handler.ApplicationsCount();

  return incomingApplicationsCount - servisedApplicationsCount;
}

// Генерируем handler
function GetHandler(startTime, endTime) {
  let handler = new Handler(CONST.CHANNELS_COUNT);

  while (handler.ReserveChannel().LastRefusalTime() < CONST.FINAL_MODELING_TIME) {
    handler.AddLifePeriod();
  }

  return handler;
}

// Common function
function GetMagicRand(time, timeError) {
  return time - timeError + Math.random() * timeError * 2;
}