#!/usr/bin/env node
const fs = require('fs');
const { exec } = require('child_process');
const inquirer = require("inquirer");
const tools = require('./tools');

const execute = (list, command) => {
  tools.dchalkGreen(`\n命令执行中请耐心等待...\n`);
  list.forEach(path => {
    exec(`${command};`, { cwd: path }, function(error, stdout, stderr){
      if(error || stdout || stderr) tools.dchalkGreen(`\n目录：${path}`);
      if(error) tools.dchalkRed(error);
      if(stderr) tools.dchalkRed(stderr);
      if(stdout) console.log(stdout);
    });
  })
}

const askQuestions = () => {
  const questions = [
    {
      name: "FILENAME",
      type: "confirm",
      message: "是否在执行目录中执行命令?"
    }
  ];
  return inquirer.prompt(questions);
};

const getDirList = (path = process.cwd()) => {
  return fs.readdirSync(path)
          .filter(item =>  fs.existsSync(path+'/'+ item + '/package.json'))
          .map(item => path+'/'+ item );
}

const run = async () => {
  const command = process.argv[2];
  tools.dchalkGreen(`\n当前目录：\n${process.cwd()}`);

  const dirList = getDirList();
  tools.dchalkGreen(`\n执行目录：\n${dirList.join('\n')}`);;
  tools.dchalkGreen(`\n执行命令：\n${command}\n`);

  const answers = await askQuestions();
  const { FILENAME } = answers;
  if(FILENAME) execute(dirList, command);

};

run();