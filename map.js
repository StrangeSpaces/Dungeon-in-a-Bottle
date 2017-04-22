Tile.prototype = Object.create(Entity.prototype);
Tile.prototype.parent = Entity.prototype;

function Tile(x, y) {
    Entity.call(this);

    this.pos.x = x * 16;
    this.pos.y = y * 16;
}

Tile.prototype.update = function() {
    this.parent.update.call(this);
};