let output = [];
let jsonOutput = [];

export function wError (line){
    write(line);
    console.error(line);
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
    if (!line) line = "";
    const trimmedLine = line.trim();
    
    if (trimmedLine !== ""){
        output.push(trimmedLine);
        const terminal = document.getElementById("terminalOutput");
        if (terminal) {
            if (terminal.textContent === "Translating... Please wait." || terminal.textContent === "") {
                terminal.textContent = trimmedLine;
            } else {
                terminal.textContent += "\n" + trimmedLine;
            }
            terminal.scrollTop = terminal.scrollHeight;
        }
    }
    console.log("###" + line);
}


export function getOutput(){
    return output.join("\n");
}


export function buildOutput(){
    return output.join("\n");
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


export function getLastJSON() {
    return jsonOutput[jsonOutput.length - 1];
}


export function findDirection2D(tang1, begin1, center1, tang2, begin2, center2){
    let D = tang1*(begin2-center2)-tang2*(begin1-center1);
    if (D<0){
        return "G3";
    }
    else if (D>0){
        return "G2";
    }
    else{
        return false;
    }
}
export function findDirection(tang1, begin1, center1, tang2, begin2, center2){
    let D = tang1*(begin2-center2)-tang2*(begin1-center1);
    if (D<0){
        return "ccw";
    }
    else if (D>0){
        return "cw";
    }
    else{
        return false;
    }
}

// true means the coordinate is stable does not change- not a part of the plane
export function getPlane(...coords){
    let x_value = true;
    let y_value = true;
    let z_value = true;
    let x_last;
    let y_last;
    let z_last;
    for (const [id,x,y,z] of coords){
        x = Number(x);
        y = Number(y);
        z = Number(z);
        if (id === "vec"){
            if (x!==0){
                x_value = false;
            }
            if (y!==0){
                y_value = false;
            }
            if (z!==0){
                z_value = false;
            }
        }
        else if (id === "cor"){
            if (typeof x_last === "undefined" || x_last === x){
                x_last = x;
            }
            else{
                x_value = false;
            }

            if (typeof y_last === "undefined" || y_last === y){
                y_last = y;
            }
            else{
                y_value = false;
            }

            if (typeof z_last === "undefined" || z_last === z){
                z_last = z;
            }
            else{
                z_value = false;
            }
        }
        else if (id==="axs"){
            if (Math.abs(x)===1){
                x_value = false;
            }
            if (Math.abs(y)===1){
                y_value = false;
            }
            if(Math.abs(z)===1){
                z_value = false;
            }
        }
    }
    if (x_value && y_value && z_value){
        return null;
    }
    else if (x_value && z_value){
        return "xz";
    }
    else if (y_value && z_value){
        return "yz";
    }
    else if (x_value && y_value){
        return "xy";
    }
    else{
        return false;
    }
}
export function checkVector(i,j,k){
    let isPlanar = false;
    let isSingle = false;
    let isCorrect = false;
    if ((String(i).trim()!== "")&&(String(j).trim()!== "")&&(String(k).trim()!== "")&&((Math.abs(Math.pow(i,2) + Math.pow(j,2) + Math.pow(k,2) - 1)) < 0.01)){
            isCorrect = true;
        if ((i !==0) || (j!==0) || (k!==0)){
            isPlanar = true;
                if ((Math.abs(i) === 1) || (Math.abs(j) === 1) || (Math.abs(k) === 1)){
                    isSingle = true;
                }
        }
    }
    return [isCorrect,isPlanar,isSingle];
}

{}