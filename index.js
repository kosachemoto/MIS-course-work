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
  handler = GetHandler(CONST.FINAL_MODELING_TIME);
  // globalIncomingFlow = GetIncomingFlow(CONST.INITIAL_MODELING_TIME, CONST.FINAL_MODELING_TIME);

  console.log('HANDLER:');
  console.log('CHANNEL[0]');
  console.log(handler.channels[0]);
  console.log('CHANNEL[1]');
  console.log(handler.channels[1]);
  console.log('===');

  // globalIncomingFlow.forEach(function(application) {
  //   handler.AddApplication(application);
  // });
}

main();

console.log('Applications count: ' + globalIncomingFlow.length);
console.log('Last Application: ' + JSON.stringify(globalIncomingFlow[globalIncomingFlow.length - 1]));
console.log('Handler applications count: ' + handler.ApplicationsCount());
console.log('Average missed applications count: ' + MissedApplicationsCount(handler, globalIncomingFlow));

//
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

// Генерируем поток входных заявок
function GetIncomingFlow(startTime, endTime) {
  let arrivalTime = startTime;
  let incomingFLow = [];

  arrivalTime += GetMagicRand(CONST.ARRIVAL_TIME, CONST.ARRIVAL_ERROR_TIME);

  do {  
    let application = new Application(arrivalTime, CONST.SERVICE_TIME);
    
    incomingFLow.push(application);
    
    arrivalTime += GetMagicRand(CONST.ARRIVAL_TIME, CONST.ARRIVAL_ERROR_TIME);
  } while (arrivalTime  < endTime)

  return incomingFLow;
}

// Common function
function GetMagicRand(time, timeError) {
  return time - timeError + Math.random() * timeError * 2;
}