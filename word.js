Word = function(game) {
    this.game = game;
    this.word = null;
    this.def = null;
    this.chars = [];
    this.url1 = 'http://api.wordnik.com:80/v4/words.json/randomWord?hasDictionaryDef=true&minCorpusCount=10000&minDictionaryCount=20&maxDictionaryCount=-1&minLength=';
    this.url2 = '&maxLength=';
    this.url3 = '&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5';
    this.blanks = [];
    this.wordProgress = [];
}

Word.prototype = {
    
    preload: function() {
        
        this.getWord(3,5);
        
    },
    
    create: function() {
        
        var style = {font: "20px Frijole", fill: "#FFFFFF"};
        
        var pos = this.game.world.centerX;
        
        for (i=0;i<this.word.length;i++) {
            
            pos = pos + 50;
            
            var space = this.game.add.text(pos, 0, '-', style);
            
            this.blanks.push(space);
            this.wordProgress.push(space.text);
        }
        
    },
    
    // Callback that gets a JSON object from the wonderful Wordnik service
    // the JSON contains a random word. Next we create an array by splitting
    // the word.
    getWord: function(min,max) {
        
        $.ajax({
            type: 'GET',
            url: this.url1 + min + this.url2 + max + this.url3,
            dataType: 'json',
            success: function(data) {
                word.word = data.word;
                console.log(word.word);
                word.chars = word.word.split('');
                word.getDef(word.word);
            },
            data: {},
            async: false 
        });
    },
    
    getDef: function(newWord) {
        
        $.ajax({
            type: 'GET',
            url: 'http://api.wordnik.com:80/v4/word.json/' + newWord + '/definitions?limit=200&includeRelated=true&sourceDictionaries=wiktionary&useCanonical=false&includeTags=false&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5',
            dataType: 'json',
            success: function(data) {
                //$('#def').html('<h1><span style="color:green;">Definition:</span> ' + data[0].text + '</h1>');
                word.def = data[0].text;
                console.log(data[0].text);
            },
            data: {},
            async: false
        });
        
    }
}