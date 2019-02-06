/* eslint-disable camelcase */
function Canvas() {
  this.h = 640;
  this.w = 480;
  this.flock_size = 52;
  this.min_velocity = 1;
  this.max_velocity = 2;

  this.c = document.getElementById('canvas');
  this.c.style.width =  this.c.width = this.w;
  this.c.style.height = this.c.height = this.h;
  this.ctx = this.c.getContext('2d');
  this.run = false;

  document.getElementById('runButton').innerText = 'Start';
  //this.ctx.globalCompositeOperation = 'destination-over';

  this.boids = [];
  for(let i = 0; i < this.flock_size; i++) {
    this.boids.push(new Boid(this.w, this.h, this.boids, this.min_velocity, this.max_velocity))
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

function magnitude(v) {
  return Math.sqrt(v[0]*v[0] + v[1]*v[1]);
}

function normalize(v) {
  let m = magnitude(v);
  return [v[0]/m, v[1]/m];
}

function Boid(width, height, flock, min_v, max_v) {
  this.w = width;
  this.h = height;
  this.flock = flock; // ref to array
  this.min_velocity = min_v;
  this.max_velocity = max_v;

  this.x = Math.floor(Math.random()*this.w);
  this.y = Math.floor(Math.random()*this.h);

  this.heading = Math.random()*Math.PI*2
  this.velocity = Math.random()*(this.max_velocity-this.min_velocity)+this.min_velocity;

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

      // steering velocity is the difference between the current & desired velocities

        // current Velocity
        const [vx, vy] = [this.velocity*Math.cos(this.heading), this.velocity*Math.sin(this.heading)];
        // averaGe velocity
        const [gx, gy] = [avg_velocity*Math.cos(avg_heading), avg_velocity*Math.sin(avg_heading)];
        // resultant Steering velocity = desired - current
        let [sx, sy] = normalize([gx-vx, gy-vy]);
        sx *= this.max_velocity;
        sy *= this.max_velocity;

        let dh = Math.atan2(sy, sx)   //Math.sign(dh) * Math.min(dh, a_angular_max);
        this.heading += dh;
        let dv = magnitude([sx, sy]);
        this.velocity += dv;

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

const c = new Canvas();

document.getElementById('runButton').addEventListener('click', e => {
  c.run = !c.run;
  e.target.innerText = c.run ? "Stop" : "Start";
  if (c.run) { c.start() }
})

document.getElementById('stepButton').addEventListener('click', () => {
  c.run = false;
  c.start();
})

c.start();