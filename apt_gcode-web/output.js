import { generateHeader } from "./settings.js";

let output = [];
let jsonOutput = [];


export function kk(line){
    jsonOutput.push(line.trim());
}


export function getJSON(){
    return JSON.stringify(
        jsonOutput,
        null,
        2
    );
}


export function clearJSON(){
    jsonOutput = [];
}


export function clearOutput(){
    output = [];
    jsonOutput = [];
    const terminal = document.getElementById("terminalOutput");
    if (terminal) {
        terminal.textContent = "Translating... Please wait."; 
    }
}


export function write(line){
    output.push(line.trim());
}


export function getOutput(){
    return output.join("\n");
}


export function buildOutput(settings){
    let finalOutput = [];
    if (settings.output.header && settings.output.header.trim() !==""){
        finalOutput.push(generateHeader(settings));
    }

    finalOutput.push(document.getElementById("add").value.replaceAll(/\\n/g, "\n"));
    if (window.core !== "Karlov_kod") {
        finalOutput.push("#DEFINE THE WORKPIECE");
    }
    finalOutput.push(window.postheader);
    if (finalOutput.length > 0){
        finalOutput.push("");
    }
    finalOutput.push(...output);
    return finalOutput.join("\n");
}


export function downloadOutput(text,settings){

    const blob = new Blob([text],{
        type:
        "text/plain;charset="+settings.output.encoding
    });
    const link = document.createElement("a");
    link.href=URL.createObjectURL(blob);
    link.download =
        settings.output.filename + settings.output.extension;
    link.click();
    URL.revokeObjectURL(link.href);
}

{}