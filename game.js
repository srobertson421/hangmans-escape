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
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        if (!game.device.desktop) {
            
            // set the type of scaling to "show-all"
            game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            
            // Add a blue color to the page, to hide the white borders we might have
            document.body.style.backgroundColor = '000';
            
            // Set the min and max width/height of the game
            game.scale.minWidth = 250;
            game.scale.minHeight = 170;
            game.scale.maxWidth = 1000;
            game.scale.maxHeight = 680;
            
            // Center the game on the screen
            game.scale.pageAlignHorizontally = true;
            game.scale.pageAlignVertically = true;
            
            // Appy the scale changes
            game.scale.setScreenSize(true);
            
        }
        
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
        
        var loadingLabel = game.add.text(game.world.centerX, 150, 'Finding you a good word...', { font: '30px Frijole', fill: '#ffffff' });
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
        game.state.start('main');
    }

};

// Menu state
var menu_state = {

    create: function() {
        
        var style1 = {font: "30px Frijole", fill: "#FFFFFF"};
        var style2 = {font: "50px Frijole", fill: "#FFFFFF"};
        
        var text1 = game.add.text(this.game.world.centerX, 150, "Hangman's Escape", style2);
        var text2 = game.add.text(this.game.world.centerX, 200, 'Press Enter to start!', style1);
        
        text1.anchor.setTo(0.5, 0.5);
        text2.anchor.setTo(0.5, 0.5);
        
        enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        enterKey.onDown.addOnce(gameStart, this);
        
        function gameStart() {
            game.state.start('load');
        }
        
    }
    
};

// Main game state
var main_state = {
    
    create: function () {
        
        letters.create();
        
        level.create();
        
        player.create();
        
        word.create();
        
        $('#def').append(word.def);
    
    },
    
    update: function () {
        
        letters.update();
        
        player.update();
        
        level.update();

    }
};

// State that comes up if you win
var victory_state = {
    
    create: function() {
        
        var style1 = {font: "30px Frijole", fill: "#FFFFFF"};
        var style2 = {font: "50px Frijole", fill: "#FFFFFF"};
        
        var text1 = game.add.text(this.game.world.centerX, 150, "You Win!!", style2);
        var text2 = game.add.text(this.game.world.centerX, 250, 'Press Enter to play again!', style1);
        var text3 = game.add.text(this.game.world.centerX, 200, 'The word was... ' + word.word, style1);
        
        text1.anchor.setTo(0.5, 0.5);
        text2.anchor.setTo(0.5, 0.5);
        text3.anchor.setTo(0.5, 0.5);
        
        enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        enterKey.onDown.addOnce(gameStart, this);
        
        function gameStart() {
            game.state.start('menu');
        }
        
    }
};

// Game Over state
var game_over = {
    
    create: function() {
        
        var style1 = {font: "30px Frijole", fill: "#FFFFFF"};
        var style2 = {font: "50px Frijole", fill: "#F00"};
        
        var text1 = game.add.text(this.game.world.centerX, 150, "Game Over", style2);
        var text2 = game.add.text(this.game.world.centerX, 250, 'Press Enter to start!', style1);
        var text3 = game.add.text(this.game.world.centerX, 200, 'The word was... ' + word.word, style1);
        
        text1.anchor.setTo(0.5, 0.5);
        text2.anchor.setTo(0.5, 0.5);
        text3.anchor.setTo(0.5, 0.5);
        
        enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        enterKey.onDown.addOnce(gameStart, this);
        
        function gameStart() {
            game.state.start('menu');
        }
        
    }
};

game.state.add('boot', boot_state);
game.state.add('load', load_state);
game.state.add('menu', menu_state);
game.state.add('main', main_state);
game.state.add('victory', victory_state);
game.state.add('game-over', game_over);

game.state.start('boot');