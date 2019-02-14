import { Boid } from './boid.mjs'
import { log, LOGLEVEL } from './log.mjs'
import { Vector } from './vector.mjs';

/* eslint-disable camelcase */
function Application() {
  this.h = 640;
  this.w = 480;
  this.flock_size = 1;
  this.min_speed = 5;
  this.max_speed = 8;
  this.max_force = 0.1;

  this.c = document.getElementById('canvas');
  this.c.style.width =  this.c.width = this.w;
  this.c.style.height = this.c.height = this.h;
  this.ctx = this.c.getContext('2d');
  this.run = false;

  document.getElementById('runButton').innerText = 'Start';
  //this.ctx.globalCompositeOperation = 'destination-over';

  this.boids = [];
  for(let i = 0; i < this.flock_size; i++) {
    this.boids.push(new Boid(this.boids,
                             new Vector(this.h/2, this.w/2),
                             new Vector(1, 0),
                             this.min_speed,
                             this.max_speed,
                             this.max_force))
  }

  this.start = function() {
    window.requestAnimationFrame(this.draw.bind(this));
  }

  this.draw = function (ts) {
    log(LOGLEVEL.LOW, 'drawing', ts, 'fps', 1000/(ts-this.prev_ts));

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