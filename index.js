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

function Boid(w, h) {
  this.w = w;
  this.h = h;
  this.x = Math.floor(Math.random()*w);
  this.y = Math.floor(Math.random()*h);
  this.vx = 10; //(Math.random()*10)-5;
  this.vy = 10; //(Math.random()*10)-5;

  this.draw = function(ctx) {
    ctx.strokeRect(this.x, this.y, 10, 10);
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