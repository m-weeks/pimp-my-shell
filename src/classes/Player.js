export default class Player {
    constructor(sprite, scene){
        this.sprite = sprite;
        this.scene = scene;
    }

    attack(){
        let attackHitbox = this.scene.add.zone(this.sprite.x, this.sprite.y).setSize(50,50);
        this.scene.physics.world.enable(attackHitbox);
        attackHitbox.body.moves = false;
    }
} 