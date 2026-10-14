import {getSettings} from "./settings.js";
import {clearOutput, buildOutput, downloadOutput, getJSON, wError, write} from "./output.js";
import {catiav5_1_0} from "./parselinev3.js";
const textInputToggle = document.getElementById("textInputToggle");
const textInput = document.getElementById("textInput");

document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("translateButton");
    button.addEventListener("click", translateAPT);
});

async function translateAPT(){
    const terminal = document.getElementById("terminalOutput");
    if (terminal) {
        terminal.scrollIntoView({ behavior: "smooth", block: "start" });
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    document.body.classList.add("no-scroll");
    clearOutput();
    const settings = getSettings();
    try {
        const aptText = await loadAPT(settings);
        const commands = splitAPT(aptText);
        const parserType = document.getElementById("apt-code-version").value;
        const g_code_type = document.getElementById("preset").value;

        let parser;
        let funcModule;

        if (g_code_type === "WinNC_sinumerik" || (g_code_type === "custom" && document.getElementById("core_output").value === "WinNC_sinumerik")) {
            funcModule = await import("./WinNC.js");
        } 
        else if (g_code_type === "Karlov_kod" || (g_code_type === "custom" && document.getElementById("core_output").value === "Karlov_kod")) {
            funcModule = await import("./Karlov_kod.js");
        }
        else{
            wError("Unknown parser type");
        }

        switch (parserType) {
            case "catiav5_1_0":
                let docModulePath = "./WinNC.js";

                if (document.getElementById("preset").value === "custom") {
                    const coreOutput = document.getElementById("core_output").value;
                    if (coreOutput === "WinNC_sinumerik") docModulePath = "./WinNC.js";
                    else if (coreOutput === "Other") docModulePath = "./Other.js";
                }
                const docModule = await import(docModulePath);
                parser = new catiav5_1_0(docModule);

                break;

            default:
                throw new Error("APT parser not selected");
        }


        for (let i = 0; i < commands.length; i++) {
            parser.parseline(commands[i]);
            await new Promise(resolve => setTimeout(resolve, 10)); 
        }
    }
    
    catch (error) {
        document.getElementById("terminalOutput").textContent=
            error.message;
        console.error(error);
    }
    finally{
        document.body.classList.remove("no-scroll");
    }

    if (document.getElementById("downloadOutputCheck").checked){
    downloadOutput(buildOutput(settings),settings)}
}
async function loadAPT(settings) {
    const encodings = ["utf-8", "utf-16", "utf-16le", "utf-16be", "utf-32", "iso-8859-1", "iso-8859-2", "iso-8859-3", "iso-8859-4", "iso-8859-5", "iso-8859-6", "iso-8859-7", "iso-8859-8", "iso-8859-9", "iso-8859-15", "windows-1250", "windows-1251", "windows-1252", "windows-1253", "windows-1254", "windows-1255", "windows-1256", "windows-1257", "windows-1258", "ascii"]
    
    if (textInputToggle.checked && textInput.value.trim().length > 0){
        return textInput.value;
    }
    
    
    if (settings.file) {
        const buffer = await settings.file.arrayBuffer();
        for (const encoding of encodings) {
    try {
        console.log(`Trying ${encoding}`);

        const decoder = new TextDecoder(encoding);
        const text = decoder.decode(buffer);

        console.log(`${encoding} succeeded, length = ${text.length}`);

        if (text.length > 0) {
            console.log(`Encoded with ${encoding}`);
            return text;
        }
    }
    catch (error) {
        console.log(`Encoding failed with ${encoding}:`, error);
    }
}
    }
    if (settings.demo && settings.demo !== " ") {
        const response = await fetch("demo/"+settings.demo);
        if (!response.ok) {
            throw new Error("Demo file not found.");}
        return await response.text();
    }
    throw new Error("No input.");
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