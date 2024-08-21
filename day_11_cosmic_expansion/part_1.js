const fs = require('node:fs');

let data;

try {
    data = fs.readFileSync('./sample.txt', 'utf-8');
} catch (err) {
    console.error(err);
    throw err;
}

process.stdout.write(data);
