const fs = require('fs')
const path = require('path')
const shelljs = require('shelljs')
const program = require('commander')
const chalk = require('chalk')
const inquirer = require('inquirer')
const packageJson = require('./package.json')
const warning = chalk.keyword('orange')

function fsExistsSync(path) {
    try{
        fs.accessSync(path,fs.constants.W_OK);
    }catch(e){
        return false;
    }
    return true;
}

function createSuc(projectName) {
    console.log(chalk.green('The React App has benn created successfully.'))
    console.log('You can run the command to run the app:')
    console.log('1. ' + 'cd ' + projectName)
    console.log('2. ' + 'npm install')
    console.log('3. ' + 'npm run dev')
}
let projectName
program
    .version(packageJson.version)
    .usage(`${chalk.green('<project-directory>')}`)
    .arguments('<project-name>')
    .action((name) => {
        projectName = name
    })
    .parse(process.argv)

if(!projectName) {
    console.log(chalk.red('No project name given! \nCreate app has failed'))
    return
}else {
    let projectDir = path.resolve(process.cwd(), projectName)

    if(fsExistsSync(projectDir) && fs.statSync(projectDir).isDirectory()) {
        let prompt = warning(`the folder named ${projectName} already existed, will you want to continue?\n  This will empty the contents of the folder.`)
        //The folder has existed.
        inquirer.prompt({
                message: prompt+' (y/n)',
                name: 'Clear'
            }).then((answer) => {
            if(answer.Clear.toLowerCase() === 'y') {
                shelljs.rm('-rf', projectDir+'/*')
                shelljs.cp('-r', path.resolve(__dirname, './template/*'), projectDir)

                createSuc(projectName)
            }else {
                return
            }
        })
    }else {
        shelljs.cp('-r', path.resolve(__dirname, './template'), projectDir)

        createSuc(projectName)
    }
}


