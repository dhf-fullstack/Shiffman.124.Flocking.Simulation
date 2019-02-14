'use strict'

import { Vector } from './vector.mjs'
import { log, LOGLEVEL } from './log.mjs'

/* eslint-disable camelcase */
// eslint-disable-next-line max-params
export function Boid (flock, left, top, bottom, right,
                      position, velocity,
                      max_speed, max_force, mass) {

  this.flock = flock; // ref to array
  this.left = left;
  this.top = top;
  this.bottom = bottom;
  this.right = right;

  this.max_speed = max_speed;
  this.max_force = max_force;
  this.mass = mass;

  this.position = position;
  this.velocity = velocity;
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
    log(LOGLEVEL.LO, 'flock: ', local.length);

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
        sx *= this.max_speed;
        sy *= this.max_speed;

        let dh = Math.atan2(sy, sx)   //Math.sign(dh) * Math.min(dh, a_angular_max);
        this.heading += dh;
        let dv = magnitude([sx, sy]);
        this.velocity += dv;

    // steer toward the average position of local flockmates
*/

    // steer away from the walls at left, top, right, bottom
    const margin = 25;
    let desired;
    if (this.position.x < this.left+margin) { // left wall, go right
      desired = new Vector(this.max_speed, this.velocity.y);
      log(LOGLEVEL.HI, "Approaching left ", desired)
    } else if (this.position.x > this.right-margin) { // right wall, go left}
      desired = new Vector(-this.max_speed, this.velocity.y);
      log(LOGLEVEL.HI, "Approaching right ", this.position.x, this.right-margin, desired)
    } else if (this.position.y < this.top+margin) { // top wall, go down
      desired = new Vector(this.velocity.x, this.max_speed);
      log(LOGLEVEL.HI, "Approaching top ", desired)
    } else if (this.position.y > this.bottom-margin) { // bottom wall, go up}
      desired = new Vector(this.velocity.x, -this.max_speed);
      log(LOGLEVEL.HI, "Approaching bottom ", desired)
    }
    if (desired) {
      let steering_force = new Vector(desired).sub(this.velocity)
      log(LOGLEVEL.HI, "steering_force ", steering_force)
      steering_force.limit(this.max_force);
      log(LOGLEVEL.HI, "steering_force LIMITED", steering_force, " scale ", 1.0/this.mass)
      this.acceleration = steering_force.scale(1.0/this.mass);
      log(LOGLEVEL.HI, "accel ", this.acceleration)
    }

    this.velocity.add(this.acceleration);
    this.acceleration.set(0, 0)
    this.position.add(this.velocity)

    log(LOGLEVEL.HI, "new vel ", this.velocity, " new pos ", this.position);
  }
}
