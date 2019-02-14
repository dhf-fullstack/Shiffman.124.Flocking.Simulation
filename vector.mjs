export function Vector(x, y) {
  this.x = x;
  this.y = y;

  this.magnitude = function () {
    return Math.sqrt(this.x*this.x + this.y*this.y);
  }

  this.normalize = function() {
    const m = this.magnitude();
    this.x /= m;
    this.y /= m;
    return this;
  }

  this.sub = function (v) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  this.add = function (v) {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  this.scale = function (s) {
    this.x *= s;
    this.y *= s;
    return this;
  }

  this.limit = function (max) {
    // (10, 20, 2).limit(5) = [ 2.2271771, 4.4543543, 0.4454354 ]
    const mag = this.magnitude();
    this.normalize();
    this.scale(mag/max);
    return this;
  }

  this.polar = function () {
    const heading = Math.atan2(this.y, this.x)   //Math.sign(dh) * Math.min(dh, a_angular_max);
    const speed = this.magnitude();
    return [heading, speed];
  }

  this.set = function (x, y) {
    this.x = x;
    this.y = y;
    return this;
  }

}

Vector.prototype.toString = function() {
  return `[${this.x.toFixed(2)}, ${this.y.toFixed(2)}]`;
}
