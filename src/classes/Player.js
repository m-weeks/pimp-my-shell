export default class Player {
    constructor(sprite, scene){
        this.sprite = sprite;
        this.scene = scene;
        this.invincible = false;
        this.key = sprite.texture.key

        this.sprite.setScale(0.25,0.25);

        this.walkanim = scene.anims.create({
            key: 'walk-' + this.key,
            frames: scene.anims.generateFrameNumbers(this.key, { start: 1, end: 2 }),
            frameRate: 6,
            repeat: -1
        });

        this.stillanim = scene.anims.create({
            key: 'still-' + this.key,
            frames: scene.anims.generateFrameNumbers(this.key, { start: 1, end: 1 }),
            frameRate: 0,
            repeat: -1
        });


        this.attackanim = scene.anims.create({
            key: 'attack-' + this.key,
            frames: scene.anims.generateFrameNumbers(this.key, { start: 0, end: 1 }),
            frameRate: 4,
            duration: 500,
            repeat: 0
        });
        
        this.sprite.anims.play('still-' + this.key);
    }

    attack(players){
        let attackHitbox = this.scene.add.zone(this.sprite.x + Math.cos(this.toRad(this.sprite.angle)) * 70 - 25, this.sprite.y + Math.sin(this.toRad(this.sprite.angle)) * 70 - 25).setSize(50,50);
        this.scene.physics.world.enable(attackHitbox);
        this.sprite.anims.play('attack-' + this.key);
        attackHitbox.body.moves = false;

        players.forEach(curplayer => {
            if(curplayer != this){
                this.scene.physics.add.collider(attackHitbox, curplayer.sprite, function(){
                    if (!curplayer.invincible) {
                        console.log("hit")
                        curplayer.invincible = true;
                        curplayer.sprite.setAlpha(0.5);
                        setTimeout(() => {
                            curplayer.invincible = false;
                            curplayer.sprite.setAlpha(1);
                        }, 2000);
                    }
                });
            }
        });
        setTimeout(() => {
            attackHitbox.destroy();
        }, 100);

    }

    move(angle,force){
        if (force != 0){
            this.sprite.anims.play('walk-' + this.key, true);
        }else{
            this.sprite.anims.play('still-' + this.key);
        }

        if (angle != 0) {
            this.sprite.setAngle(angle);
        }
        this.sprite.setVelocityX(force * Math.cos(angle * Math.PI/180));
        this.sprite.setVelocityY(force * Math.sin(angle * Math.PI/180));
    }

    toRad(degrees){
        return degrees * (Math.PI / 180);
    }
} 