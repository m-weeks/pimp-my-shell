import 'phaser';

export default class Scene extends Phaser.Scene {
    preload() {
        this.load.image('arrow', 'assets/arrow.png')
    }

    create() {
        this.joyStick = this.plugins.get('rexVirtualJoyStick').add(this, {x: 150, y: this.game.config.height - 150, radius: 100})
        this.joyStick.on('update', this.handleJoyStickState, this);

        this.player = this.physics.add.sprite(100, 450, 'arrow');
        this.player.setCollideWorldBounds(true);
    }

    update() {

    }

    handleJoyStickState() {
        let angle = this.joyStick.angle;
        let force = this.joyStick.force;

        this.player.setAngle(angle);
        this.player.setVelocityX(force * Math.cos(angle * Math.PI/180));
        this.player.setVelocityY(force * Math.sin(angle * Math.PI/180));
    }
}