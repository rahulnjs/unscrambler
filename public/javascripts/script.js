(function() {

    var loaderIco = '<i class="fas fa-circle-notch loader"></i>'
    var searchIco = '<i class="fas fa-search"></i>';

    $('#search-btn').on('click', function() {
        var ip = $('#word').val();
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
                    console.dir(data);
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


})();