

export function generateHeader(settings){
    return settings.output.header.replace("{filename}", settings.output.filename);
}
export function getSettings(){
    const preset = document.getElementById("preset").value;
    const input = document.getElementById("apt-code-version").value;

    let settings = {
        preset: preset,
        file: document.getElementById("costumFilename").files[0],
        demo: document.getElementById("demoSelect").value,
        inputEncoding: "utf-8",
        downloadOutput: document.getElementById("downloadOutputCheck").checked,
        output: {}
    };
    if (input === "catiav5_1_0"){
        window.add_command = "ADD: RADIUS";
    }
    else{
        window.add_command = "";
    }

    if (preset === "costum"){
        settings.output.filename = document.getElementById("filename").value;
        settings.output.encoding = document.getElementById("enc_output").value;
        settings.output.extension = document.getElementById("extension").value;
        settings.output.header = document.getElementById("output_header").value;
        window.postheader = "";

    }
    else if (preset === "WinNC_sinumerik") {
        settings.output.filename = document.getElementById("filename").value;
        settings.output.encoding = "utf-8";
        settings.output.extension = ".mpf";
        settings.output.header = "%_N_{filename}_MPF";
        window.postheader = "G55";
    }
    else if (preset === "ISO6983"){
        settings.output.filename = document.getElementById("filename").value;
        settings.output.encoding = "utf-8";
        settings.output.extension = ".txt";
        settings.output.header = "";
        window.postheader = "";
    }
    else if (preset === "Karlov_kod"){
        settings.output.filename = document.getElementById("filename").value;
        settings.output.encoding = "utf-8";
        settings.output.extension = ".txt";
        settings.output.header = "";
        window.postheader = "";
    }
    return settings;
}
export function validateSettings(){}
