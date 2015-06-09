Letters = function(game) {
    
    this.game = game;
    this.letters = null;
    this.total = 0;
    this.alph = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
    this.matchedWord = '';
    this.wrongLetters = '';
    this.counterMessage = null;
    this.deathCounter = 0;
    this.hurtSound = null;
    this.letter_found = null;
};

Letters.prototype = {
    
    preload: function() {

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
        this.counterMessage = this.game.add.bitmapText(32, 10, 'pixel', 'WRONG LETTERS: ' + this.deathCounter, 20);
        this.wrongLettersList = this.game.add.bitmapText(32, 30, 'pixel', this.wrongLetters, 15);
        
        // Audio
        this.hurtSound = this.game.add.audio('hurt');
        this.hurtSound.volume = 0.4;
        this.hurtSound.loop = false;
        
        this.letter_found = this.game.add.audio('letter-found');
        this.letter_found.volume = 0.4;
        this.letter_found.loop = false;

    },
    
    // Callback to add a random letter to the game on the y-axis
    createLetter: function(y) {
        
        // Adds a random letter to the game
        var letter = this.alph[this.game.rnd.integerInRange(0, this.alph.length)];
        var letterSprite = this.game.add.bitmapText(this.game.world.width, y, 'pixel', letter, 32);
        this.letters.add(letterSprite);
        
        // Setup physics and checks for out-of-bounds events
        this.game.physics.arcade.enable(letterSprite);
        
        letterSprite.body.allowGravity = false;
        letterSprite.body.velocity.x = -100 + Math.random() * -200;
        letterSprite.checkWorldBounds = true;
        letterSprite.events.onOutOfBounds.add(this.letterOut, this);
        letterSprite.name = letter;
        letterSprite.directionType = 'horizontal';
        
    },
    
    createLetterTop: function() {
        
        // Adds a random letter to the game
        var letter = this.alph[this.game.rnd.integerInRange(0, this.alph.length)];
        var letterSprite = this.game.add.bitmapText(this.game.rnd.integerInRange(100, this.game.world.width - 100), 0, 'pixel', letter, 32);
        this.letters.add(letterSprite);
        
        // Setup physics and checks for out-of-bounds events
        this.game.physics.arcade.enable(letterSprite);
        
        letterSprite.body.allowGravity = false;
        letterSprite.body.velocity.y = 100 + Math.random() * 100;
        letterSprite.checkWorldBounds = true;
        letterSprite.events.onOutOfBounds.add(this.letterOutTop, this);
        letterSprite.name = letter;
        letterSprite.directionType = 'vertical';
    },
    
    // Callback when a letter leaves the world or collides with the player
    // Resets the letter's X coordinate and sets it's frame to a random letter
    letterOut: function(letter) {
        
        var newLetter = this.alph[this.game.rnd.integerInRange(0, this.alph.length)];
        
        var y = letter.y;
        letter.reset(this.game.world.width, letter.y);
        letter.name = newLetter;
        letter.directionType = 'horizontal';
        letter.setText(newLetter);
        letter.body.velocity.x = -100 + Math.random() * -200;
        
    },
    
    letterOutTop: function(letter) {
        
        var newLetter = this.alph[this.game.rnd.integerInRange(0, this.alph.length)];
        
        letter.reset(this.game.rnd.integerInRange(100, this.game.world.width - 100), 0);
        letter.name = newLetter;
        letter.directionType = 'vertical';
        letter.setText(newLetter);
        letter.body.velocity.y = 100 + Math.random() * 100;
    },
    
    update: function() {
        
        // Collision letters vs player, sends to callback letterCollision
        this.game.physics.arcade.overlap(this.letters, player.guy, this.letterCollision, null, this);
        
        if(this.matchedWord === word.word) {
            this.game.state.start('victory');
        }
        
        if(this.deathCounter > 5) {
            this.game.state.start('game-over');
        }

    },
    
    // Callback that handles letter checking
    letterCollision: function(player, letter) {
        
        var alphElement = this.alph.indexOf(letter.name);
        
        var i = word.word.length;
        
        // loop to check if the collided letter matches any letter in the word.chars[]
        // then removes it if it does and calls the updateText callback
        while(i--) {
            if(letter.name.toLowerCase() === word.chars[i].toLowerCase()) {
                this.letter_found.play();
                this.alph.splice(alphElement, 1);
                
                if (letter.directionType === 'horizontal') {
                    this.letterOut(letter);
                }
                else if (letter.directionType === 'vertical') {
                    this.letterOutTop(letter);
                }
                
                this.updateText(word.chars[i]);
                return;
            }
        }
        this.hurtSound.play();
        
        if (letter.directionType === 'horizontal') {
            this.letterOut(letter);
        }
        else if (letter.directionType === 'vertical') {
            this.letterOutTop(letter);
        }
        
        this.wrongLetters += this.alph.splice(alphElement, 1) + ' ';
        this.deathCounter++;
        this.counterMessage.setText('WRONG LETTERS: ' + this.deathCounter);
    },
    
    // Callback that updates the HUD letter display
    updateText: function(letter) {
        
        // JQuery in a game?! Yep, I'm lazy, plus this makes it easy to check for duplicate letters
        $.each(word.chars, function(index,value) {
            if(value === letter) {
                word.blanks[index].text = word.chars[index].toUpperCase();
                word.wordProgress[index] = word.chars[index];
                letters.matchedWord = word.wordProgress.join('');
            }
        });
    }
};