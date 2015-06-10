Level = function(game) {
    this.game = game;
    this.movingGround = null;
    this.cloudSmall = null;
    this.cloudBig = null;
};

Level.prototype = {

    preload: function() {
        
        this.game.load.image('background', './assets/chalkboard.png');
        this.game.load.image('movingGround', './assets/ground.png');
        this.game.load.image('smallCloud', './assets/cloud2.png');
        this.game.load.image('bigCloud', './assets/cloud1.png');
        
    },
    
    create: function() {

        this.game.physics.arcade.gravity.y = 500;
        
        this.bg = this.game.add.tileSprite(0, 0, 800, 320, 'background');
        
        // Making the ground and then making it move
        this.movingGround = this.game.add.tileSprite(0, this.game.world.height - 30, 800, 33, 'movingGround');
        this.movingGround.physicsType = Phaser.SPRITE;
        this.game.physics.arcade.enable(this.movingGround);
        this.movingGround.body.immovable = true;
        this.movingGround.body.allowGravity = false;
        this.movingGround.body.setSize(800, 32);
        
        // Making the big cloud
        this.cloudBig = this.game.add.sprite(450, 25, 'bigCloud');
        this.game.physics.enable(this.cloudBig, Phaser.Physics.ARCADE);
        this.cloudBig.body.allowGravity = false;
        this.cloudBig.name = 'big';
        this.cloudBig.checkWorldBounds = true;
        this.cloudBig.events.onOutOfBounds.add(this.cloudOut, this);
        this.cloudBig.body.velocity.x = -75;
        
        // Making the small cloud
        this.cloudSmall = this.game.add.sprite(400, 75, 'smallCloud');
        this.game.physics.enable(this.cloudSmall, Phaser.Physics.ARCADE);
        this.cloudSmall.body.allowGravity = false;
        this.cloudSmall.name = 'small';
        this.cloudSmall.checkWorldBounds = true;
        this.cloudSmall.events.onOutOfBounds.add(this.cloudOut, this);
        this.cloudSmall.body.velocity.x = -100;
        
        letters.create();
        
        player.create();
        
        word.create();
        
    },
    
    // Callback that resets the cloud's X coordinates for scroll effect
    cloudOut: function(cloud) {
        cloud.reset(775, cloud.y);
        if (cloud.name == 'big') {
            cloud.body.velocity.x = -75;
        }
        else {
            cloud.body.velocity.x = -100;
        }
    },
    
    update: function() {
        
        player.update();
        
        letters.update();
        
        this.movingGround.tilePosition.x -=1.5;
        
    }
};