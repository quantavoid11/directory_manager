#! /usr/bin/env node

import { log } from "console";

const {Command}=require('commander');
const fs=require('fs');
const path=require('path');
const figlet=require('figlet');

const program=new Command();

console.log(figlet.textSync("Dir Manager"));
program
    .version('1.0.0')
    .description('An example CLI for managing a directory')
    .option("-l,--ls [value]", "List all files in a directory")
    .option("-m,--mkdir <value>", "Create a new directory")
    .option("-t,--touch <value>", "Create a new file")
    .parse(process.argv);
const options=program.opts();

//List all files for -l or --ls
async function listDirContents(filepath:string){
    try {
        const files=await fs.promises.readdir(filepath);
        const detailedFilesPromises=files.map(async(file:string)=>{
            let fileDetails=await fs.promises.lstat(path.resolve(filepath,file));
            const {size,mtime}=fileDetails;
            const time=new Date(mtime).toLocaleString('en-GB');
            return {filename:file,"size(KB":size,"last_modified_at":time};
        })
        const detailedFiles=await Promise.all(detailedFilesPromises);
        console.table(detailedFiles);
    } catch (error) {
        console.log("Error listing directory contents");  
    }

    
}
//Handles -m or --mkdir to cerate a new directory

function createDir(filepath:string){
    if(!fs.existsSync(filepath)){
        fs.mkdirSync(filepath);
        console.log(`Directory ${filepath} has been created successfully`);
    }
}

//Handles -t or --touch to create a new file
function createFile(filepath:string){
    fs.openSync(filepath,"w");
    console.log(`File ${filepath} has been created successfully`);
}

if(!process.argv.slice(2).length){
    program.outputHelp();
};
if(options.ls){
    const filepath=typeof options.ls==="string"?options.ls:process.cwd();
    listDirContents(filepath);
}

if (options.mkdir) {
    createDir(path.resolve(process.cwd(), options.mkdir));
  }
  if (options.touch) {
    createFile(path.resolve(process.cwd(), options.touch));
  }
