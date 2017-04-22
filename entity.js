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

function Entity() {
    this.pos = new Vec(200, 200);
    this.vel = new Vec(0, 0);

    this.height = 0;

    this.frame = new PIXI.Rectangle(0, 0, 16, 16);
    this.sprite = new PIXI.Sprite(new PIXI.Texture(resources.bunny.texture, this.frame)); 

    mainContainer.addChild(this.sprite);
}

Entity.prototype.updateGraphics = function() {
    this.sprite.position.x = this.pos.x;
    this.sprite.position.y = this.pos.y;
    this.sprite.texture.frame = this.frame;
}

Entity.prototype.update = function() {
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;

    this.updateGraphics();
};