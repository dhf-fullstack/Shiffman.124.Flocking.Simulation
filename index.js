/* eslint-disable camelcase */
function Canvas(w, h) {
  this.h = h;
  this.w = w;
  this.c = document.getElementById('canvas');
  this.c.style.width =  this.c.width = w;
  this.c.style.height = this.c.height = h;
  this.ctx = this.c.getContext('2d');
  //this.ctx.globalCompositeOperation = 'destination-over';

  this.boids = [];
  for(let i = 0; i < 30; i++) {
    this.boids.push(new Boid(this.w, this.h))
  }

  this.start = function() {
    window.requestAnimationFrame(this.draw.bind(this));
  }

  this.draw = function (ts) {
    //console.log('drawing', ts, 'fps', 1000/(ts-this.prev_ts));
    //this.prev_ts = ts;

    this.ctx.clearRect(0, 0, this.w, this.h);
    this.boids.forEach(b => {
      b.draw(this.ctx);
      b.update();
    })
    window.requestAnimationFrame(this.draw.bind(this));
  }
}

function rand_velocity(v_min, v_max) {
  return (Math.random()<0.5?-1:1)
         * (Math.random()*(v_max-v_min)+v_min)
}

function Boid(w, h) {
  this.w = w;
  this.h = h;
  this.x = Math.floor(Math.random()*w);
  this.y = Math.floor(Math.random()*h);
  const v_min = 1;
  const v_max = 5;
  this.vx = rand_velocity(v_min, v_max)
  this.vy = rand_velocity(v_min, v_max)
  this.path = new Path2D();
  this.path.moveTo(-3, -5)
  this.path.lineTo(3, -5)
  this.path.lineTo(0, 10)
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
    //ctx.translate(this.x, this.y)
    ctx.stroke(this.path);
    //ctx.strokeRect(this.x, this.y, 10, 10);
    ctx.restore();
  }

  this.update = function() {
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
c.start();