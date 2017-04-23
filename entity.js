function Vec(x,y) {
    this.x = x;
    this.y = y;
}

Vec.prototype.length = function() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
}

Vec.prototype.setLength = function(target) {
    if (target <= 0) {
        this.x = 0;
        this.y = 0;
        return;
    }

    var len = this.length();
    if (len == 0) {
        this.x = target;
    } else {
        this.x *= (target/len);
        this.y *= (target/len);
    }
}

function Entity(file) {
    this.pos = new Vec(100, 200);
    this.vel = new Vec(0, 0);
    this.offset = new Vec(0, 0);

    this.height = 0;

    this.frame = new PIXI.Rectangle(0, 0, 16, 16);
    this.sprite = new PIXI.Sprite(new PIXI.Texture(resources[file].texture, this.frame));

    this.sprite.anchor.x = 0.5;
    this.sprite.anchor.y = 0.5;

    mainContainer.addChild(this.sprite);
}

Entity.prototype.updateGraphics = function() {
    this.sprite.position.x = this.pos.x + this.offset.x;
    this.sprite.position.y = this.pos.y + this.offset.y;
    this.sprite.texture.frame = this.frame;
}

Entity.prototype.update = function() {
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;

    this.updateGraphics();
};