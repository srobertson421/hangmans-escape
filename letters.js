Letters = function(game) {
    
    this.game = game;
    this.letters = null;
    this.total = 0;
    this.alph = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
    this.frames = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
    this.matchedWord = '';
    this.wrongLetters = [];
    this.counterMessage = null;
    this.deathCounter = 0;
    this.hurtSound = null;
    this.letter_found = null;
};

Letters.prototype = {
    
    preload: function() {
        
        // Load alphabet spritesheet
        this.game.load.spritesheet('alphabet', './assets/alphabetSheet2.png', 28.5, 24);

    },
    
    create: function() {
        
        // Create a sprite group for the alphabet
        this.letters = this.game.add.group();
        this.letters.enableBody = true;
        this.letters.physicsBodyType = Phaser.Physics.ARCADE;
        
        // Create letter callback, takes Y coordinate as argument
        this.createLetter(game.world.height - 107);
        this.createLetter(game.world.height - 85);
        this.createLetter(game.world.height - 53);
        
        // Timed function that will create a new letter on the x-axis every 30 seconds
        this.game.time.events.add(Phaser.Timer.SECOND * 30, this.createLetterTop, this);
        this.game.time.events.add(Phaser.Timer.SECOND * 60, this.createLetterTop, this);
        this.game.time.events.add(Phaser.Timer.SECOND * 90, this.createLetterTop, this);
        this.game.time.events.add(Phaser.Timer.SECOND * 120, this.createLetterTop, this);
        this.game.time.events.add(Phaser.Timer.SECOND * 150, this.createLetter, this, 185); // Add another horizontal one
        this.game.time.events.add(Phaser.Timer.SECOND * 180, this.createLetterTop, this);
        this.game.time.events.add(Phaser.Timer.SECOND * 210, this.createLetterTop, this);
        this.game.time.events.add(Phaser.Timer.SECOND * 240, this.createLetterTop, this);
        
        // Our player death counter (will replace with hangman later)
        var style = {font: "20px Frijole", fill: "#FFFFFF"};
        this.counterMessage = this.game.add.text(0.5, 0.5, 'Wrong Letters: ' + this.deathCounter, style);
        
        // Audio
        this.hurtSound = this.game.add.audio('hurt');
        this.hurtSound.volume = 0.4;
        this.hurtSound.loop = false;
        
        this.letter_found = this.game.add.audio('letter-found');
        this.letter_found.volume = 0.4;
        this.letter_found.loop = false;

    },
    
    // Callback that gets a random letter from the spliced alph[] and matches it to the full frames[] alphabet
    getFrame : function () {
        
        var letter = this.alph[this.game.rnd.integerInRange(0, this.alph.length - 1)];
        var element = this.frames.indexOf(letter);
        
        return element;
        
    },
    
    // Callback to add a random letter to the game on the y-axis
    createLetter: function(y) {
        
        // Adds a random letter to the game
        var letter = this.letters.create(this.game.world.width + 100, y, 'alphabet', this.getFrame());
        
        // Setup physics and checks for out-of-bounds events
        letter.body.allowGravity = false;
        letter.body.velocity.y = -100 + Math.random() * -200;
        letter.checkWorldBounds = true;
        letter.events.onOutOfBounds.add(this.letterOut, this);
        letter.name = this.alph[letter.frame];
        
    },
    
    createLetterTop: function() {
        
        // Adds a random letter to the game
        var letter = this.letters.create(this.game.rnd.integerInRange(100, this.game.world.width - 100), -10, 'alphabet', this.getFrame());
        
        // Setup physics and checks for out-of-bounds events
        letter.body.allowGravity = false;
        letter.body.velocity.y = 100 + Math.random() * 100;
        letter.checkWorldBounds = true;
        letter.events.onOutOfBounds.add(this.letterOutTop, this);
        letter.name = this.alph[letter.frame];
    },
    
    // Callback when a letter leaves the world or collides with the player
    // Resets the letter's X coordinate and sets it's frame to a random letter
    letterOut: function(letter) {
        
        var y = letter.y;
        var frame = this.getFrame();
        letter.reset(this.game.world.width + 100, letter.y);
        letter.frame = frame;
        letter.body.velocity.x = -100 + Math.random() * -200;
        letter.name = this.frames[letter.frame];
        
    },
    
    letterOutTop: function(letter) {
        
        var frame = this.getFrame();
        letter.reset(this.game.rnd.integerInRange(100, this.game.world.width - 100), -10);
        letter.frame = frame;
        letter.body.velocity.y = 100 + Math.random() * 100;
        letter.name = this.frames[letter.frame];
    },
    
    update: function() {
        
        // Collision letters vs player, sends to callback letterCollision
        this.game.physics.arcade.collide(this.letters, player.guy, this.letterCollision, null, this);
        
        if(this.matchedWord === word.word) {
            this.game.state.start('victory');
        }
        
        if(this.deathCounter > 5) {
            this.game.state.start('game-over');
        }

    },
    
    checkOverlap: function (spriteA, spriteB) {
        
        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();
        
        return Phaser.Rectangle.intersects(boundsA, boundsB);
        
    },
    
    // Callback that handles letter checking
    letterCollision: function(player, letter) {
        
        var y = letter.y;
        var alphElement = this.alph.indexOf(letter.name);
        
        var i = word.word.length;
        
        // loop to check if the collided letter matches any letter in the word.chars[]
        // then removes it if it does and calls the updateText callback
        while(i--) {
            if(letter.name === word.chars[i]) {
                this.letter_found.play();
                this.alph.splice(alphElement, 1);
                this.letterOut(letter);
                this.updateText(word.chars[i]);
                return;
            }
        }
        this.hurtSound.play();
        this.letterOut(letter);
        this.wrongLetters.push(this.alph.splice(alphElement, 1));
        this.deathCounter++;
        this.counterMessage.setText('Wrong Letters: ' + this.deathCounter);
    },
    
    // Callback that updates the HUD letter display
    updateText: function(letter) {
        
        // JQuery in a game?! Yep, I'm lazy, plus this makes it easy to check for duplicate letters
        $.each(word.chars, function(index,value) {
            if(value === letter) {
                word.blanks[index].text = word.chars[index];
                word.wordProgress[index] = word.chars[index];
                letters.matchedWord = word.wordProgress.join('');
            }
        });
    }
};