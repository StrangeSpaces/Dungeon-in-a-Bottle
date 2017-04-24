Player.prototype = Object.create(Entity.prototype);
Player.prototype.parent = Entity.prototype;

function Player() {
    Entity.call(this, 'pact');

    this.f = 0;
    this.counter = 0;
    this.anim = "idle";
    this.default = "idle";

    this.anims = {
        "idle":[0, 1, 2, 3, 4, 5],
        "run":[6, 7, 8, 9, 10, 11],
        "jump":[12, 12],
        "walljump":[19, 20, 21],
        "up":[13,14],
        "down":[15,16],
        "slide":[18],
        "super":[24, 25],
        "rebound":[26,27],
        "rejump":[28,29],
        "airfail": [22, 23],
        "wallfail": [30, 31],
        "getup": [32, 33, 34, 35],
    }

    this.sprite.visible = false;
    this.frame.width = 32;
    this.frame.height = 32;
    this.updateGraphics();

    this.acc = 0.3;
    this.friction = {
        true: 0.1,
        false: 0.02
    };
    this.maxSpeed = {
        true: 3,
        false: 2
    };
    this.jumpAmount = 4;
    this.gravity = 0.15;

    this.size = new Vec(7, 13);
    this.offset.y = -3;

    this.onGround = false;
    this.leftWall = false;
    this.rightWall = false;
    this.pushLeft = false;
    this.pushRight = false;

    this.leftLock = 0;
    this.rightLock = 0;

    this.letGo = false;

    this.won = false;
    this.resCount = 0;
    this.startCount = 18;
};

Player.prototype.win = function() {
    this.won = true;
    this.resCount = 12;
    for (var i = entities.length - 1; i >= 0; i--) {
        if (entities[i].type == 'door') {
            entities[i].setTile(entities[i].tile + 64);
        }
    }
    this.updateGraphics();
}

Player.prototype.collide = function(leftOrRight) {
    for (var i = entities.length - 1; i >= 1; i--) {
        var ent = entities[i];
        var c = 0;
        while (this.pos.x - this.size.x < ent.pos.x+ent.size.x &&
            this.pos.x + this.size.x > ent.pos.x-ent.size.x &&
            this.pos.y - this.size.y < ent.pos.y+ent.size.y &&
            this.pos.y + this.size.y > ent.pos.y-ent.size.y) {

            if (ent.type == 'enter' || ent.type == 'torch') {
                break;
            }

            if (ent.type == 'spike') {
                start();
                return
            }
            if (ent.type == 'door' && !this.won) {
                if (this.onGround) this.win();
                return
            }

            if (leftOrRight) {
                if (this.pos.x - ent.pos.x > 0) {
                    this.pos.x = ent.pos.x + ent.size.x + 0.0001 + this.size.x;
                    this.leftWall = true;
                    if (ent.left) this.pushLeft = true;
                } else {
                    this.pos.x = ent.pos.x - ent.size.x - this.size.x;
                    this.rightWall = true;
                    if (ent.right) this.pushRight = true;
                }
            } else {
                if (this.pos.y - ent.pos.y > 0) {
                    this.pos.y = ent.pos.y + ent.size.y + this.size.y;
                } else {
                    this.pos.y = ent.pos.y - ent.size.y - this.size.y;
                }
            }

            this.onCollide(leftOrRight, ent);
            c++;
            if (c > 1) {
                console.log("Multiple");
            }
        }
    }
};

Player.prototype.onCollide = function(leftOrRight, ent) {
    if (leftOrRight) {
        if (this.leftWall && this.rightWall) {
            start();
        }

        if (this.anim == "rebound") {
            if (this.leftWall) {
                this.vel.x = -2;
            } else {
                this.vel.x = 2;
            }
        } else if (this.anim == "airfail") {
            this.playAnim("wallfail");
            this.default = "wallfail";
            if (this.leftWall) {
                this.vel.x = -2;
            } else {
                this.vel.x = 2;
            }
        } else {
            if (this.anim == "run") {
                if (this.pushLeft) {
                    leftVel = -0.25;
                    this.vel.x = -0.25;
                } else if (this.pushRight) {
                    rightVel = 0.25;
                    this.vel.x = 0.25;
                } else {
                    this.vel.x = ent.vel.x;
                }
            } else {
                if (this.leftWall) {
                    this.vel.x = ent.vel.x - 0.05;
                } else {
                    this.vel.x = ent.vel.x + 0.05;
                }
            }
        }

        if (this.anim == "super") {
            this.playAnim("rebound");

            if (this.leftWall) {
                this.vel.x = -2;
            } else {
                this.vel.x = 2;
            }
        }
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

Player.prototype.fall = function() {
    this.vel.y += this.gravity;
    if (!this.onGround && this.vel.y > 0 && this.anim != "super" && this.anim != "airfail") {
        this.playAnim("down");
        this.default = "down";
    }
}

Player.prototype.update = function() {
    if (this.startCount > 0) {
        this.startCount--;
        if (this.startCount <= 0) {
            this.sprite.visible = true;
            for (var i = entities.length - 1; i >= 0; i--) {
                if (entities[i].type == 'enter') {
                    entities[i].setTile(entities[i].tile - 54 - 14 * 4);
                }
            }
        } else if (this.startCount % 6 == 0) {
            for (var i = entities.length - 1; i >= 0; i--) {
                if (entities[i].type == 'enter') {
                    entities[i].setTile(entities[i].tile + 4);
                }
            }
        }
        return
    }
    if (this.won) {
        this.resCount--;
        if (this.resCount == 0) {
            currentLevel++;
            start();
        }
        else if (this.resCount % 6 == 0) {
            for (var i = entities.length - 1; i >= 0; i--) {
                if (entities[i].type == 'door') {
                    entities[i].setTile(entities[i].tile + 4);
                }
            }
        }
        return;
    }

    if (Math.abs(this.vel.x) <= this.friction[this.onGround]) {
        this.vel.x = 0;
    } else {
        this.vel.x -= Math.sign(this.vel.x) * this.friction[this.onGround];
    }

    if (this.onGround) {
        if (this.anim == "wallfail" || this.anim == "airfail") {
            this.playAnim("getup");
            this.default = "idle";
        }

        if (this.anim != "getup") {
            if (Key.isDown(Key.LEFT) || Key.isDown(Key.RIGHT)) {
                if (Key.isDown(Key.LEFT)) {
                    this.sprite.scale.x = -1;
                } else {
                    this.sprite.scale.x = 1;
                }
                this.playAnim("run");
                this.default = "run";
            } else {
                this.playAnim("idle");
                this.default = "idle";
            }
        }
    }

    if (Key.isDown(Key.UP)) {
        if (this.letGo == true) {
            if (["airfail", "wallfail", "rebound", "getup"].indexOf(this.anim) == -1) {
                if (this.onGround) {
                    this.vel.y = -this.jumpAmount;

                    this.playAnim("up");
                    this.default = "up";
                } else if (this.leftWall) {
                    this.vel.y = -this.jumpAmount * 0.9;
                    this.vel.x = this.maxSpeed[this.anim == "rejump"];
                    this.leftLock = 20;
                    if (this.pushLeft) leftVel = -0.5;

                    this.playAnim("walljump");
                    this.default = "up";
                } else if (this.rightWall) {
                    this.vel.y = -this.jumpAmount * 0.9;
                    this.vel.x = -this.maxSpeed[this.anim == "rejump"];
                    this.rightLock = 20;
                    if (this.pushRight) rightVel = 0.5;

                    this.playAnim("walljump");
                    this.default = "up";
                } else {
                    this.playAnim("super");
                }
            }
        }
        this.letGo = false;
    } else {
        this.letGo = true;
        // if (this.vel.y < 0) this.vel.y *= 0.5;
    }

    if (["airfail", "wallfail", "rebound", "getup"].indexOf(this.anim) == -1) {
        if (Key.isDown(Key.LEFT) && this.leftLock <= 0) this.vel.x -= this.acc;
        if (Key.isDown(Key.RIGHT) && this.rightLock <= 0) this.vel.x += this.acc;
    }

    if (Key.isDown(Key.R)) {
        if (this.d) start();
    } else {
        this.d = true;
    }

    if (this.vel.x < -this.maxSpeed[this.anim == "rejump"]) {
        this.vel.x = -this.maxSpeed[this.anim == "rejump"];
    } else if (this.vel.x > this.maxSpeed[this.anim == "rejump"]) {
        this.vel.x = this.maxSpeed[this.anim == "rejump"];
    }

    this.leftLock--;
    this.rightLock--;

    if ((this.leftWall || this.rightWall) && !this.onGround) {
        if (this.anim == "wallfail") {
            if (this.leftWall) {
                this.sprite.scale.x = -1;
            } else {
                this.sprite.scale.x = 1;
            }
            this.vel.y += this.gravity;
        } else if (this.anim == "rebound") {
            this.vel.y = 0;

            if (this.leftWall) {
                this.sprite.scale.x = -1;
                this.offset.x = 5;
            } else {
                this.sprite.scale.x = 1;
                this.offset.x = -5;
            }
        } else if (this.vel.y >= 0) {
            this.vel.y += this.gravity / 2;

            this.playAnim("slide");
            this.default = "slide";
            if (this.leftWall) {
                this.sprite.scale.x = 1;
                this.offset.x = -2;
            } else {
                this.sprite.scale.x = -1;
                this.offset.x = 2;
            }
        } else {
            this.fall();
        }
    } else {
        this.fall();
    }

    this.onGround = false;
    this.leftWall = false;
    this.rightWall = false;
    this.pushLeft = false;
    this.pushRight = false;

    this.pos.x += this.vel.x;
    this.collide(true);
    this.collide(true);

    this.pos.y += this.vel.y;
    this.collide(false);

    this.updateGraphics();
};

Player.prototype.updateGraphics = function() {
    if (this.won) {
        this.sprite.visible = false;
        return;
    }

    this.counter++;
    if (this.counter >= 6) {
        this.counter = 0;
        this.f++;

        if (this.anims[this.anim].length <= this.f) {
            if (this.anim == "rebound") {
                this.playAnim("rejump");
                this.default = "up";

                if (this.leftWall) {
                    this.vel.y = -this.jumpAmount * 1.2;
                    this.vel.x = this.maxSpeed[this.anim == "rejump"];
                    this.leftLock = 25;
                    if (this.pushLeft) leftVel = -0.75;
                } else {
                    this.vel.y = -this.jumpAmount * 1.2;
                    this.vel.x = -this.maxSpeed[this.anim == "rejump"];
                    this.rightLock = 25;
                    if (this.pushRight) rightVel = 0.75;
                }

                this.sprite.scale.x *= -1;
            } else if (this.anim == "super") {
                this.playAnim("airfail");
                this.default = "airfail";
            } else {
                this.f = 0;
                this.anim = this.default;
            }
        }
    }

    if (this.anim != "slide" && this.anim != "rebound") {
        this.offset.x = 0;
    }

    var frame = this.anims[this.anim][this.f];
    this.frame.x = frame % 6 * 32;
    this.frame.y = Math.floor(frame / 6) * 32;

    Entity.prototype.updateGraphics.call(this);
}
