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

