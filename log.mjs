export const LOGLEVEL = {
  LOW: 0,
  MED: 1,
  HI: 2
};

let level = LOGLEVEL.HI;

export function loglevel() {
  if (arguments.length === 0) {
    return level;
  } else {
    level = arguments[0];
  }
}

export function log(requestedLevel, ...args) {
  if (requestedLevel <= level) {
    console.log(...args);
  }
}