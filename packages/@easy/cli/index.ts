import fs from "fs";
import path from "path";
import argv from "minimist";
import { yellow, blue, green, cyan, magenta, red } from "kolorist";
import prompts from "prompts";
import commander from "commander";
import { EeasyOption } from "./option";
const program = new commander.Command();
import {attachOptionToCommand} from '../utils/command-utils'
program
    .option("-l --list", "list template")
    .option("-h --help", "list all help");
program.parse(process.argv);

const options= program.opts<EeasyOption>();

attachOptionToCommand(options,(options:EeasyOption)=>{

})
