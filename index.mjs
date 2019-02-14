'use strict'

/* eslint-disable camelcase */

import { Boid } from './boid.mjs'
import { log, LOGLEVEL } from './log.mjs'
import { Vector } from './vector.mjs';
import { loglevel } from './log.mjs';

function Application() {
  this.h = 640;
  this.w = 480;
  this.flock_size = 53;
  this.min_speed = 5;
  this.max_speed = 8;
  this.max_force = 0.1;
  this.mass = 50;

  this.c = document.getElementById('canvas');
  this.c.style.width =  this.c.width = this.w;
  this.c.style.height = this.c.height = this.h;
  this.ctx = this.c.getContext('2d');
  this.run = false;

  document.getElementById('runButton').innerText = 'Start';
  //this.ctx.globalCompositeOperation = 'destination-over';

  this.boids = [];
  for(let i = 0; i < this.flock_size; i++) {
    const position = new Vector(Math.floor(Math.random()*this.w),                                  Math.floor(Math.random()*this.h));
    const heading = Math.random()*Math.PI*2
    const speed = Math.random()*(this.max_speed-this.min_speed)+this.min_speed
    const velocity = new Vector(Math.cos(heading),
                                Math.sin(heading)).scale(speed);
    log(LOGLEVEL.HI, `heading ${heading.toFixed(2)} speed ${speed.toFixed(2)} velocity ${velocity}`)
    this.boids.push(new Boid(this.boids,
                             0, 0, this.h, this.w,
                             position,
                             velocity,
                             this.max_speed,
                             this.max_force,
                             this.mass))
  }

  this.start = function() {
    window.requestAnimationFrame(this.draw.bind(this));
  }

  this.draw = function (ts) {
    log(LOGLEVEL.HI, 'drawing', ts, 'fps', 1000/(ts-this.prev_ts));

    this.prev_ts = ts;

    this.ctx.clearRect(0, 0, this.w, this.h);
    this.boids.forEach(b => {
      b.draw(this.ctx);
      b.update();
    })
    if (this.run) {
      window.requestAnimationFrame(this.draw.bind(this));
    }
  }
}

loglevel(LOGLEVEL.LO);

const app = new Application();

document.getElementById('runButton').addEventListener('click', e => {
  app.run = !app.run;
  e.target.innerText = app.run ? "Stop" : "Start";
  if (app.run) { app.start() }
})

document.getElementById('stepButton').addEventListener('click', () => {
  app.run = false;
  app.start();
})

app.start();