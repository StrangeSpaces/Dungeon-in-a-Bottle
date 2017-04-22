Tile.prototype = Object.create(Entity.prototype);
Tile.prototype.parent = Entity.prototype;

function Tile(x, y) {
    Entity.call(this);

    this.pos.x = x * 16;
    this.pos.y = y * 16;

    if (x == 0) {
        this.left = true;
    } else if (x == 19) {
        this.right = true;
    }
}

Tile.prototype.update = function() {
    if (this.left) {
        this.vel.x = leftVel;
    } else if (this.right) {
        this.vel.x = rightVel;
    }

    this.parent.update.call(this);
};