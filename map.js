Tile.prototype = Object.create(Entity.prototype);
Tile.prototype.parent = Entity.prototype;

function Tile(x, y, side) {
    Entity.call(this, 'tiles');

    this.type = 'tile';

    this.pos.x = x * 16 + 8;
    this.pos.y = y * 16 + 8;

    this.startX = this.pos.x;

    this.size = new Vec(8, 8);

    if (side == 'left') {
        this.left = true;
    } else if (side == 'right') {
        this.right = true;
    }

    this.setTile(0);
}

Tile.prototype.setTile = function(tile) {
    this.frame.x = tile % 14 * 16;
    this.frame.y = Math.floor(tile / 14) * 16;
    this.tile = tile;

    this.updateGraphics();
}

Tile.prototype.update = function() {
    if (this.left) {
        this.vel.x = leftVel;
    } else if (this.right) {
        this.vel.x = rightVel;
    }

    Entity.prototype.update.call(this);

    if (this.left && this.pos.x < this.startX) {
        this.pos.x = this.startX;
        Entity.prototype.update.call(this);
    } else if (this.right && this.pos.x > this.startX) {
        this.pos.x = this.startX;
        Entity.prototype.update.call(this);
    }
};

Spike.prototype = Object.create(Tile.prototype);
Spike.prototype.parent = Tile.prototype;
function Spike(x, y, side) {
    Tile.call(this, x, y, side);

    this.type = 'spike';
    this.size.x = 7;
    this.size.y = 7;
}

Spike.prototype.update = function() {
    Tile.prototype.update.call(this);
};

Torch.prototype = Object.create(Tile.prototype);
Torch.prototype.parent = Tile.prototype;
function Torch(x, y, side) {
    Tile.call(this, x, y, side);

    this.type = 'torch';
    this.counter = 0;
}

Torch.prototype.update = function() {
    this.counter++;
    if (this.counter % 6 == 0) {
        if (this.counter % 24 == 0) {
            this.setTile(this.tile - 32);
        } else if (this.counter % 24 == 18) {
            this.setTile(this.tile + 28);
        } else {
            this.setTile(this.tile + 2);
        }
    }
    Tile.prototype.update.call(this);
};
