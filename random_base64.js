
// generates Random Numbers

var ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

function random_base64(length) {
    var str = "";
    for (var i=0; i < length; ++i) {
        var rand = Math.floor(Math.random() * ALPHABET.length);
        str += ALPHABET.substring(rand, rand+1);
    }
    return str;
}
