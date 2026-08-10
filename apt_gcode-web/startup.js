
import {getSettings, validateSettings} from "./settings.js";
import {clearOutput, buildOutput, downloadOutput, getJSON, kk} from "./output.js";
import {catiav5_1_0, kkod} from "./parselinev2.js";
import {WinNC_sinumerik, Karlov_kod} from "./g-coder.js";

document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("translateButton");
    button.addEventListener("click", translateAPT);});

async function translateAPT(){
    clearOutput();
    const settings = getSettings();
    try {

        validateSettings(settings);
        const aptText = await loadAPT(settings);
        const commands = splitAPT(aptText);
        const parserType = document.getElementById("apt-code-version").value;

        let parser;

        switch (parserType) {
            case "catiav5_1_0":
                parser = new catiav5_1_0(settings);
                break;
            case "kkod":
                parser = new kkod(settings);
                break;
            default:
                throw new Error("APT parser not selected");
        }

        for (const command of commands) {
            parser.parseline(command);
        }
    }
    
    catch (error) {
        document.getElementById("terminalOutput").textContent=
            error.message;
        console.error(error);
    }

    try{
        validateSettings(settings);
        const aptText = await loadAPT(settings);
        const g_code_type = document.getElementById("preset").value;
        window.core = g_code_type;
        let gcoder;
        kk("END");
        
        switch (g_code_type) {
            case "WinNC_sinumerik":
                gcoder = new WinNC_sinumerik(settings);
                break;
            case "Karlov_kod":
                gcoder = new Karlov_kod(settings);
                break;
            case "costum":
                if (document.getElementById("core_output").value === "WinNC_sinumerik"){
                    gcoder = new WinNC_sinumerik(settings);
                    break;
                }
                else if (document.getElementById("core_output").value === "Karlov_kod"){
                    gcoder = new Karlov_kod(settings);
                    break;
                }
                break;
        default:
            throw new Error("G-code generator not selected");
        }

        const jsonLines = JSON.parse(getJSON());
        for (const line of jsonLines) {
            gcoder.gcoder(line);
        }
        const result = buildOutput(settings);
        document.getElementById("terminalOutput").textContent = result;

    }
    
    catch (error) {
        document.getElementById("terminalOutput").textContent=
            error.message;
        console.error(error);
    
    }
    if (document.getElementById("downloadOutputCheck").checked){
    downloadOutput(buildOutput(settings),settings)}
}
async function loadAPT(settings) {
    if (settings.file) {
        const buffer = await settings.file.arrayBuffer();
        const decoder = new TextDecoder(settings.inputEncoding);
        return decoder.decode(buffer);
    }
    if (settings.demo) {
        const response = await fetch("demo/"+settings.demo);
        if (!response.ok) {
            throw new Error("Demo file not found.");}
        return await response.text();
        const buffer = await response.arrayBuffer();
        const decoder = new TextDecoder(settings.inputEncoding);
        return decoder.decode(buffer);
    }
    throw new Error("No input file selected.");
}
function splitAPT(text) {
    const commands = [];
    const lines = text.split(/\r?\n/);
    let current = "";
    for (const line of lines) {
        current += line.trim();
        if (current.endsWith("$")){
            current = current.slice(0, -1);
            continue;
        }
        if (current !==""){
            commands.push(current);
        }
        current = "";
    }
    return commands;

}
{}
[]