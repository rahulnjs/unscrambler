(function() {

    var loaderIco = '<i class="fas fa-circle-notch loader"></i>'
    var searchIco = '<i class="fas fa-search"></i>';

    $('#search-btn').on('click', function() {
        var ip = $('#word').val();
        if(!ip) {
            return;
        } 
        var $searchBtn = $(this);
        if(ip) {
            $searchBtn.html(loaderIco);
            var start = new Date().getTime();
            $.ajax({
                url: 'find',
                data: {
                    word: ip.toLowerCase().trim()
                },
                method: 'get',
                success: function(data) {
                    var end = new Date().getTime();
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
                        $('#result').append('<div class="no-words">No words found.</div>');
                    } else {
                        var l = data.words.length;
                        var sec = l + ' word' + (l > 1 ? 's': '') + ' in ' + ((end-start) / 1000).toFixed(2) + ' sec';
                        $('#result').prepend('<div class="stats">' + sec + '</div>');
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

    $('#word').on('keyup', function(e) {
        if(e.keyCode == 13) {
            $('#search-btn').click();
            $(this).blur();
        }
    });


    $('#result').on('click', '.explore', function() {
        var $ico = $(this);
        $ico.html(loaderIco);
        $ico.css({'pointer-events': 'none'});
        var wrd = $ico.attr('data-word');
        var $container = $('#' + wrd);
        $.ajax({
            url: 'meaning',
            method: 'GET',
            data: {
                word: wrd
            },
            success: function(data) {
                try {
                    data = $.parseJSON(data);
                    if(!data.error) {
                        d = data.results[0];
                        for(var i = 0; i < d.lexicalEntries.length; i++) {
                            $container.append(pronunciation( d.lexicalEntries[i]));
                            $container.append(getSenses(
                                d.lexicalEntries[i].entries[0].senses
                            ), false);
                            
                        }
                        $container.append(getDerivatives(d.lexicalEntries[0].derivatives));
                    } else {
                        showNoResponse($container);
                    }
                    $ico.html('');
                } catch(error) {
                    showNoResponse($container);
                    $ico.html('');
                }
            },
            error: function(err) {
                showNoResponse($container);
                $ico.html('');
            }
        });
    });

    function showNoResponse($container) {
        $container.append('<div class="no-meaning">No meaning found.</div>');
    }

    $('#result').on('click', '.mp3-player', function() {
        var mp3 = new Audio($(this).attr('data-mp3'));
        mp3.play();
    });


    function getSenses(senses, sub) {
        var all = '';
        for(var i = 0; i < senses.length; i++) {
            var wht = sub ? '<i class="fas fa-check"></i> ' :  (i + 1) + '. ';
            var cls = sub ? 'sub-meaning' : '';
            console.log(senses[i]);
            var text = senses[i].crossReferenceMarkers ? 
                         senses[i].crossReferenceMarkers[0] : senses[i].definitions[0];
            var domain = senses[i].domains ? 
                            `<span class="domain"> ${senses[i].domains[0].text} </span>` : '';             
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
                <div class="lex-cat">${data.lexicalCategory.text}</div>
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