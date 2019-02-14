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

    let steering_force = new Vector(0, 0);

    // avoid crowding local flockmates
    steering_force.add(this.avoid_crowding(local));

    // steer toward the average heading of local flockmates
    steering_force.add(this.average_heading(local));

    // steer toward the average position of local flockmates
    steering_force.add(this.average_position(local));

    // steer away from the walls at left, top, right, bottom
    let s = this.avoid_obstacles();
    if (s.x !== 0.0 || s.y !== 0.0) {
      steering_force = s;
    }

    this.acceleration.add(steering_force.scale(1.0/this.mass));
    this.velocity.add(this.acceleration);
    this.acceleration.set(0, 0)
    this.position.add(this.velocity)

    log(LOGLEVEL.HI, "new vel ", this.velocity, " new pos ", this.position);
  }

  // return steering force (vector) to avoid crowding local flockmates
  this.avoid_crowding = function(_local) {
    return new Vector(0, 0);
  }

  // return steering force (vector) toward the average heading of local flockmates
  this.average_heading = function(local) {

    let avg_heading = local.reduce((sum, b) => {
      let [heading, _speed] = b.velocity.polar();
      return sum + heading;
    }, 0.0) / local.length;

    let avg_speed = local.reduce((sum, b) => {
      let [_heading, speed] = b.velocity.polar();
      return sum + speed;
    }, 0.0) / local.length;

    let desired = new Vector(Math.cos(avg_heading),
                             Math.sin(avg_heading)).scale(avg_speed);
    let steering_force = new Vector(desired).sub(this.velocity);
    return steering_force.limit(this.max_force)
  }

  this.average_position = function(_local) {
    return new Vector(0, 0);
  }

  this.avoid_obstacles = function() {
    const margin = 25;
    let desired;
    if (this.position.x < this.left+margin) {
      // left wall, go right
      desired = new Vector(this.max_speed, this.velocity.y);
    } else if (this.position.x > this.right-margin) {
      // right wall, go left}
      desired = new Vector(-this.max_speed, this.velocity.y);
    } else if (this.position.y < this.top+margin) {
      // top wall, go down
      desired = new Vector(this.velocity.x, this.max_speed);
    } else if (this.position.y > this.bottom-margin) {
      // bottom wall, go up
      desired = new Vector(this.velocity.x, -this.max_speed);
    }
    if (desired) {
      let steering_force = new Vector(desired).sub(this.velocity)
      return steering_force.limit(this.max_force);
    } else {
      return new Vector(0, 0);
    }
  }
}