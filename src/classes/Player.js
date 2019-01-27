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
       
    }

    attack(players){
        let attackHitbox = this.scene.add.zone(this.sprite.x + Math.cos(this.toRad(this.sprite.angle)) * 70 - 25, this.sprite.y + Math.sin(this.toRad(this.sprite.angle)) * 70 - 25).setSize(50,50);
        this.scene.physics.world.enable(attackHitbox);
        this.sprite.anims.play('attack-' + this.key);
        this.snip.play();
        attackHitbox.body.moves = false;

        players.forEach(curplayer => {
            if(curplayer != this){
                this.scene.physics.add.collider(attackHitbox, curplayer.sprite, function(){
                    if (!curplayer.invincible) {
                        curplayer.invincible = true;
                        curplayer.sprite.setAlpha(0.5);
                        let item = curplayer.pickRandomItem();
                        if(item != null) {
                            this.scene.throwItem(item, curplayer);
                            curplayer.removeItem(item);
                        }
                        setTimeout(() => {
                            curplayer.invincible = false;
                            curplayer.sprite.setAlpha(1);
                        }, 2000);
                    }
                }, undefined, this);
            }
        });
        setTimeout(() => {
            attackHitbox.destroy();
        }, 200);

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

} 