var game = new Phaser.Game(800, 320, Phaser.AUTO, 'game');

var player = null;
var level = null;
var letters = null;
var word = null;
var enterKey = null;

// Boot state
var boot_state = {
    
    preload: function() {
        
        game.load.image('progressBar', 'assets/progressBar.png');
        
    },
    
    create: function() {
        
        game.stage.backgroundColor = '000000';
        game.input.maxPointers = 1;
        game.physics.startSystem(Phaser.Physics.ARCADE);
            
        // set the type of scaling to "show-all"
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        // Add a blue color to the page, to hide the white borders we might have
        document.body.style.backgroundColor = '000';
        
        // Center the game on the screen
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;

        // Appy the scale changes
        game.scale.setScreenSize(true);
        
        game.state.start('menu');
        
    },
    
};

// Loading state
var load_state = {

    preload: function() {
        
        player = new Player(game);
        player.preload();
        
        letters = new Letters(game);
        letters.preload();
        
        level = new Level(game);
        level.preload();
        
        var loadingLabel = game.add.bitmapText(game.world.centerX, 150, 'pixel', 'Finding you a good word...', 32);
        loadingLabel.anchor.setTo(0.5, 0.5);
        
        var progressBar = game.add.sprite(game.world.centerX, 200, 'progressBar');
        progressBar.anchor.setTo(0.5, 0.5);
        game.load.setPreloadSprite(progressBar);
        
        word = new Word(game);
        word.preload();
        
        // Audio
        game.load.audio('jump', ['assets/jump.ogg', 'assets/jump.mp3']);
        game.load.audio('hurt', ['assets/hurt.ogg', 'assets/hurt.mp3']);
        game.load.audio('letter-found', ['assets/letter-found.ogg', 'assets/letter-found.mp3']);
    },
    
    create: function() {
        game.state.start('definition');
    }

};

var timerText;

var definition_state = {
    
    create: function() {
        
        var title = game.add.bitmapText(this.game.world.centerX, 150, 'pixel', "Definition", 32);
        var def = game.add.text(this.game.world.centerX, 200, word.def, {font: "25px Arial", fill: "#FFFFFF", wordWrap: true, wordWrapWidth: this.game.world.width});
        timerText = game.add.text(this.game.world.centerX, this.game.world.height - 30, "Starting in...\n" + Math.floor(game.time.events.duration / 1000), {font: "28px Arial", fill: "#FF0000", align: 'center'});
        
        title.anchor.setTo(0.5, 0.5);
        def.anchor.setTo(0.5, 0.5);
        timerText.anchor.setTo(0.5, 0.5);
        
        game.time.events.add(Phaser.Timer.SECOND * 10, gameStart, this);
        
        function gameStart() {
            game.state.start('main');
        }
    },
    
    update: function() {
        timerText.text = "Starting in...\n" + Math.floor(game.time.events.duration / 1000);
    }
}

// Menu state
var menu_state = {
    
    preload: function() {
        game.load.bitmapFont('pixel', 'assets/fonts/font.png', 'assets/fonts/font.xml');
    },
    
    create: function() {
        
        var text1 = game.add.bitmapText(this.game.world.centerX, 150, 'pixel', "Hangman's Escape", 50);
        var text2 = game.add.bitmapText(this.game.world.centerX, 200, 'pixel', 'Tap to start!', 32);
        
        text1.anchor.setTo(0.5, 0.5);
        text2.anchor.setTo(0.5, 0.5);
        
        game.input.onDown.addOnce(gameStart, this);
        
        function gameStart() {
            game.state.start('load');
        }
        
    }
    
};

// Main game state
var main_state = {
    
    create: function () {
        
        level.create();
    
    },
    
    update: function () {
        
        // Collision between player and ground
        this.game.physics.arcade.collide(player.guy, level.movingGround);
        
        level.update();

    }
};

// State that comes up if you win
var victory_state = {
    
    create: function() {

        var text1 = game.add.bitmapText(this.game.world.centerX, 150, 'pixel', "You Win!!", 50);
        var text2 = game.add.bitmapText(this.game.world.centerX, 250, 'pixel', 'Tap to play again!', 32);
        var text3 = game.add.bitmapText(this.game.world.centerX, 200, 'pixel', 'The word was... ' + word.word, 32);
        
        text1.anchor.setTo(0.5, 0.5);
        text2.anchor.setTo(0.5, 0.5);
        text3.anchor.setTo(0.5, 0.5);
        
        game.input.onDown.addOnce(gameStart, this);
        
        function gameStart() {
            game.state.start('menu');
        }
        
    }
};

// Game Over state
var game_over = {
    
    create: function() {
        
        var text1 = game.add.bitmapText(this.game.world.centerX, 150, 'pixel', "Game Over", 50);
        var text2 = game.add.bitmapText(this.game.world.centerX, 250, 'pixel', 'Tap to play again!', 32);
        var text3 = game.add.bitmapText(this.game.world.centerX, 200, 'pixel', 'The word was... ' + word.word, 32);
        
        text1.anchor.setTo(0.5, 0.5);
        text2.anchor.setTo(0.5, 0.5);
        text3.anchor.setTo(0.5, 0.5);
        
        game.input.onDown.addOnce(gameStart, this);
        
        function gameStart() {
            game.state.start('menu');
        }
        
    }
};

game.state.add('boot', boot_state);
game.state.add('load', load_state);
game.state.add('menu', menu_state);
game.state.add('definition', definition_state)
game.state.add('main', main_state);
game.state.add('victory', victory_state);
game.state.add('game-over', game_over);

game.state.start('boot');