import {write} from "./output.js";

export class WinNC_sinumerik {
    constructor(settings){
    }
    gcoder(line){
        let elements;
        let type;
        let speed;
        let direction;
        let name;
        let magazine;
        let compensation;
        let x;
        let y;
        let z;
        let i;
        let j;
        let k;
        let centar_x;
        let centar_y;
        let centar_z;
        let kraj_x;
        let kraj_y;
        let kraj_z;
        let radius;
        let angle;
        let number_dt;
        let number;

console.log(line);

    if (line.startsWith("COMMENT")){
        line = line.replace("COMMENT:", ";");
        write(line);
    }
    else if (line.startsWith("ADD")){
        if (line.includes("RADIUS")){
            write("DIAMOF");
        }
        else if (line.includes("DIAMETER")){
            write("DIAMON");
        }
    }
    else if (line.startsWith("UNIT")){
        if (line.includes("MM")){
            write("G71");
        }
        else if (line.includes("INCH")){
            write("G70");
        }
    }
    else if (line.startsWith("PLANE")){
        if (line.includes("xy")){
            write("G17");
        }
        else if (line.includes("xz")){
            write("G18");
        }
        else if (line.includes("zy")){
            write("G19");
        }
    }
    else if (line.startsWith("TOOL")){
        let elements = line.split(" ");
        let name = elements[1];
        let magazine = elements[2];
        let compensation = elemnts[3];

        write(name + " " + magazine + " " + compensation);
    }
    else if (line.startsWith("SPINDLE")){
        if (line.includes("off")){
            write("M05");
        }
        else if (line.includes("on")){
            elements = line.split(" ");
            speed = elements[3].split(":")[1];
            
            if(line.includes ("fix")){
                type = "G97";
            }
            else if (line.includes("surface")){
                type = "G96";
            }
            if (line.includes("ccw")){
                direction = "M03";
            }
            else if (line.includes("cw")){
                direction="M04";
            }
            write(type+" S"+speed+" "+" "+direction);
        }
    }
    else if (line.startsWith("FEEDRATE")){
        elements = line.split(" ");
        speed = elements[2].split(":")[1];
        if (line.includes("time")){
            type = "G94";
        }
        else if (line.includes("rev")){
            type = "G95";
        }
        else if (line.includes("inver")){
            type = "G93";
        }
        write(type + " F" + speed);
    }
    else if (line.startsWith("COOLANT")){
        if (line.includes("off")){
            write("M09");
        }
        else if (line.includes("mist")){
            write("M07");
        }
        else if (line.includes("flood")){
            write("M08");
        }
    }
    else if (line.startsWith("AIR_PURGE")){
        if (line.includes("on")){
            write("M71");
        }
        else if (line.includes("off")){
            write("M72");
        }
    }
    else if (line.startsWith("MOVEMENT")){
        if (line.includes("incremental")){
            write("G91");
        }
        else if (line.includes("absolute")){
            write("G90");
        }
    }
    else if (line.startsWith("AIR")){

        write("G0");
    }
    else if (line.startsWith("CUT")){
        write("G1");
    }
    else if (line.startsWith("END")){
        write("M30");
    }
    else if (line.startsWith("ERROR")){
        write(line);
    }
    else if (line.startsWith("LINE")){
        elements = line.split(" ");
        if (elements.length === 4 ){
            x = elements[1];
            y = elements[2];
            z = elements[3];

            if (x === "X++"){
                x = "";
            }
            if (y === "Y++"){
                y = "";
            }
            if (z === "Z++"){
                z = "";
            }
            write(x+" "+y+" "+z);
        }
        else if (elements.length === 7){
            x = elements[1];
            y = elements[2];
            z = elements[3];
            i = elements[4];
            j = elements[5];
            k = elements[6];

            if (x === "X++"){
                x = "";
            }
            else if (y === "Y++"){
                y = "";
            }
            else if (z === "Z++"){
                z = "";
            }
            else if (i === "I++"){
                i = "";
            }
            else if (j === "J++"){
                j = "";
            }
            else if (k === "K++"){
                k = "";
            }
            write(x+" "+y+" "+z+" "+i+" "+j+" "+k);
        }

    }
    else if (line.startsWith("DWELL")){
        number_dt = line.split(" ")[2];
        number = number_dt.split(":")[1];
        if (line.includes("time")){
            write("G4 S" + number);
        }
        else if (line.includes("rev")){
            write("G4 R" + number);
        }            
    }
    else if (line.startsWith("ARCH")){
        elements = line.split(" ");
        direction = elements[20];
        radius = +elements[2];
        x = +elements[12];
        y = +elements[13];
        z = +elements[14];
        angle = +elements[22];

        if (direction === "cw"){
            direction = "G2";
        }
        else if (direction === "ccw"){
            direction = "G3";
        }
        if (angle > 180){
            radius = (-1)*radius;
        }
        write(direction + " X" + x + " Y" +  y + " Z" +  z + " R" +  radius);

    }
    else if (line.startsWith("#")){
        write(line);
    }
    else {
        write(line);
    }
}
}
export class Karlov_kod{
    gcoder(line){
        write(line);
    }
}
export class linux {
    constructor(settings){
    }
    gcoder(line){
        let elements;
        let type;
        let speed;
        let direction;
        let name;
        let magazine;
        let compensation;
        let x;
        let y;
        let z;
        let i;
        let j;
        let k;
        let centar_x;
        let centar_y;
        let centar_z;
        let kraj_x;
        let kraj_y;
        let kraj_z;
        let radius;
        let angle;
        let number_dt;
        let number;
        let cut_air;
        let plane;

console.log(line);

    if (line.startsWith("COMMENT")){
        line = line.replace("COMMENT:", ";");
        write(line);
    }
    else if (line.startsWith("ADD")){
        if (line.includes("RADIUS")){
            write("G8");
        }
        else if (line.includes("DIAMETER")){
            write("G9");
        }
    }
    else if (line.startsWith("UNIT")){
        if (line.includes("MM")){
            write("G21");
        }
        else if (line.includes("INCH")){
            write("G20");
        }
    }
    else if (line.startsWith("PLANE")){
        if (line.includes("xy")){
            write("G17");
            plane = "xy";
        }
        else if (line.includes("xz")){
            write("G18");
            plane = "xz";
        }
        else if (line.includes("zy")){
            write("G19");
            plane = "zy";
        }
    }
    else if (line.startsWith("TOOL")){
        let elements = line.split(" ");
        let name = elements[1];
        let magazine = elements[2];
        let compensation = elemnts[3];

        write(name + " " + magazine + " " + compensation);
    }
    else if (line.startsWith("SPINDLE")){
        if (line.includes("off")){
            number = elements[2].split(":")[1];
            write("M05 $"+number);
        }
        else if (line.includes("on")){
            elements = line.split(" ");
            speed = elements[3].split(":")[1];
            number = elements[4].split(":")[1];
            
            if(line.includes ("fix")){
                type = "G97";
            }
            else if (line.includes("surface")){
                type = "G96";
            }
            if (line.includes("ccw")){
                direction = "M03";
            }
            else if (line.includes("cw")){
                direction="M04";
            }
            write("S"+speed+" $"+num);
            write(type);
            write(direction+" $"+num);
        }
    }
    else if (line.startsWith("FEEDRATE")){
        elements = line.split(" ");
        speed = elements[2].split(":")[1];
        if (line.includes("time")){
            type = "G94";
        }
        else if (line.includes("rev")){
            type = "G95";
        }
        else if (line.includes("inver")){
            type = "G93";
        }
        write(type + " F" + speed);
    }
    else if (line.startsWith("COOLANT")){
        if (line.includes("off")){
            write("M09");
        }
        else if (line.includes("mist")){
            write("M07");
        }
        else if (line.includes("flood")){
            write("M08");
        }
    }
    else if (line.startsWith("AIR_PURGE")){
        if (line.includes("on")){
            write("M71");
        }
        else if (line.includes("off")){
            write("M72");
        }
    }
    else if (line.startsWith("MOVEMENT")){
        if (line.includes("incremental")){
            write("G91");
        }
        else if (line.includes("absolute")){
            write("G90");
        }
    }
    else if (line.startsWith("AIR")){
        cut_air = "G0";
    }
    else if (line.startsWith("CUT")){
        cut_air = G1;
    }
    else if (line.startsWith("END")){
        write("M30");
    }
    else if (line.startsWith("ERROR")){
        write(line);
    }
    else if (line.startsWith("LINE")){
        elements = line.split(" ");
        if (elements.length === 4 ){
            x = elements[1];
            y = elements[2];
            z = elements[3];

            if (x === "X++"){
                x = "";
            }
            if (y === "Y++"){
                y = "";
            }
            if (z === "Z++"){
                z = "";
            }
            write(cut_air+" "+x+" "+y+" "+z);
        }
        else if (elements.length === 7){
            x = elements[1];
            y = elements[2];
            z = elements[3];
            i = elements[4];
            j = elements[5];
            k = elements[6];

            if (x === "X++"){
                x = "";
            }
            else if (y === "Y++"){
                y = "";
            }
            else if (z === "Z++"){
                z = "";
            }
            else if (i === "I++"){
                i = "";
            }
            else if (j === "J++"){
                j = "";
            }
            else if (k === "K++"){
                k = "";
            }
            write(cut_air+" "+x+" "+y+" "+z+" "+i+" "+j+" "+k);
        }

    }
    else if (line.startsWith("DWELL")){
        number_dt = line.split(" ")[2];
        number = number_dt.split(":")[1];
        if (line.includes("time")){
            write("G4 P" + number);
        }
        else if (line.includes("rev")){
            write("ERROR DWELL MUST BE SET IN TIME (seconds) FOR LinuxCNC");
        }            
    }
    else if (line.startsWith("ARCH")){
        elements = line.split(" ");
        direction = elements[20];
        radius = +elements[2];
        bx = +elements[4];
        by = +elements[5];
        bz = +elements[6];
        cx = +elements[8];
        cy = +elements[9];
        cz = +elements[10];
        x = +elements[12];
        y = +elements[13];
        z = +elements[14];
        angle = +elements[22];

        if (direction === "cw"){
            direction = "G2";
        }
        else if (direction === "ccw"){
            direction = "G3";
        }
        if (angle > 180){
            radius = (-1)*radius;
        }
        let incx = (cx-x);
        let incy = (cy-y);
        let incz = (cz-z);


        if (plane === "xy"){
            write(direction+" X"+x+" Y"+y+" I"+incx+" J"+incy);
        }
        else if (plane === "xz"){
            write(direction+" X"+x+" Z"+z+" I"+incx+" K"+incz);
        }
        else if (plane === "yz"){
            write(direction+" Y"+y+" Z"+z+" J"+incy+" K"+incz);
        }

    }
    else if (line.startsWith("#")){
        write(line);
    }
    else {
        write(line);
    }
}
}
{}
[]