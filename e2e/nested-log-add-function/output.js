function main() { log(add(1, log(add(2, log(add(3, log(add(4, 5)))))))); }
main();

function add(x,y){return x+y;}
function log(value){console.log(value);return value;}
