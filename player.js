Player = function(game) {
    this.game = game;
    this.guy = null;
    this.cursors = null;
    this.jumpSound = null;
    this.wasd = null;
};

Player.prototype = {

    preload: function() {

        // Load spritesheet and atlas
        this.game.load.atlas('guy', './assets/stickMan.png', './assets/stickMan.json');
        
    
    },
    
    create: function() {
        
        // Add sprite
        this.guy = this.game.add.sprite(300, this.game.world.height - 100, 'guy');
        
        // Add sprite animations
        this.guy.animations.add('runLeft', Phaser.Animation.generateFrameNames('left', 5, 1), 10, true);
        this.guy.animations.add('runRight', Phaser.Animation.generateFrameNames('right', 5, 1), 15, true);
        this.guy.animations.add('jumpRight', Phaser.Animation.generateFrameNames('rightJump', 1, 11), 2, true);
        this.guy.animations.add('jumpLeft', Phaser.Animation.generateFrameNames('leftJump', 1, 11), 2, true);
        
        // Player Camera
        this.game.camera.follow(this.guy);
        
        // Player Physics
        this.game.physics.arcade.enable(this.guy);
        this.guy.body.collideWorldBounds = true;
        this.guy.anchor.setTo(0.5, 0.5);
        this.guy.body.setSize(15, 52);
        
        // Create the keyboard cursor keys
        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.wasd = {
            up: this.game.input.keyboard.addKey(Phaser.Keyboard.W),
            left: this.game.input.keyboard.addKey(Phaser.Keyboard.A),
            right: this.game.input.keyboard.addKey(Phaser.Keyboard.D),
            down: this.game.input.keyboard.addKey(Phaser.Keyboard.S)
        }
        
        // Audio
        this.jumpSound = this.game.add.audio('jump');
        this.jumpSound.volume = 0.3;
        this.jumpSound.loop = false;
        
    },
    
    update: function() {
        
        this.guy.body.velocity.x = 0;
        
        // Player movement
        if (this.cursors.up.isDown && this.guy.body.touching.down || this.wasd.up.isDown && this.guy.body.touching.down) {
            
            this.guy.body.velocity.y = -305;
            this.guy.animations.stop();
            this.guy.frameName = 'rightJump5';
            this.jumpSound.play();
            
        }
        else if (this.cursors.down.isDown && this.guy.body.touching.down || this.wasd.down.isDown && this.guy.body.touching.down) {
            
            this.guy.animations.stop();
            this.guy.frameName = 'rightJump8';
            this.guy.body.height = 45;
            this.guy.y += 3.5;
            
        }
        else if (this.cursors.left.isDown || this.wasd.left.isDown) {
            
            this.guy.body.velocity.x = -150;
            this.guy.animations.play('runRight');
            
        }
        else if (this.cursors.right.isDown || this.wasd.right.isDown) {
            
            this.guy.body.velocity.x = 150;
            this.guy.animations.play('runRight');
            
        }
        else {
            
            this.guy.animations.play('runRight');
            this.guy.body.height = 52;
            
        }
        if (this.guy.y < 231) {
            
            this.guy.animations.stop();
            this.guy.frameName = 'rightJump5';
        }
    }
};