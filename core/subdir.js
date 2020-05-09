#!/usr/bin/env node
const fs = require('fs');
const { spawn } = require('child_process');
const inquirer = require("inquirer");
const tools = require('./tools');

const dspawn = (path, command) => {
  return new Promise((resolve, reject)=> {
    tools.dchalkGreen(`\n目录：${path}`);
    const subprocess = spawn(`${command};`,[], { cwd: path, shell: true });
    subprocess.stdout.on('data', (data) => {
      console.log(`${data}`)
    });
    subprocess.stderr.on('data', (data) => {
      tools.dchalkRed(`${data}`);
    });
    subprocess.on('close', (code) => {
      resolve(true)
    });
  })
}

const execute = async (list, command) => {
  tools.dchalkGreen(`\n命令执行中请耐心等待...\n`);
  let len = list.length;
  while (len > 0 && await dspawn(list[len - 1], command)) len -= 1;
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