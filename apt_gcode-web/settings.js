export function getSettings(){
    const preset = document.getElementById("preset").value;
    const input = document.getElementById("apt-code-version").value;

    let settings = {
        preset: preset,
        file: document.getElementById("customFilename").files[0],
        demo: document.getElementById("demoSelect").value,
        textInput: document.getElementById("textInput").value,
        inputEncoding: "utf-8",
        downloadOutput: document.getElementById("downloadOutputCheck").checked,
        output: {}
    };

    if (preset === "custom"){
        settings.output.filename = document.getElementById("filename").value;
        settings.output.encoding = document.getElementById("enc_output").value;
        settings.output.extension = document.getElementById("extension").value;

    }
    else if (preset === "WinNC_sinumerik") {
        settings.output.filename = document.getElementById("filename").value;
        settings.output.encoding = "utf-8";
        settings.output.extension = ".mpf";

    }
    else if (preset === "Karlov_kod"){ 
        settings.output.filename = document.getElementById("filename").value;
        settings.output.encoding = "utf-8";
        settings.output.extension = ".txt";
    }
    return settings;
}
