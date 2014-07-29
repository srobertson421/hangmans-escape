Level = function(game) {
    this.game = game;
    this.movingGround = null;
    this.cloudSmall = null;
    this.cloudBig = null;
};

Level.prototype = {

    preload: function() {
        
        this.game.load.image('movingGround', './assets/ground.png');
        this.game.load.image('tiles', './assets/Tilesheet.png');
        this.game.load.image('smallCloud', './assets/cloud2.png');
        this.game.load.image('bigCloud', './assets/cloud1.png');
        
    },
    
    create: function() {
        
        // Starting the physics for the level
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.gravity.y = 500;
        
        // Making the ground and then making it move
        this.movingGround = this.game.add.tileSprite(0.5, 0.5, 800, 320, 'movingGround');
        this.game.physics.enable(this.movingGround, Phaser.Physics.ARCADE);
        this.movingGround.body.immovable = true;
        this.movingGround.body.allowGravity = false;
        this.movingGround.body.setSize(800, 33, 0, 287);
        
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
        
        this.movingGround.tilePosition.x -=1.5;
        
    }
    
    
};