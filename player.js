Player.prototype = Object.create(Entity.prototype);
Player.prototype.parent = Entity.prototype;

function Player() {
    Entity.call(this);

    this.acc = 0.3;
    this.friction = 0.1;
    this.maxSpeed = 2;
    this.jumpAmount = 4;

    this.sprite.anchor.x = 0.5;
    this.sprite.anchor.y = 0.5;

    this.size = new Vec(8, 8);
    this.onGround = false;
};

Player.prototype.collide = function(leftOrRight) {
    for (var i = entities.length - 1; i >= 1; i--) {
        var ent = entities[i];
        if (this.pos.x - this.size.x < ent.pos.x+16 &&
            this.pos.x + this.size.x > ent.pos.x &&
            this.pos.y - this.size.y < ent.pos.y+16 &&
            this.pos.y + this.size.y > ent.pos.y) {

            if (leftOrRight) {
                if (this.pos.x - (ent.pos.x + 8) > 0) {
                    this.pos.x = ent.pos.x + 16 + this.size.x;
                } else {
                    this.pos.x = ent.pos.x - this.size.x;
                }
            } else {
                if (this.pos.y - (ent.pos.y + 8) > 0) {
                    this.pos.y = ent.pos.y + 16 + this.size.y;
                } else {
                    this.pos.y = ent.pos.y - this.size.y;
                }
            }

            this.onCollide(leftOrRight);
        }
    }
};

Player.prototype.onCollide = function(leftOrRight) {
    if (leftOrRight) {
        this.vel.x = 0;
    } else {
        this.vel.y = 0;
        this.onGround = true;
    }
};

Player.prototype.update = function() {
    if (Key.isDown(Key.UP)) {
        if (this.onGround) this.vel.y = -this.jumpAmount;
    } else if (this.vel.y < 0) {
        this.vel.y *= 0.25;
    }

    if (Key.isDown(Key.LEFT)) this.vel.x -= this.acc;
    if (Key.isDown(Key.RIGHT)) this.vel.x += this.acc;

    if (Math.abs(this.vel.x) <= this.friction) {
        this.vel.x = 0;
    } else {
        this.vel.x -= Math.sign(this.vel.x) * this.friction;
    }

    if (this.vel.x < -this.maxSpeed) {
        this.vel.x = -this.maxSpeed;
    } else if (this.vel.x > this.maxSpeed) {
        this.vel.x = this.maxSpeed;
    }

    this.vel.y += 0.1;

    this.frame.x += 0.25;
    if (this.frame.x + 16 >= 64) {
        this.frame.x = 0;
    }

    this.onGround = false;
    this.pos.x += this.vel.x;
    this.collide(true);
    this.pos.y += this.vel.y;
    this.collide(false);

    this.updateGraphics();
};