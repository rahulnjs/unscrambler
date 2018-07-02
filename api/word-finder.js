var fs = require('fs');

module.exports.go = function (tWord) {
    var res = [];
    var map = getFrequency(tWord);
    var file = 'api/' + tWord.length + '_FILE.CAB';
    try {
        fs.readFileSync(file).toString().split(/\r?\n/).forEach(function(word) {
            if(areMapsEqual(map, getFrequency(word))) {
                res.push(word);
            }
        });
    } catch (error) {
        console.dir(error);
    }
    return {
        words: res
    };
}


function getFrequency(word) {
    var map = {};
    for(var i = 0; i < word.length; i++) {
        var index = word.charCodeAt(i) - 97;
        map[index] = map[index] == null ? 1 : (map[index] + 1);
    }
    return map;
}


function areMapsEqual(map1, map2) {
    var keys = Object.keys(map1);
    var keys2 = Object.keys(map2);
    for(var i = 0; i < keys.length; i++) {
        if(map1[keys[i]] != map2[keys[i]]) {
            return false;
        }
    }
    return keys.length == keys2.length;
}
