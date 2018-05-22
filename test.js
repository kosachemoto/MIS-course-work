'use strict';

// Интенсивность входного потока 
const INTENCITY_INCOMING_FLOW = 6; 
// Интенсивность потока обслуживания 
const INTENCITY_SERVICE_FLOW = 12; 
// Количество каналов
const CHANNELS_COUNT = 1; 

function fact(x) {
  let result = 1;

  for (let i = 1; i <= x; i++) {
    result *= i;
  }

  return result;
};

// Коэффициент использования СМО. QS - ( Queueing System )
let GetUseRate = (INTENCITY_INCOMING_FLOW, INTENCITY_SERVICE_FLOW, CHANNELS_COUNT) => {
  return INTENCITY_INCOMING_FLOW / INTENCITY_SERVICE_FLOW / CHANNELS_COUNT;
};

// Минимальное число каналов для того, чтобы очередь не росла до бесконечности
let getminimalChannelsCount = (INTENCITY_SERVICE_FLOW, INTENCITY_INCOMING_FLOW) => {
  let i = 0;

  while (true) {
    if (1 > GetUseRate(INTENCITY_SERVICE_FLOW, INTENCITY_INCOMING_FLOW, i)) {
      return i;
    } else {
      i++;
    }
  }
};

// Предельная вероятность состояния n-канальной СМО
let getCriticalProbability = (useRate, CHANNELS_COUNT) => {
  let result = 1;

  for (let i = 2; i <= CHANNELS_COUNT; i++) {
    result += (Math.pow(useRate, CHANNELS_COUNT)) / ((CHANNELS_COUNT - useRate) * fact(CHANNELS_COUNT));
  }
  return Math.pow(result, -1);
};

// Вероятность нахождения в очереди k сотрудников
let getInQueueProbability = (useRate, k) => {
  return Math.pow(useRate, k) * criticalProbability / fact(k)
};

// Вероятность отказа
let getFailureProbability = (INTENCITY_SERVICE_FLOW, INTENCITY_INCOMING_FLOW) => {
  return INTENCITY_INCOMING_FLOW / (INTENCITY_SERVICE_FLOW + INTENCITY_INCOMING_FLOW);
};

// Относительная пропускная способность
let getRelativeBandwidth = (failureProbability) => {
  return 1 - failureProbability;
};

// Абсолютная пропускная способность
let getAbsoluteBandwidth = (INTENCITY_INCOMING_FLOW, relativeBandwidth) => {
  return INTENCITY_INCOMING_FLOW * relativeBandwidth;
};

// Среднее число сотрудников в очереди
let getInQueueMembers = (useRate, criticalProbability, n) => {
  return (Math.pow(useRate, n + 1) * criticalProbability) /
    (n * fact(n)) * Math.pow(1 - useRate / n, -2);
};

// Среднее число сотрудников, находящихся на обслуживании
let getInServicesMembers = (useRate, relativeBandwidth) => {
  return useRate * relativeBandwidth;
};

// Среднее число сотрудников в системе
let getInSystemMembers = (inQueueMembers, inServicesMembers) => {
  return inQueueMembers + inServicesMembers;
};

// Среднее время пребывание сотрудника в очереди
let getInQueueMembersTime = (inQueueMembers, INTENCITY_INCOMING_FLOW, relativeBandwidth) => {
  return inQueueMembers / (INTENCITY_INCOMING_FLOW * relativeBandwidth);
};

// Среднее время пребывания сотрудника в системе
let getInSystemMembersTime = (inSystemMembers, INTENCITY_INCOMING_FLOW, relativeBandwidth) => {
  return inSystemMembers / (INTENCITY_INCOMING_FLOW * relativeBandwidth);
};

console.log('> INTENCITY INCOMING FLOW: ' + INTENCITY_INCOMING_FLOW);
console.log('> INTENCITY SERVICE FLOW: ' + INTENCITY_SERVICE_FLOW);
console.log('> CHANNELS COUNT: ' + CHANNELS_COUNT + '\n');

let useRate = GetUseRate(INTENCITY_INCOMING_FLOW, INTENCITY_SERVICE_FLOW, CHANNELS_COUNT);
console.log('> Use rate ( for CHANNELS_COUNT = ' + CHANNELS_COUNT + ' ): ' + useRate + '\n');

let minimalChannelsCount = getminimalChannelsCount(INTENCITY_SERVICE_FLOW, INTENCITY_INCOMING_FLOW);
// console.log('> Minimal CHANNELS_COUNT for non infinite queue: ' + minimalChannelsCount);

let criticalProbability = getCriticalProbability(useRate, CHANNELS_COUNT);
// console.log('> Average applications in queue count: ' + criticalProbability + '\n');

for (let i = 1; i <= 5; i++) {
  console.log('> Probability serving in system {' + i + '} applications : ' + getInQueueProbability(useRate, i));
}

let failureProbability = getFailureProbability(INTENCITY_SERVICE_FLOW, INTENCITY_INCOMING_FLOW);
console.log('\n> Probablity of failure: ' + failureProbability);

let relativeBandwidth = getRelativeBandwidth(failureProbability);
console.log('> Relative bandwidth: ' + relativeBandwidth);

let absoluteBandwidth = getAbsoluteBandwidth(INTENCITY_INCOMING_FLOW, relativeBandwidth);
console.log('> Absolute bandwidth: ' + absoluteBandwidth + '\n');

let inQueueMembers = getInQueueMembers(useRate, criticalProbability, minimalChannelsCount);
console.log('> Average count applications in waiting: ' + inQueueMembers);

let inServicesMembers = getInServicesMembers(useRate, relativeBandwidth);
console.log('> Average count applications in service: ' + inServicesMembers);

let inSystemMembers = getInSystemMembers(inQueueMembers, inServicesMembers);
console.log('> Average count applications in system: ' + inSystemMembers + '\n');

let inQueueMembersTime = getInQueueMembersTime(inQueueMembers, INTENCITY_INCOMING_FLOW, relativeBandwidth);
console.log('> Average time applications in waiting: ' + inQueueMembersTime);

let inSystemMembersTime = getInSystemMembersTime(inSystemMembers, INTENCITY_INCOMING_FLOW, relativeBandwidth);
console.log('> Average time applications in system: ' + inSystemMembersTime);
