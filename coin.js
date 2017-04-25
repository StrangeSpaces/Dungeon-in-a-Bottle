Coin.prototype = Object.create(Entity.prototype);
Coin.prototype.parent = Entity.prototype;

function Coin(pos, vel) {
    Entity.call(this, 'coin');

    this.type = 'coin';

    this.pos.x = pos.x;
    this.pos.y = pos.y;

    this.vel.x = (Math.random() - 0.5) * 1.5;
    this.vel.y = -1;

    this.f = 0;
    this.c = 0;

    this.updateGraphics();
}

Coin.prototype.update = function() {
    this.vel.y += 0.1;

    this.c++;
    if (this.c % 6 == 0) {
        this.f++;
        if (this.f > 3) {
            this.f = 0;
        }
    }

    Entity.prototype.update.call(this);
};

Coin.prototype.updateGraphics = function() {
    this.frame.x = this.f*16;

    Entity.prototype.updateGraphics.call(this);
}

Money.prototype = Object.create(Entity.prototype);
Money.prototype.parent = Entity.prototype;

function Money(pos, vel) {
    Entity.call(this, 'money');

    this.type = 'money';

    this.pos.x = pos.x;
    this.pos.y = pos.y;

    this.size = new Vec(28, 8);

    this.frame.width = 64;

    this.updateGraphics();
}

Bottle.prototype = Object.create(Entity.prototype);
Bottle.prototype.parent = Entity.prototype;

function Bottle(pos, vel) {
    Entity.call(this, 'bottle');

    this.type = 'bottle';

    this.pos.x = pos.x;
    this.pos.y = pos.y;

    this.size = new Vec(0, 8);

    this.frame.width = 48;
    this.frame.height = 48;
    this.setFrame(0);

    this.updateGraphics();
}

Bottle.prototype.run = function() {
    this.c = (this.c || 5) + 1;
    if (this.c % 6 == 0) {
        if(this.f == 19) {
            currentLevel++;
            start();
        } else {
            this.setFrame(this.f + 1);
            if (this.f == 1) {
                inhale.play();
            } else if (this.f == 13) {
                inhale.pause();
                puff.play();
            } else if (this.f == 16) {
                jump.play();
            }
        }
    }
}

Bottle.prototype.setFrame = function(f) {
    this.frame.x = f % 5 * 48;
    this.frame.y = Math.floor(f / 5) * 48;
    this.f = f;

    this.updateGraphics();
}

