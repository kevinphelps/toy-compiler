function main() { log(add(1, log(add(2, log(add(3, log(add(4, 5)))))))); }
main();

// library
function log(value) { console.log(value); return value; }

function add(x, y) { return x + y; }
