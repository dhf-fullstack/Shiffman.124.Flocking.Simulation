function Canvas(w, h) {
  this.h = h;
  this.w = w;
  this.c = document.getElementById('canvas');
  this.c.style.width =  this.c.width = w;
  this.c.style.height = this.c.height = h;
  this.ctx = this.c.getContext('2d');
  //this.ctx.globalCompositeOperation = 'destination-over';
}

const c = new Canvas(320, 200)

const init = (function() {
  console.log('init');
  this.guy = {};
  this.guy.x = 0;
  this.guy.y = 0;
  this.guy.dx = 1;
  this.guy.dy = 2;
  window.requestAnimationFrame(draw);
}).bind(c);

const draw = (function (ts) {
  //console.log('drawing', ts,
  //'fps', 1000/(ts-this.prev_ts));
  //this.prev_ts = ts;
  this.ctx.clearRect(0, 0, this.w, this.h);
  //console.log("CLEAR", this.w, this.h);
  //this.ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  //this.ctx.strokeStyle = 'rgba(0, 153, 255, 0.4)';
  this.ctx.strokeRect(this.guy.x, this.guy.y, 10, 10);
  //this.ctx.stroke();
  this.guy.x += this.guy.dx;
  this.guy.y += this.guy.dy;
  if (this.guy.x > this.w || this.guy.x < 0) {
    this.guy.dx = -this.guy.dx;
  }
  if (this.guy.y > this.h || this.guy.y < 0) {
    this.guy.dy = -this.guy.dy;
  }
  window.requestAnimationFrame(draw);
}).bind(c);

init();
