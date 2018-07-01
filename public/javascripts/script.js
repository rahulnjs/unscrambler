(function() {

    var loaderIco = '<i class="fas fa-circle-notch loader"></i>'
    var searchIco = '<i class="fas fa-search"></i>';

    $('#search-btn').on('click', function() {
        var ip = $('#word').val();
        if(!ip) {
            return;
        } else {
            ip = ip.toLowerCase();
        }
        var $searchBtn = $(this);
        if(ip) {
            $searchBtn.html(loaderIco);
            $.ajax({
                url: 'find',
                data: {
                    word: ip
                },
                method: 'get',
                success: function(data) {
                    console.log(data);
                    $('#result').html('');
                    data.words.forEach(function(word) {
                        $('#result').append(`
                        <div class="word-card" id="${word}">
                            ${word} 
                            <div class="explore" data-word="${word}">
                                <i class="fas fa-plus"></i>
                            </div>
                            
                        </div>
                        `);
                    });
                    if(data.words.length == 0) {
                        $('#result').append('<div class="no-meaning">No words found.</div>');
                    }
                    setDefaultIco();
                },
                error: function(err) {
                    setDefaultIco(); 
                }
            });

            function setDefaultIco() {
                $searchBtn.html(searchIco);
            }
        }
    });


    $('#result').on('click', '.explore', function() {
        var $ico = $(this);
        $ico.html(loaderIco);
        var wrd = $ico.attr('data-word');
        //'https://od-api.oxforddictionaries.com/api/v1/entries/en/'
        $.ajax({
            //url: 'http://let-us-text.us-east-2.elasticbeanstalk.com/oxf-entry',
            url: 'https://unscrambler-py.herokuapp.com/oxf-entry',
            //url: 'http://192.168.31.108:8998/oxf-entry',
            //url: '/samples/oxf-sample.json',
            method: 'GET',
            data: {
                word: wrd
            },
            success: function(data) {
                try {
                    var $container = $('#' + wrd);
                    data = $.parseJSON(data);
                    //console.dir(data);
                    if(!data.error) {
                        d = data.results[0];
                        for(var i = 0; i < d.lexicalEntries.length; i++) {
                            $container.append(pronunciation( d.lexicalEntries[i]));
                            $container.append(getSenses(
                                d.lexicalEntries[i].entries[0].senses
                            ), false);
                            $container.append(getDerivatives(d.lexicalEntries[i].derivatives));
                        }
                    } else {
                        $container.append('<div class="no-meaning">No meaning found.</div>');
                    }
                    $ico.html('');
                } catch(error) {
                    console.dir(error)
                }
            },
            error: function(err) {

            }
        });
    });

    //
    $('#result').on('click', '.mp3-player', function() {
        var mp3 = new Audio($(this).attr('data-mp3'));
        mp3.play();
    });


    function getSenses(senses, sub) {
        var all = '';
        for(var i = 0; i < senses.length; i++) {
            var wht = sub ? '<i class="fas fa-check"></i> ' :  (i + 1) + '. ';
            var cls = sub ? 'sub-meaning' : '';
            var text = senses[i].crossReferenceMarkers ? 
                         senses[i].crossReferenceMarkers[0] : senses[i].definitions[0];
            var domain = senses[i].domains ? 
                            `<span class="domain"> ${senses[i].domains[0]} </span>` : '';             
            all += `<div class="meaning ${cls}">
                        <span>${wht}</span>${domain} ${text}`; 
            all += getExamples(senses[i].examples);
            if(senses[i].subsenses) {
                all += getSenses(senses[i].subsenses, true);
            }
            all += '</div>';
        }
        return all;
    }

    function getExamples(exmpls) {
        if(!exmpls) {
            return  '';
        }
        var all = '<ul class="exmpls">';
        for(var i = 0; i < exmpls.length; i++) {
            all += '<li class="exmpl">' + exmpls[i].text + '</li>';
        }
        return all + '</ul>';
    }

    function pronunciation(data) {
        return `
            <div class="pron block">
                <div class="lex-cat">${data.lexicalCategory}</div>
                <span class="pronunce">${data.pronunciations[0].phoneticSpelling}</span>
                <span data-mp3="${data.pronunciations[0].audioFile}" class="mp3-player">
                    <i class="fas fa-volume-up"></i> 
                </span>
            </div>
            `;
    }

    function getDerivatives(deriv) {
        if(!deriv) {
            return '';
        }
        var deris = '';
        deriv.forEach(function(d) {
            if(deris.length > 0) {
                deris += ', ';
            }
            deris += d.text;
        });
        return `
        <div class="derivs block">
          Derivatives: ${deris}
        </div>
        `;
    }



})();