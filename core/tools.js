const chalk = require("chalk");

function dchalk(color){
  return function(val){
    console.log(chalk[color](val))
  }
}

exports.dchalkGreen = dchalk('green');
exports.dchalkYellow = dchalk('yellow');
exports.dchalkRed = dchalk('red');
exports.dchalk = dchalk;