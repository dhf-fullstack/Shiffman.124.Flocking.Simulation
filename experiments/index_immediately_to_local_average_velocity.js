/* eslint-disable camelcase */
function Canvas(w, h) {
  this.h = h;
  this.w = w;
  this.c = document.getElementById('canvas');
  this.c.style.width =  this.c.width = w;
  this.c.style.height = this.c.height = h;
  this.ctx = this.c.getContext('2d');
  this.run = false;
  this.flockSize = 31;

  document.getElementById('runButton').innerText = 'Start';
  //this.ctx.globalCompositeOperation = 'destination-over';

  this.boids = [];
  for(let i = 0; i < this.flockSize; i++) {
    this.boids.push(new Boid(this.w, this.h, this.boids))
  }

  this.start = function() {
    window.requestAnimationFrame(this.draw.bind(this));
  }

  this.draw = function (ts) {
    console.log('drawing', ts, 'fps', 1000/(ts-this.prev_ts));
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

function normalize_vector(x, y) {
  let m = Math.sqrt(x*x + y*y);
  return [x/m, y/m];
}

const v_min = 5; //.1;
const v_max = 10; // 1.1;
const a_angular_max = .1 * (Math.PI/180.0); // radians / frame
const a_velocity_max = .1; // pixel / frame

function Boid(w, h, flock) {
  this.w = w;
  this.h = h;
  this.flock = flock; // ref to array

  this.x = Math.floor(Math.random()*w);
  this.y = Math.floor(Math.random()*h);

  this.heading = Math.random()*Math.PI*2
  this.velocity = Math.random()*(v_max-v_min)+v_min;

  this.path = new Path2D();
  this.path.moveTo(-3, -5);
  this.path.lineTo(3, -5);
  this.path.lineTo(0, 10);
  this.path.closePath();

  this.draw = function(ctx) {
    console.log("BOID: ",
      this.x,
      this.y,
      this.heading*180/Math.PI,
      this.velocity
    );
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate(this.heading-Math.PI/2);
    ctx.stroke(this.path);
    ctx.restore();
  }

  this.distance_from = function (x, y) {
    return Math.sqrt((this.x - x)*(this.x - x) + (this.y - y)*(this.y - y))
  }

  this.update = function() {
    // separation, alignment, cohesion (https://www.red3d.com/cwr/boids/)

    // local flockmates are within a certain distance of boid center and within an angle of boid direction.
    // start with a naive O(n^2) approach comparing every pair of boids
    const local = this.flock.filter(b => this.distance_from(b.x, b.y) < 30)
    console.log('flock: ', local.length)

    // avoid crowding local flockmates

    // steer toward the average heading of local flockmates

      // find the average heading & velocity

      local.forEach((b,i) => {
        console.log(`${i}: ${[b.heading.toFixed(2), b.velocity.toFixed(2)]}`);
      })

      let avg_heading = local.reduce((h, b) => h + b.heading, 0.0) / local.length;
      let avg_velocity = local.reduce((v, b) => v + b.velocity, 0.0) / local.length;
      console.log(`Average heading: ${[avg_heading.toFixed(2), avg_velocity.toFixed(2)]}`);

      // calculate the vector difference between h, v and average h, v

      local.forEach((b,i) => {
        b.heading = avg_heading
        b.velocity = avg_velocity
        /*
        let dh = avg_heading - b.heading;
        let dhd = Math.sign(dh) * Math.min(dh, a_angular_max);
        b.heading += dhd;
        let dv = avg_velocity - b.velocity;
        let dvd = Math.sign(dv) * Math.min(dv, a_velocity_max);
        b.velocity += dvd;
        */
      })

    // steer toward the average position of local flockmates

    this.x += this.velocity * Math.cos(this.heading);
    this.y += this.velocity * Math.sin(this.heading);
    if (this.x > this.w || this.x < 0) {
      this.heading = this.heading + Math.PI;
    }
    if (this.y > this.h || this.y < 0) {
      this.heading = this.heading + Math.PI;
    }
    if (this.heading > Math.PI*2) {
      this.heading -= Math.PI*2;
    }
  }
}

const c = new Canvas(320, 240);

document.getElementById('runButton').addEventListener('click', e => {
  c.run = !c.run;
  e.target.innerText = c.run ? "Stop" : "Start";
  if (c.run) { c.start() }
})

document.getElementById('stepButton').addEventListener('click', e => {
  c.run = false;
  c.start();
})

c.start();