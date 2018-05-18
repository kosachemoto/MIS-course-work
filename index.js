'use strict';

const Application = require('./Application/Application');
const Channel = require('./Channel/Channel');
const Handler = require('./Handler/Handler');

// Время начала моделирования (сек.)
const INITIAL_MODELING_TIME = 0;
// Время окончания моделирования (сек.) => 3600 сек. по условию
const FINAL_MODELING_TIME = 3600; 
// Время появления заявки
const ARRIVAL_TIME = 10;
// Погрешность времени появления заявки
const ARRIVAL_ERROR_TIME = 2;
// Время обработки заявки (сек.)
const SERVICE_TIME = 5; 

let globalIncomingFlow = [];
let channel = new Channel();
let handler = new Handler(2);

function main() {
  let arrivalTime = 0;

  handler.AddLifePeriod();

  globalIncomingFlow = getIncomingFlow(INITIAL_MODELING_TIME, FINAL_MODELING_TIME);
};

main();

console.log('Applications count: ' + globalIncomingFlow.length);
console.log('Last Application: ' + globalIncomingFlow[globalIncomingFlow.length - 1].arrivalTime);

// Генерируем поток входных заявок
function getIncomingFlow(startTime, endTime) {
  let arrivalTime = startTime;
  let incomingFLow = [];

  while (arrivalTime < endTime) {
    arrivalTime += getMagicRand(ARRIVAL_TIME, ARRIVAL_ERROR_TIME);

    let application = new Application(arrivalTime, SERVICE_TIME);

    incomingFLow.push(application);
  }

  return incomingFLow;
}

// Случайное число time +- timeError
function getMagicRand(time, timeError) {
  return time - timeError + Math.random() * timeError * 2;
}

