import {write} from "./output.js";

export class WinNC_sinumerik{
    constructor(settings){
        this.tool_i;
        this.tool_j;
        this.tool_k;
        this.multax = false;
        this.ax_dir;
        this.spindle_dir;
        this.rapid = false;
        this.post_cycle = false;
        this.ls_x;
        this.ls_y;
        this.ls_z;

    }
    gcoder(line){
        let elements;
        let movement;
        let type;
        let speed;
        let direction;
        let name;
        let magazine;
        let compensation;
        let x;
        let y;
        let z;
        let x_2;
        let y_2;
        let z_2;
        let i;
        let j;
        let k;
        let i_2;
        let j_2;
        let k_2;
        let vektor2_x;
        let vektor2_y;
        let vektor2_z;
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
        let pre_data;
        let data;
        let coord;
        let cancel;
        let bottom;
        let plane;
        let turn;
        let D;

        let el_0;
        let el_1;
        let el_2;
        let el_3;
        let el_4;
        let el_5;
        let el_6;
        let el_7;
        let el_8;
        let el_9;
        let r;
        let d;
        let left;
        let next_peck;

        let start;

    console.log(line);

    if (line.startsWith ("COMMENT")){
            line = line.replace("COMMENT:", "COMMENT: ");
    }

    elements = line.split(" ");
    start = line.split(/[\/,:\s]+/);

    switch (start[0]){

        case "COMMENT":
        elements = line.split("COMMENT:")[1].trim();
        if (elements !== ""){
        write(";"+elements);
        }
        break;
    
        case "ADD":
        if (line.includes("RADIUS")){
            write("DIAMOF");
        }
        else if (line.includes("DIAMETER")){
            write("DIAMON");
        }
        break;
    
        case "UNIT":
        if (line.includes("MM")){
            write("G71");
        }
        else if (line.includes("INCH")){
            write("G70");
        }
        break;
    
        case "PLANE":
        if (line.includes("xy")){
            write("G17");
        }
        else if (line.includes("xz")){
            write("G18");
        }
        else if (line.includes("zy")){
            write("G19");
        }
        break;
    
        case "TOOL":
        name = elements[1];
        magazine = elements[2];
        compensation = elements[3];

        write(name + " " + magazine + " " + compensation);
        this.rapid =false;

        break;
    
        case "SPINDLE":
        if (line.includes("off")){
            write("M05");
        }
        else if (line.includes("on")){
            
            speed = elements[3].split(":")[1];
            
            if(line.includes ("fix")){
                type = "G97";
            }
            else if (line.includes("surface")){
                type = "G96";
            }
            if (line.includes("ccw")){
                direction = "M04";
                this.spindle_dir = "ccw";
            }
            else if (line.includes("cw")){
                direction = "M03";
                this.spindle_dir = "cw";
            }
            write(type+" S"+speed+" "+" "+direction);
        }
        break;
    
        case "FEEDRATE":
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
        break;
    
        case "COOLANT":
        if (line.includes("off")){
            write("M09");
        }
        else if (line.includes("mist")){
            write("M07");
        }
        else if (line.includes("flood")){
            write("M08");
        }
        break;
    
        case "AIR_PURGE":
        if (line.includes("on")){
            write("M71");
        }
        else if (line.includes("off")){
            write("M72");
        }
        break;
    
        case "MOVEMENT":
        if (line.includes("incremental")){
            write("G91");
        }
        else if (line.includes("absolute")){
            write("G90");
        }
        break;
    
        case "TLAXIS":
        this.tool_i = +elements[1];
        this.tool_j = +elements[2];
        this.tool_k = +elements[3];
        break;
    
        case "AIR":
        if (!this.rapid){
            write("G0");
            this.rapid = true;
        }
        this.post_cycle = false;
        break;
    
        case "CUT":
        if (this.rapid){
            write("G1");
            this.rapid = false;
        }
        this.post_cycle = false;
        break;
    
        case "END":
        write("M30");
        break;
    
        case "ERROR":
        write(line);
        break;
    
        case "MULTAX":
        if (line.includes("on")){
            this.multax = true;
            write("NO MULTI AXIAL WORK SUPPORTED");
        }
        else {
            this.multax = false;
        }
        break;
    
        case "LINE":
        elements = line.split(/ +/);
        if (elements.length === 4 ){
            x = elements[1];
            y = elements[2];
            z = elements[3];

            x_2 = String(x).replace(/^X/, "");
            y_2 = String(y).replace(/^Y/, "");
            z_2 = String(z).replace(/^Z/, "");

            if (x === "X++"){
                x = "";
            }
            else {
                this.ls_x = +x_2;
            }
            if (y === "Y++"){
                y = "";
            }
            else {
                this.ls_y = +y_2;
            }
            if (z === "Z++"){
                z = "";
            }
            else {
                this.ls_z = +z_2;
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
        break;
    
        case "DWELL":
        number_dt = line.split(/ +/)[2];
        number = number_dt.split(":")[1];
        if (line.includes("time")){
            write("G4 S" + number);
        }
        else if (line.includes("rev")){
            write("G4 R" + number);
        }            
        break;
    
        case "ARCH":
        elements = line.split(/ +/);
        direction = elements[20];
        radius = +elements[2];
        x = +elements[12];
        y = +elements[13];
        z = +elements[14];
        angle = +elements[22];

        x_2 = String(x).replace(/^X/, "");
        y_2 = String(y).replace(/^Y/, "");
        z_2 = String(z).replace(/^Z/, "");

        this.ls_x = +x_2;
        this.ls_y = +y_2;
        this.ls_z = +z_2;

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
        this.rapid = false;
        break;
    
        case "#":
        write(line);
        break;
    
        case "COMPENSATION":
        compensation = line.split(":")[1];
        compensation = compensation.trim();
        switch (compensation) {
                case "TR":
                    elements ="1";
                    break;
                case "TL":
                    elements ="2";
                    break;
                case "BL":
                    elements ="3";
                    break;
                case "BR":
                    elements ="4";
                    break;
                case "CR":
                    elements ="5";
                    break;
                case "TC":
                    elements ="6";
                    break;
                case "CL":
                    elements ="7";
                    break;
                case "BC":
                    elements ="8";
                    break;
                case "CC":
                    elements ="9";
                    break;
                default:
                    elements ="OFF";
            }
        write("Go to https://github.com/karlo-c277/APT-Gcode/blob/main/DOCUMENTATIONS/Images/image.png to confirm that all tools have matching tool compensation. This one is "+elements);
        break;
    
        case "CYCLE":
        elements = line.split("/");

        data = elements[1].trim().split(/\s+/);

        el_0 = data[0].trim();
        el_1 = +data[1];
        el_2 = +data[2];
        el_3 = +data[3];
        el_4 = +data[4];
        el_5 = +data[5];
        el_6 = +data[6];
        el_7 = +data[7];

        number = elements[0].trim();
        number = number.split(":")[2];
        number_dt = number.match(/\([^)]*\)/g);

        if (this.multax===false){
            if (Math.abs(this.tool_i) === 1){
                write("G19");
                this.ax_dir = this.tool_i;
            }
            else if (Math.abs(this.tool_j) === 1){
                write("G18");
                this.ax_dir = this.tool_j;
            }
            else if (Math.abs(this.tool_k) === 1){
                write("G17");
                this.ax_dir = this.tool_k;
            }
        }
        else {
            write("ERROR: Multi axial work is not supported");
        }
        for (const xyz of number_dt){
            if (this.multax===false){
                if (Math.abs(this.tool_i) === 1){
                        elements = xyz.slice(1, -1).trim().split(/\s+/);
                        x = elements[0].trim();
                        y = elements[1].trim();
                        z = elements[2].trim();

                        x = Number(x.slice(1));
                        kraj_x = x-(el_1+el_4);
                        bottom = ("X" + kraj_x);
                        d = "X";

                        r = (x - el_4 + el_4*0.2);

                        coord = (y + " " + z);
                }
                else if (Math.abs(this.tool_j) === 1){
                        elements = xyz.slice(1, -1).trim().split(/\s+/);
                        x = elements[0].trim();
                        y = elements[1].trim();
                        z = elements[2].trim();

                        y = Number(y.slice(1));
                        kraj_y = y-(el_1+el_4);
                        bottom = ("Y" + kraj_y);
                        d = "Y";

                        r = (y - el_4 + el_4*0.2);

                        coord = (x + " " + z);
                }
                else if (Math.abs(this.tool_k) === 1){
                        elements = xyz.slice(1, -1).trim().split(/\s+/);
                        x = elements[0].trim();
                        y = elements[1].trim();
                        z = elements[2].trim();

                        z = Number(z.slice(1));
                        kraj_z = z-(el_1+el_4);
                        bottom = ("Z" + kraj_z);
                        d = "Z";

                        r = (z - el_4 + el_4*0.2);

                        coord = (x + " " + y + "R"+r+" "+bottom);
                }
                else {
                    console.log("ERROR");
                }
                x_2 = String(x).replace(/^X/, "");
                y_2 = String(y).replace(/^Y/, "");
                z_2 = String(z).replace(/^Z/, "");
            }
            else {
                write("NO MULTI AXIAL WORK SUPPORTED");
                console.error("MULTI AXIAL WORK TYPE");
            }
        
        if (el_0.includes("DRILL_1")){
            el_8 = +data[8];
            el_9 = +data[9];

            if (el_3 === 0 && el_7 === 0 && el_8 === 0 && el_9 === 0) {
                write("G97 S" + el_6);
                write("G291");
                write("G98");

                pre_data = "G84";
                data = ("F"+el_5);

                write(pre_data +" "+ coord +" "+ data);
                write("G80");
                write("G290");
                this.post_cycle = true;
            }
            else if (el_7 === 0 && el_8 === 0 && el_9 === 0) {
                write("G97 S" + el_6);
                write("G291");
                write("G98");

                pre_data = "G82";
                data = "P" + (el_3*1000) + " F"+el_5;

                write(pre_data +" "+ coord +" "+ data);
                write("G80");
                write("G290");
                this.post_cycle = true;
            }
            else {
                if (el_7 === 0){
                    el_7 = el_1;
                }

                next_peck=(el_7*this.ax_dir);
                el_9 = (el_9*this.ax_dir);

                write("G0 X" + x_2 + " Y" + y_2 + " Z" + z_2);
                write("G91");
                write("G95 F" + el_5);
                write("G97 S" + el_6);

                let currentDepth = 0;

                while (true){
                    left = el_1 - currentDepth;

                    if (Math.abs(currentDepth + next_peck) >= el_1) {
                        break;
                    }
                    currentDepth += next_peck;

                    write("G1 " + d + next_peck);
                    if (el_3 !== 0){
                        write("G4 F"+el_3);
                    }

                    next_peck = (next_peck*(1-el_8));

                    if ((el_9 !== 0) && (Math.abs(currentDepth + next_peck) >= el_1)){
                        write("G0 " + d + (el_9*(-1)));
                        write ("G1 " + d + el_9);
                    }
                    else {
                        write("G0 " + d + (el_9*(-1)));
                        write("G1 " + d + (el_9+next_peck));
                    }                
                }
                write("G1 " + (currentDepth-el_1));
                write("G90");
                write("G0 X" + x_2 + " Y" + y_2 + " Z" + z_2);
                this.rapid = true;

            }
            
        }
        else if (el_0.includes("DRILL_2")){
            if (el_3 === 0 && el_8 === 0){
                write("G97 S" + el_6);
                write("G291");
                write("G98");

                pre_data = "G83";
                data = "Q" + el_7 + " F"+el_5;

                write(pre_data +" "+ coord +" "+ data);
                write("G80");
                write("G290");
                this.post_cycle = true;
            }
            else {
                if (el_7 === 0){
                    el_7 = el_1;
                }

                next_peck=(el_7*this.ax_dir);
                el_9 = (el_9*this.ax_dir);

                write("G0 X" + x_2 + " Y" + y_2 + " Z" + z_2);
                write("G91");
                write("G95 F" + el_5);
                write("G97 S" + el_6);

                while (true){
                    if (Math.abs(currentDepth + next_peck) >= el_1) {
                        break;
                    }
                    currentDepth += next_peck;

                    write("G1 " + d + next_peck);
                    if (el_3 !== 0){
                        write("G4 F"+el_3);
                    }

                    next_peck = (next_peck*(1-el_8));

                    if ((el_9 !== 0) && (Math.abs(currentDepth + next_peck) >= el_1)){
                        write("G0 " + d + (currentDepth*(-1)));
                        write ("G1 " + d + currentDepth);
                    }
                    else {
                        write("G0 " + d + (currentDepth*(-1)));
                        write("G1 " + d + (currentDepth+next_peck));
                    }                
                }
                write("G1 " + (currentDepth-el_1));
                write("G90");
                write("G0 X" + x_2 + " Y" + y_2 + " Z" + z_2);
                this.rapid = true;

            }
        }
        else if (el_0.includes("REAM")){

            if (el_7 !== 0 && el_7 !== el_5 && el_3 !== 0){
                write("G0 X" + x_2 + " Y" + y_2 + " Z" + z_2);
                write("G91");
                write("G95 F" + el_5);
                write("G97 S" + el_6);

                if (el_3 !== 0){
                    write("G4 F"+el_3);
                }
                write("G1 " + d + (el_1*this.ax_dir));
                write("F"+el_7);
                write("G90");
                write("G1 X" + x_2 + " Y" + y_2 + " Z" + z_2);
                this.rapid = false;
            }
            else {
                write("G97 S" + el_6);
                write("G291");
                write("G98");

                write("G85 " + coord + " F" + el_5);

                write("G80");
                write("G290");
                this.post_cycle = true;
            }
        }
        else if (el_0.includes("TAP")){
            write("G97 S" + el_6);
            write("G291");
            write("G98");
            if (this.spindle_dir === "cw"){
                pre_data = "G84";
            }
            else {
                pre_data = "G74";
            }
            data = ("F"+el_5);

            write(pre_data +" "+ coord +" "+ data);
            write("G80");
            write("G290");
            this.post_cycle = true;
        }

        this.ls_x = +x_2;
        this.ls_y = +y_2;
        this.ls_z = +z_2;
        }
        break;
        
        case "SINUS":
            write("ERROR this controler does not support sinusoidal movement");
            break;

        case "HELIX":
        elements = line.split(/[:\s]+/);
        centar_x = +elements[2];
        centar_y = +elements[3];
        centar_z = +elements[4];
        this.ls_i = +elements[6];
        this.ls_j = +elements[7];
        this.ls_k = +elements[8];
        i_2 = +elements[10];
        j_2 = +elements[11];
        k_2 = +elements[12];
        number = +elements[14];
        radius = +elements[16];
        kraj_x = +elements[18];
        kraj_y = +elements[19];
        kraj_z = +elements[20];
        
        if (Math.abs(j_2) === 1){
                        vektor2_x = this.ls_x - centar_x;
                        vektor2_z = this.ls_z - centar_z;
                        D = this.ls_i * vektor2_z - vektor2_x * this.ls_k;
        
                        if (D<0){
                            movement = "G2";
                        }
                        else if (D>0){
                            movement = "G3";
                        }
                        else {
                            write("ERROR CIRCLE CENTER XZ IS ON THE CIRCLE TANGENT " + line)
                        }
                        coord = ("I"+centar_x+" K"+centar_z);
                        turn = Math.trunc(Math.abs(centar_y-kraj_y)/number);
        }
        else if (Math.abs(k_2)=== 1){
                            vektor2_x = this.ls_x - centar_x;
                            vektor2_y = this.ls_y - centar_y;
                            D = this.ls_i * vektor2_y - vektor2_x * this.ls_j;

                            console.log(this.ls_x+" "+centar_x+" "+this.ls_y+" "+centar_y);

                            console.log(vektor2_x);
                            console.log(vektor2_y);
        
                            if (D<0){
                                movement = "G2";
                            }
                            else if (D>0){
                                movement = "G3";
                            }
                            else {
                                write("ERROR CIRCLE CENTER XY IS ON THE CIRCLE TANGENT " + line)
                            }
                            coord = ("I"+centar_x+" J"+centar_y);
                            turn = Math.trunc(Math.abs(centar_z-kraj_z)/number);
        }
        else if (Math.abs(i_2) === 1){
                            vektor2_y = this.ls_y - centar_y;
                            vektor2_z = this.ls_z - centar_z;
                            D = this.ls_j * vektor2_z - vektor2_y * this.ls_k;
        
                            if (D<0){
                            movement = "G2";
                            }
                            else if (D>0){
                                movement = "G3";
                            }
                            else {
                                write("ERROR CIRCLE CENTER ZY IS ON THE CIRCLE TANGENT " + line)
                            }
                            coord = ("J"+centar_y+" K"+centar_z);
                            turn = Math.trunc(Math.abs(centar_x-kraj_x)/number);
        }
        write(movement+" X"+kraj_x+" Y"+kraj_y+" Z"+kraj_z+" "+coord+" TURN="+turn);
        this.ls_x = +kraj_x;
        this.ls_y = +kraj_y;
        this.ls_z = +kraj_z;
        break;
    
        default:
        write("UNREGISTERD CYCLE" + line);
        break;
}
}
}
export class Karlov_kod{
    gcoder(line){
        write(line);
    }
}