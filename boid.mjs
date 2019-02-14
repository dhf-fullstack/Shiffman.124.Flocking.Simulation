import { Vector } from './vector.mjs'
import { log, LOGLEVEL } from './log.mjs'

/* eslint-disable camelcase */
export function Boid (flock, position, velocity, min_speed, max_speed, max_force) {

  this.flock = flock; // ref to array
  this.min_speed = min_speed;
  this.max_speed = max_speed;
  this.max_force = max_force;

  this.position = position; // TODO new Vector(0,0); //Math.floor(Math.random()*this.w), Math.floor(Math.random()*this.h));
  this.velocity = velocity; // TODO new Vector(0,0); //Math.cos(heading), Math.sin(heading)).scale(speed);
  this.acceleration = new Vector(0,0)

  this.path = new Path2D();
  this.path.moveTo(-3, -5);
  this.path.lineTo(3, -5);
  this.path.lineTo(0, 10);
  this.path.closePath();

  this.draw = function(ctx) {
    log(LOGLEVEL.HI,
       `BOID: ${this.position}, v ${this.velocity}, a ${this.acceleration} (polar v <${this.velocity.polar()}>, a <${this.acceleration.polar()}>)`);
    ctx.save()
    ctx.translate(this.position.x, this.position.y)
    const heading = Math.atan2(this.velocity.y, this.velocity.x);
    ctx.rotate(heading-Math.PI/2);
    ctx.stroke(this.path);
    ctx.restore();
  }

  this.distance_from = function (v) {
    return new Vector(this.position.x, this.position.y).sub(v).magnitude();
  }

  // eslint-disable-next-line complexity
  this.update = function() {
    // separation, alignment, cohesion (https://www.red3d.com/cwr/boids/)

    // local flockmates are within a certain distance of boid center and within an angle of boid direction.
    // start with a naive O(n^2) approach comparing every pair of boids
    const local = this.flock.filter(b => this.distance_from(b.position) < 30)
    log(LOGLEVEL.HI, 'flock: ', local.length);

    // avoid crowding local flockmates

    // steer toward the average heading of local flockmates

      // find the average heading & velocity
/*
      if (loglevel() === LOGLEVEL.HI) {
        local.forEach((b,i) => {
          let [h, v] = b.velocity.polar();
          log(LOGLEVEL.HI, `${i}: ${[h.toFixed(2), v.toFixed(2)]}`);
        })
      }

      let avg_heading = local.reduce((h, b) => h + b.heading, 0.0) / local.length;
      let avg_velocity = local.reduce((v, b) => v + b.velocity, 0.0) / local.length;
      log(LOGLEVEL.LOW, `Average heading: ${[avg_heading.toFixed(2), avg_velocity.toFixed(2)]}`);
*/
/*
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
*/

    // steer away from the walls
    const margin = 25;
    if (this.x < margin) {
      const desired = new Vector(this.max_velocity, this.velocity.y);
      let steering_force = Vector.sub(desired, this.velocity).limit(this.max_force);
      this.acceleration = steering_force;
    }

    this.velocity.add(this.acceleration);
    this.acceleration.set(0, 0)

    this.position.add(this.velocity)
    /*
    if (this.x > this.w || this.x < 0) {
      this.heading = this.heading + Math.PI;
    }
    if (this.y > this.h || this.y < 0) {
      this.heading = this.heading + Math.PI;
    }
    if (this.heading > Math.PI*2) {
      this.heading -= Math.PI*2;
    }
    */
  }
}
