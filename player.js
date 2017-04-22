Player.prototype = Object.create(Entity.prototype);
Player.prototype.parent = Entity.prototype;

function Player() {
    Entity.call(this);

    this.acc = 0.3;
    this.friction = 0.1;
    this.maxSpeed = 2;
}

Player.prototype.update = function() {
    if (Key.isDown(Key.UP)) this.vel.y -= this.acc;
    if (Key.isDown(Key.LEFT)) this.vel.x -= this.acc;
    if (Key.isDown(Key.DOWN)) this.vel.y += this.acc;
    if (Key.isDown(Key.RIGHT)) this.vel.x += this.acc;

    this.vel.setLength(Math.min(this.vel.length() - this.friction, this.maxSpeed));

    this.frame.x += 0.25;
    if (this.frame.x + 16 >= 64) {
        this.frame.x = 0;
    }

    this.parent.update.call(this);
};