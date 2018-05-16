'use strict';

const Application = require('./Application/Application');
const Channel = require('./Channel/Channel');
const Handler = require('./Handler/Handler');

// Время начала моделирования (сек.)
const INITIAL_MODELING_TIME = 0;
// Время окончания моделирования (сек.)
const FINAL_MODELING_TIME = 400; 
// Время обработки заявки основным ЭВМ (сек.)
const MAIN_MACHINE_SERVICE_TIME = 5; 
// Время обработки заявки запасным ЭВМ (сек.)
const RESERVE_MACHINE_SERVICE_TIME = 3;

let globalIncomingFlow = [];
let channel = new Channel();
let handler = new Handler();

// handler.SetNextRefusall(0);

function main() {
  let arrivalTime = 0;

  while (arrivalTime < FINAL_MODELING_TIME) {
    arrivalTime += getMagicRand(10, 2);

    let application = new Application(arrivalTime, MAIN_MACHINE_SERVICE_TIME);
    globalIncomingFlow.push(application);

    handler.AddApplication(application);

    if (!handler.HasRefusall(arrivalTime)) {
      handler.SetNextRefusall(arrivalTime);
    }
  }
};

main();

//console.log(channel);
console.log('MAIN: ');
console.log(handler.mainMachine);
console.log('RESERVE: ');
console.log(handler.reserveMachine);

// Случайное число time +- timeError
function getMagicRand(time, timeError) {
  return time - timeError + Math.random() * timeError * 2;
}

