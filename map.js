Tile.prototype = Object.create(Entity.prototype);
Tile.prototype.parent = Entity.prototype;

function Tile(x, y, side) {
    Entity.call(this);

    this.type = 'tile';

    this.pos.x = x * 16;
    this.pos.y = y * 16;

    if (side == 'left') {
        this.left = true;
    } else if (side == 'right') {
        this.right = true;
    }
}

Tile.prototype.update = function() {
    if (this.left) {
        this.vel.x = leftVel;
    } else if (this.right) {
        this.vel.x = rightVel;
    }

    Entity.prototype.update.call(this);
};

Spike.prototype = Object.create(Tile.prototype);
Spike.prototype.parent = Tile.prototype;
function Spike(x, y, side) {
    console.log('here')
    Tile.call(this, x, y, side);

    console.log(side);

    this.type = 'spike';
}

Spike.prototype.update = function() {
    Tile.prototype.update.call(this);
};
