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
    
    if (application.arrivalTime + application.serviceTime < CONST.FINAL_MODELING_TIME) {
      globalIncomingFlow.push(application);
    } else {
    }
    handler.AddApplication(application);
    
    arrivalTime += GetMagicRand(CONST.ARRIVAL_TIME, CONST.ARRIVAL_ERROR_TIME);

    // if (handler.InSlow(arrivalTime)) {
    //   arrivalTime += GetMagicRand(CONST.ARRIVAL_TIME * 2, CONST.ARRIVAL_ERROR_TIME * 2);
    // } else {
    //   arrivalTime += GetMagicRand(CONST.ARRIVAL_TIME, CONST.ARRIVAL_ERROR_TIME);
    // }

  } while (arrivalTime  < CONST.FINAL_MODELING_TIME)
}

main();
console.log('> Applications count: ' + globalIncomingFlow.length);
console.log('> Handling applications count: ' + handler.ApplicationsCount());
console.log('> Missed applications count: ' + MissedApplicationsCount(handler, globalIncomingFlow) + '\n');

console.log('> Work time: ' + handler.WorkTime());
console.log('> Service end time: ' + handler.ServiceEndTime() + '\n');

// console.log('> Average slow time: ' + handler.TotalSlowTime());
console.log('> Use rate: ' + handler.UseRate());

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