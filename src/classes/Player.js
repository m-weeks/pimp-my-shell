import { POWER_TYPE_SPEED } from "../constants";

export default class Player {
    constructor(sprite, scene){
        this.sprite = sprite;
        this.scene = scene;
        this.invincible = false;
        this.key = sprite.texture.key

        this.sprite.setScale(0.25,0.25);

        this.snip = scene.sound.add('snip');
        this.pop = scene.sound.add('pop');
        this.thud = scene.sound.add('thud');
        this.rocket = scene.sound.add('rocket');

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
            frameRate: 6,
            duration: 500,
            repeat: 0            
        });
        this.sprite.on('animationcomplete', function(animation) {
            if (animation == this.attackanim) {
                this.attacking = false;
            }
        }, this);
        
        this.sprite.anims.play('still-' + this.key);

        this.furnitureInventory = {
            plant: null,
            lamp: null,
            rug: null,
            bookshelf: null,
            couch: null,
            antenna: null,
            tv: null,
            art: null
        };

        this.powerUps = {
            rocket: null
        };

        this.dustEmitter = this.scene.add.particles('cloud').createEmitter({
            scale: { start: 1, end: 0 },
            speed: 100,
            quantity: 1,
            lifeSpan: 400,
            follow: this.sprite,
            on: false
        });
    }

    attack(players){
        let attackHitbox = this.scene.add.zone(this.sprite.x + Math.cos(this.toRad(this.sprite.angle)) * 70 - 25, this.sprite.y + Math.sin(this.toRad(this.sprite.angle)) * 70 - 25).setSize(50,50);
        this.scene.physics.world.enable(attackHitbox);
        this.sprite.anims.play('attack-' + this.key);
        this.snip.play();
        attackHitbox.body.moves = false;
        this.attacking = true;

        players.forEach(curplayer => {
            if(curplayer != this){
                this.scene.physics.add.overlap(attackHitbox, curplayer.sprite, function(){
                    curplayer.hit(this);
                }, undefined, this);
            }
        });
        setTimeout(() => {
            attackHitbox.destroy();
        }, 100);
    }

    hit(hitter) {
        if (!this.invincible) {
            this.invincible = true;
            this.sprite.setAlpha(0.5);
            this.knockBack(hitter.sprite.angle);
            let item = this.pickRandomItem();
            if(item != null) {
                this.scene.throwItem(item, this);
                this.removeItem(item);
            }
            setTimeout(() => {
                this.invincible = false;
                this.sprite.setAlpha(1);
            }, 2000);
        }
    }

    knockBack(angle) {
        angle = this.toRad(angle);
        let x = this.sprite.x + Math.cos(angle) * 150;
        let y = this.sprite.y + Math.sin(angle) * 150;
        this.scene.tweens.add({
            targets: this.sprite, 
            duration: 750,
            ease: 'Quart.easeOut',
            x: x,
            y: y
        });
    }

    move(angle,force){
        if (angle != 0) {
            this.sprite.setAngle(angle);
        }

        if (force != 0){
            if(!this.attacking) {
                this.sprite.anims.play('walk-' + this.key, true);
            }
        }else{
            this.sprite.anims.play('still-' + this.key);
        }
    
        if(this.speedBoost) {
            this.sprite.setVelocityX(this.speedBoost * Math.cos(this.toRad(this.sprite.angle)));
            this.sprite.setVelocityY(this.speedBoost * Math.sin(this.toRad(this.sprite.angle)));
        }
        else {
            this.sprite.setVelocityX(force * Math.cos(this.toRad(this.sprite.angle)));
            this.sprite.setVelocityY(force * Math.sin(this.toRad(this.sprite.angle)));
        }
    }

    toRad(degrees){
        return degrees * (Math.PI / 180);
    }

    addToFurnitureInventory(item) {
        //check if the item is better than the one in the inventory
        var currentItem = this.findFurnitureByType(item.item.type);
        
        if (!currentItem) {
            this.furnitureInventory[item.item.type] = item;
            this.pop.play();
            //Tell it to ditch the item picked up
            return item;
        } 

        if(currentItem.item.fanciness < item.item.fanciness 
            || (currentItem.item.fanciness == item.item.fanciness && currentItem.item.points < item.item.points)){
            this.furnitureInventory[item.item.type] = item;
            this.pop.play();
            // Return the item to put back in the scene
            return currentItem;
        }
        //Don't do anything
        return null;
    }

    addToPowerups(item) {
        if(!this.powerUps[item.type]) {
            this.powerUps[item.type] = true;
            item.destroy();
        }
    }

    findFurnitureByType(type) {
        return this.furnitureInventory[type];
    }

    getScore() {
        var score = 0;
        for (var prop in this.furnitureInventory){
            score += Math.floor(this.furnitureInventory[prop] ? this.furnitureInventory[prop].item.points : 0);
        }

        return score;
    }

    pickRandomItem() {
        let keys = Object.keys(this.furnitureInventory);
        // randomize keys
        keys.sort(function() { return 0.5 - Math.random()});
        let result = null;
        for (let i = 0; i < keys.length; i++){
            if(this.furnitureInventory[keys[i]] != null) {
                result = this.furnitureInventory[keys[i]];
            }
        }
        return result;
    }

    removeItem(item) {
        for (let prop in this.furnitureInventory) {
            if (item == this.furnitureInventory[prop]) {
                this.furnitureInventory[prop] = null;
            }
        }
    }

    usePower(power, players) {
        switch (power) {
            case POWER_TYPE_SPEED:
                if (this.powerUps.rocket) {
                    this.applySpeedBoost(players);
                    this.powerUps.rocket = null;
                }
                break;
        }
    }

    applySpeedBoost(players){
        this.speedBoost = 500;
        this.dustEmitter.setAngle({ min: this.sprite.angle - 225, max: this.sprite.angle + 225 });
        this.dustEmitter.start();
        this.rocket.play();
        this.move(this.sprite.angle, this.speedBoost);
        let player = this;
        let overlaps = [];
        players.forEach(curplayer => {
            if(curplayer != this){
                let overlap = this.scene.physics.add.overlap(this.sprite, curplayer.sprite, function(){
                    curplayer.hit(this);
                }, undefined, this);
                overlaps.push(overlap);
            }
        });
        setTimeout(function() {
            player.speedBoost = undefined;
            player.dustEmitter.stop();
            player.sprite.setVelocityX(0);
            player.sprite.setVelocityY(0);
            player.rocket.stop();
            overlaps.forEach(function(overlap) {
                overlap.destroy();
            });
        }, 3000);

    }
} 