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

  // console.log(application);
  // handler.AddApplication(application);
  globalIncomingFlow = GetIncomingFlow(CONST.INITIAL_MODELING_TIME, CONST.FINAL_MODELING_TIME);

  globalIncomingFlow.forEach(function(application) {
    handler.AddApplication(application);
  });
}

main();

console.log('Applications count: ' + globalIncomingFlow.length);
console.log('Last Application: ' + JSON.stringify(globalIncomingFlow[globalIncomingFlow.length - 1]));
console.log('Handler applications count: ' + handler.ApplicationsCount());

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

  while (arrivalTime < endTime) {
    arrivalTime += GetMagicRand(CONST.ARRIVAL_TIME, CONST.ARRIVAL_ERROR_TIME);

    let application = new Application(arrivalTime, CONST.SERVICE_TIME);

    incomingFLow.push(application);
  }

  return incomingFLow;
}

// Common function
function GetMagicRand(time, timeError) {
  return time - timeError + Math.random() * timeError * 2;
}