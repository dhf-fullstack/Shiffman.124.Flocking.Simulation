# Boids in Javascript

Recreating [Dan Shiffman's](https://shiffman.net/) [p5.js](https://p5js.org/) recreation of [Craig Reynold's](http://www.red3d.com/cwr/) ["Boids"](http://www.red3d.com/cwr/boids/) [flocking simulation](https://www.youtube.com/watch?v=mhjuuHl6qHM) from [Coding Train](https://thecodingtrain.com/) [Challenge #124](https://thecodingtrain.com/CodingChallenges/124-flocking-boids) in vanilla Javascript on a canvas.

Issues
1. Boids go offscreen too easily
2. As they try to converge on local average heading they slow down (when they have few local flockmates, they could return to their  cruising speed)
3. Obstacle avoidance should anticipate more. Is this a scale issue?
The boids are very large compared to the arena.
