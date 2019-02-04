/* eslint-disable camelcase */
function Canvas(w, h) {
  this.h = h;
  this.w = w;
  this.c = document.getElementById('canvas');
  this.c.style.width =  this.c.width = w;
  this.c.style.height = this.c.height = h;
  this.ctx = this.c.getContext('2d');
  this.run = false;
  document.getElementById('runButton').innerText = 'Start';
  //this.ctx.globalCompositeOperation = 'destination-over';

  this.boids = [];
  for(let i = 0; i < 30; i++) {
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

function rand_velocity(v_min, v_max) {
  return (Math.random()<0.5?-1:1)
         * (Math.random()*(v_max-v_min)+v_min)
}

function normalize_vector(x, y) {
  let m = Math.sqrt(x*x + y*y);
  return [x/m, y/m];
}

function Boid(w, h, flock) {
  this.w = w;
  this.h = h;
  this.flock = flock; // ref to array
  this.x = Math.floor(Math.random()*w);
  this.y = Math.floor(Math.random()*h);
  const v_min = 4;
  const v_max = 7;
  this.vx = rand_velocity(v_min, v_max);
  this.vy = rand_velocity(v_min, v_max);
  this.path = new Path2D();
  this.path.moveTo(-3, -5);
  this.path.lineTo(3, -5);
  this.path.lineTo(0, 10);
  this.path.closePath();

  this.draw = function(ctx) {
    const angle = Math.atan2(this.vy, this.vx)
    -Math.PI/2;
    //console.log("BOID: ",
     //this.x,
     //this.y,
     //this.vx,
     //this.vy,
     //angle*180/Math.PI,
     //direction*180/Math.PI
     //);
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate(angle);
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
    const local = this.flock.filter(b => this.distance_from(b.x, b.y) < 50)
    console.log('flock: ', local.length)

    // avoid crowding local flockmates

    // steer toward the average heading of local flockmates
    local.forEach((b,i) => {
      console.log(`${i}: ${[b.vx.toFixed(2), b.vy.toFixed(2)]}`);
    })

    let avg_x = local.reduce((x, b) => x + b.x, 0.0);
    let avg_y = local.reduce((y, b) => y + b.y, 0.0);
    [avg_x, avg_y] = normalize_vector(avg_x, avg_y);
    console.log(`Average heading: ${[avg_x.toFixed(2), avg_y.toFixed(2)]}`);
    // steer toward the average position of local flockmates

    this.x += this.vx;
    this.y += this.vy;
    if (this.x > this.w || this.x < 0) {
      this.vx = -this.vx;
    }
    if (this.y > this.h || this.y < 0) {
      this.vy = -this.vy;
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