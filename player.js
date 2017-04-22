Player.prototype = Object.create(Entity.prototype);
Player.prototype.parent = Entity.prototype;

function Player() {
    Entity.call(this, 'pact');

    this.frame.width = 32;
    this.frame.height = 32;

    this.f = 0;
    this.counter = 0;
    this.anim = "idle";
    this.default = "idle";

    this.anims = {
        "idle":[0, 1, 2, 3, 4, 5],
        "run":[6, 7, 8, 9, 10, 11],
        "jump":[12, 12],
        "up":[13,14],
        "down":[15,16],
    }

    this.acc = 0.3;
    this.friction = {
        true: 0.1,
        false: 0.02
    };
    this.maxSpeed = 2;
    this.jumpAmount = 4;
    this.gravity = 0.15;

    this.sprite.anchor.x = 0.5;
    this.sprite.anchor.y = 0.5;

    this.size = new Vec(7, 16);
    this.onGround = false;
    this.leftWall = false;
    this.rightWall = false;
    this.pushLeft = false;
    this.pushRight = false;

    this.leftLock = 0;
    this.rightLock = 0;

    this.letGo = false;
};

Player.prototype.collide = function(leftOrRight) {
    for (var i = entities.length - 1; i >= 1; i--) {
        var ent = entities[i];
        var c = 0;
        while (this.pos.x - this.size.x < ent.pos.x+16 &&
            this.pos.x + this.size.x > ent.pos.x &&
            this.pos.y - this.size.y < ent.pos.y+16 &&
            this.pos.y + this.size.y > ent.pos.y) {

            if (ent.type == 'spike') start();

            if (leftOrRight) {
                if (this.pos.x - (ent.pos.x + 8) > 0) {
                    this.pos.x = ent.pos.x + 16.0001 + this.size.x;
                    this.leftWall = true;
                    if (ent.left) this.pushLeft = true;
                } else {
                    this.pos.x = ent.pos.x - this.size.x;
                    this.rightWall = true;
                    if (ent.right) this.pushRight = true;
                }
            } else {
                if (this.pos.y - (ent.pos.y + 8) > 0) {
                    this.pos.y = ent.pos.y + 16 + this.size.y;
                } else {
                    this.pos.y = ent.pos.y - this.size.y;
                }
            }

            this.onCollide(leftOrRight);
            c++;
            if (c > 1) {
                console.log("Multiple");
            }
        }
    }
};

Player.prototype.onCollide = function(leftOrRight) {
    if (leftOrRight) {
        if (this.leftWall && this.rightWall) start();
        // if (this.leftWall) {
        //     this.vel.x = Math.max(this.vel.x, leftVel);
        // } else {
        //     this.vel.x = Math.min(this.vel.x, rightVel);
        // }
    } else {
        this.vel.y = 0;
        this.onGround = true;
        this.leftLock = 0;
        this.rightLock = 0;
    }
};

Player.prototype.playAnim = function(anim) {
    if (anim != this.anim) {
        this.anim = anim;
        this.f = 0;
        this.counter = 0;
    }
}

Player.prototype.update = function() {
    if (Math.abs(this.vel.x) <= this.friction[this.onGround]) {
        this.vel.x = 0;
        if (this.onGround) {
            this.playAnim("idle");
            this.default = "idle";
        }
    } else {
        this.vel.x -= Math.sign(this.vel.x) * this.friction[this.onGround];
        if (this.onGround) {
            this.playAnim("run");
            this.default = "run";
        }
    }

    if (Key.isDown(Key.UP)) {
        if (this.letGo == true) {
            this.playAnim("jump");
            this.default = "up";

            if (this.onGround) {
                this.vel.y = -this.jumpAmount;
                console.log("jump");
            } else if (this.leftWall) {
                this.vel.y = -this.jumpAmount * 0.9;
                this.vel.x = this.maxSpeed;
                this.leftLock = 20;
                if (this.pushLeft) leftVel = -0.5;
            } else if (this.rightWall) {
                this.vel.y = -this.jumpAmount * 0.9;
                this.vel.x = -this.maxSpeed;
                this.rightLock = 20;
                if (this.pushRight) rightVel = 0.5;
            }
        }
        this.letGo = false;
    } else {
        this.letGo = true;
        // if (this.vel.y < 0) this.vel.y *= 0.25;
    }

    if (Key.isDown(Key.LEFT) && this.leftLock <= 0) this.vel.x -= this.acc;
    if (Key.isDown(Key.RIGHT) && this.rightLock <= 0) this.vel.x += this.acc;
    if (Key.isDown(Key.R)) {
        if (this.d) start();
    } else {
        this.d = true;
    }

    if (this.vel.x < -this.maxSpeed) {
        this.vel.x = -this.maxSpeed;
    } else if (this.vel.x > this.maxSpeed) {
        this.vel.x = this.maxSpeed;
    }

    this.leftLock--;
    this.rightLock--;

    this.vel.y += this.gravity;
    if (!this.onGround && this.vel.y > 0) {
        this.playAnim("down");
        this.default = "down";
    }

    this.onGround = false;
    this.leftWall = false;
    this.rightWall = false;
    this.pushLeft = false;
    this.pushRight = false;

    this.pos.x += this.vel.x;
    this.collide(true);

    this.pos.y += this.vel.y;
    this.collide(false);

    this.updateGraphics();
};

Player.prototype.updateGraphics = function() {
    this.counter++;
    if (this.counter >= 6) {
        this.counter = 0;
        this.f++;
        if (this.anims[this.anim].length <= this.f) {
            this.f = 0;
            this.anim = this.default;
        }
    }

    if (this.vel.x < 0) {
        this.sprite.scale.x = -1;
    } else if (this.vel.x > 0) {
        this.sprite.scale.x = 1;
    }

    var frame = this.anims[this.anim][this.f];
    this.frame.x = frame % 6 * 32;
    this.frame.y = Math.floor(frame / 6) * 32;

    Entity.prototype.updateGraphics.call(this);
}
