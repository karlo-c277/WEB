import { wError } from "./output.js";
import {write, checkVector, getPlane, findDirection} from "./output.js";

export function header(){
    let name = document.getElementById("customFilename").value.trim()
    if (document.getElementById("preset").value === "custom"){
        write(document.getElementById("output_header").value);
    }
    else{
        write("%_N_{"+name+"}_MPF");
        write("#DEFINE THE WORKPIECE");
        write("G71\nG55\nDIAMOF");
    }
}

export function compensation_chg(el){
    if(el.length === 7 && el.every((x,i)=> i in el && x !== undefined && x.trim()!=="")){
        write("For correction register nr. "+el[1].trim()+", tool tip quadrant is P"+el[2].trim()+", tool offset values are X"+el[3].trim()+", Y"+el[4].trim()+", Z"+el[5].trim()+", nose radius is "+el[6].trim());
        return true;
    }
    else{
        return false;
    }
}

export function tlaxis(el){
    let vals;
    if (el.length === 4){
        vals = checkVector(+el[1],+el[2],+el[3]);
        if (!vals[2]){
            return [false, "notSingleVec"];
        }
        else{
            return [true,+el[1],+el[2],+el[3]];
        }
    }
    else{
        return [false, "length"];
    }
}

export function loadtl(el){
    if ((el.length == 3)&&(el[1].trim()!=="")&&(el[2].trim()!=="")){
        write("For tool on slot nr."+el[1].trim()+" the set compensation register is: "+el[2].trim());
        return true;
    }
    else{
        return false;
    }
}

export function selectl(el){
    if (el != "undefined" && el.trim()!== ""){
        writeComment(";"+el);
        return true;
    }
    else{
        return false;
    }
}

export function insideToler(el){
    if (el != "undefined" && el.trim()!== ""){
        writeComment("Inside path tolerance is "+el);
        return true;
    }
    else{
        return false;
    }
}

export function outsideToler(el){
    if (el != "undefined" && el.trim()!== ""){
        writeComment("Outside path tolerance is "+el);
        return true;
    }
    else{
        return false;
    }
}

export function Toler(el){
    if (el != "undefined" && el.trim()!== ""){
        writeComment("Path tolerance is "+el);
        return true;
    }
    else{
        return false;
    }
}

export function programEnd(el){
    if (el){
        write("M30");
        return true;
    }
    else{
        return false;
    }
    
}

export function partno(el){
    if (el != "undefined" || el.trim()!== ""){
        writeComment(el);
        return true;
    }
    else{
        return false;
    }
}

export function tlon(line, start_x, start_y, start_z, tan_x, tan_y, tan_z){
    if (!(line.includes("GOFWD"))){
        return [false];
    }
    else{
        if (line.includes("CIRCLE")){
            D = circle(line,start_x, start_y, start_z, tan_x, tan_y, tan_z);
            return [true, "circle", D];
        }
        else if (line.includes("CYLNDR")){
            D = sinus(line,start_x, start_y, start_z, tan_x, tan_y, tan_z);
            return [true, "sinus", D];
        }
        else{
            return [true, false];
        }
    }
}

export function sinus(){
    wError("This controler does not support sinusoidal movement");
}

export function circle(line, start_x, start_y, start_z, tan_x, tan_y, tan_z){
    line = line.replace(/[()]/g, "");
    let elements = line.split(/[,/]/);

    if (elements.includes("INTOF")){
        ["ON", "INTOF"].forEach(r => {
        const i = elements.indexOf(r);
        if (i !== -1) elements.splice(i, 1);
        });
    }


    let center_x = +elements[3];
    let center_y = +elements[4];
    let center_z = +elements[5];
    let end_x = +elements[12];
    let end_y = +elements[13];
    let end_z = +elements[14];
    let direction;
    let D;
    let report_data;
    let report_data2;

    D = getPlane(
        ["cor",center_x,center_y,center_z],
        ["cor",end_x,end_y,end_z],
        ["cor",start_x,start_y,start_z],
        ["vec",tan_x,tan_y,tan_z]
    );
    if (D === null){
        write("ERROR with plane definition not enough data to define a plane, check console log");
        console.error("ERROR with plane definition not enough data to define a plane, this are the given inputs",{
        center:     ["cor",center_x,center_y,center_z],
        end:        ["cor",end_x,end_y,end_z],
        start:      ["cor",start_x,start_y,start_z],
        tangent:    ["vec",tan_x,tan_y,tan_z]}
        );
        return [false];
    }
    else if (!D){
        write("ERROR with plane definition, check console log");
        console.error("ERROR with plane definition, this are the given inputs",{
        center:     ["cor",center_x,center_y,center_z],
        end:        ["cor",end_x,end_y,end_z],
        start:      ["cor",start_x,start_y,start_z],
        tangent:    ["vec",tan_x,tan_y,tan_z]}
        );
        return [false];
    }
    else{
        switch (D.trim()){
            case "xy":
                write("G17");
                direction =findDirection(tan_x,start_x,center_x,tan_y,start_y,center_y);
                report_data = [tan_x,start_x,center_x,tan_y,start_y,center_y];
                report_data2 ="tan_x,start_x,center_x,tan_y,start_y,center_y";
            break;
            case "xz":
                write("G18");
                direction =findDirection(tan_z,start_z,center_z,tan_x,start_x,center_x);
                report_data = [tan_z,start_z,center_z,tan_x,start_x,center_x];
                report_data2 ="tan_z,start_z,center_z,tan_x,start_x,center_x";
            break;
            case "yz":
                write("G19");
                direction =findDirection(tan_y,start_y,center_y,tan_z,start_z,center_z);
                report_data = [tan_y,start_y,center_y,tan_z,start_z,center_z];
                report_data2 ="tan_y,start_y,center_y,tan_z,start_z,center_z";
            break;
        }
    

        if (!direction){
            write("ERROR with direction definition check console log"+ report_data+"\n"+report_data2);
            console.error("ERROR with direction definition check this is the given data: "+ report_data+"\n"+report_data2);
            return [false];
        }
        else if (direction === "cw"){
            write("G2 X"+end_x+" Y"+end_y+" Z"+end_z+" I=AC("+center_x+") J=AC("+center_y+") K=AC("+center_z+")");
            return [true,[end_x,end_y,end_z]];
        }
        else{
            write("G3 X"+end_x+" Y"+end_y+" Z"+end_z+" I=AC("+center_x+") J=AC("+center_y+") K=AC("+center_z+")");
            return [true,[end_x,end_y,end_z]];
        }
    }
}

export function helix(start, center, tan, axis, info, end){
    let tan_x = +tan[0];
    let tan_y = +tan[1];
    let tan_z = +tan[2];

    let start_x = +start[0];
    let start_y = +start[1];
    let start_z = +start[2];

    let center_x = +center[0];
    let center_y = +center[1];
    let center_z = +center[2];

    let end_x = +end[0];
    let end_y = +end[1];
    let end_z = +end[2];

    let direction;
    let D;

    let turns = +info[3];
    D = getPlane(
        ["cor",...center],
        ["cor",...start],
        ["vec",...tan],
        ["axs",...axis]
    );
    if (D === null){
        write("ERROR with plane definition not enough data to define a plane, check console log");
        console.error("ERROR with plane definition not enough data to define a plane, this are the given inputs",{
        center:     ["cor",...center],
        axis:       ["axs",...axis],
        start:      ["cor",...start],
        tangent:    ["vec",...tan]}
        );
        return [false];
    }
    else if (!D){
        write("ERROR with plane definition, check console log");
        console.error("ERROR with plane definition, this are the given inputs",{
        center:     ["cor",...center],
        axis:       ["axs",...axis],
        start:      ["cor",...start],
        tangent:    ["vec",...tan]}
        );
        return [false];
    }
    else{
        switch (D.trim()){
            case "xy":
                write("G17");
                direction =findDirection(tan_x,start_x,center_x,tan_y,start_y,center_y);
                report_data = [tan_x,start_x,center_x,tan_y,start_y,center_y];
                report_data2 ="tan_x,start_x,center_x,tan_y,start_y,center_y";
            break;
            case "xz":
                write("G18");
                direction =findDirection(tan_z,start_z,center_z,tan_x,start_x,center_x);
                report_data = [tan_z,start_z,center_z,tan_x,start_x,center_x];
                report_data2 ="tan_z,start_z,center_z,tan_x,start_x,center_x";
            break;
            case "yz":
                write("G19");
                direction =findDirection(tan_y,start_y,center_y,tan_z,start_z,center_z);
                report_data = [tan_y,start_y,center_y,tan_z,start_z,center_z];
                report_data2 ="tan_y,start_y,center_y,tan_z,start_z,center_z";
            break;
        }
    

        if (!direction){
            write("ERROR with direction definition check console log"+ report_data+"\n"+report_data2);
            console.error("ERROR with direction definition check this is the given data: "+ report_data+"\n"+report_data2);
            return [false];
        }
        else if (direction === "cw"){
            write("G2 X"+end_x+" Y"+end_y+" Z"+end_z+" I"+center_x+" J"+center_y+" K"+center_z+" TURN="+turns);
            return [true,[end_x,end_y,end_z]];
        }
        else{
            write("G3 X"+end_x+" Y"+end_y+" Z"+end_z+" I"+center_x+" J"+center_y+" K"+center_z+" TURN="+turns);
            return [true,[end_x,end_y,end_z]];
        }
    }
}

export function godlta(coord, rapid, dim_typ, rapto, rapto_num, movement){
    let dim;
    let move;

    if (dim_typ !== "G91"){
        write("G91");
    }
    dim = "G91";

    if (rapid && (movement === "G1")){
        write("G1");
        move = "G1";
    }
    else if (movement === "G0"){
        write("G0");
        move = "G0";
    }
    
    if (rapto&& dist > rapto_num){
        let ratio;
        let rdtx;
        let rdty;
        let rdtz;
        let koord__x;
        let koord__y;
        let koord__z;
        let dist = Math.hypot(...coord);
        ratio = dist !== 0 ? rapto_num / dist : 0;
        rdtx = ratio*+coord[0];
        rdty = ratio*+coord[1];
        rdtz = ratio*+coord[2];
        koord__x = +coord[0]-rdtx;
        koord__y = +coord[1]-rdty;
        koord__z = +coord[2]-rdtz;

        write("G0");
        write("X" + rdtx + " Y" + rdty + " Z" + rdtz);
        if (move==="G1"){
            write("G1");
        }
        write("X" + koord__x + " Y" + koord__y + " Z" + koord__z);
    }
    else{
        write("X"+ coord[0]+" Y"+ coord[1]+" Z"+ coord[2]);
    }
    return[dim,move];
}

export function goto(ls_coord, coord, rapid, dim_typ, rapto, rapto_num, movement){
    let dim;
    let move;
    if (dim_typ !== "G90"){
        write("G90");
    }
    dim = "G90";

    if (rapid && (movement === "G1")){
        write("G1");
        move = "G1";
    }
    else if (movement === "G0"){
        write("G0");
        move = "G0";
    }
    if (rapto === true){
        let ratio;
        let rdtx;
        let rdty;
        let rdtz;
        let dtx = +ls_coord[0] - +coord[0];
        let dty = +ls_coord[1] - +coord[1];
        let dtz = +ls_coord[2] - +coord[2];
        let dist = Math.hypot(dtx, dty, dtz);
        if (dist >= rapto_num){
            ratio = dist !== 0 ? rapto_num / dist : 0;
            rdtx = ratio*dtx+ +coord[0];
            rdty = ratio*dty+ +coord[1];
            rdtz = ratio*dtz+ +coord[2];
            write("G0");
            write("X" + rdtx + " Y" + rdty + " Z" + rdtz);
            if (move==="G1"){
                write("G1");
            }
        }
    }
    write("X"+ coord[0] + " Y" +coord[1] + " Z" + coord[2]);
    return [dim,move];

}

export function spindle(typ, spindle){
    switch (typ){
        case "on":
            if (spindle.length === 3){
                    write(spindle[0]+" "+spindle[1]+" S"+spindle[2]);
                    return [true];
            }
            else{
                return [false];
            }

        case "off":
            write("M05");
        break;

        case "lock":
            write("WARNING no specific spindle LOCK syntacs, M05 was used\nM05");
        break;

        case "set":
            let el1;
            let el3;
            if(spindle[0].trim() === "RPM"){
                el1 = "G97";
            }
            else if (spindle[0].trim() === "SFM"){
                el1 = "G96";
            }
            else{
                return [false,"typ"];
            }

            if(spindle[1].trim() === "CLW"){
                el3 = "M03";
            }
            else if (spindle[1].trim() === "CCLW"){
                el3 = "M04";
            }
            else{
                return [false,"dir"];
            }

            write(el3+" "+el1+" S"+spindle[2].trim());
            return [el3,el1,spindle[2].trim()];   
            
        case "max":
            write("G26 "+spindle);
        break;
    }
}

export function feed(typ, value){
    if (typ.trim() === "MMPR"){
        typ = "G95";
    }
    else if (typ.trim() === "MMPM"){
        typ = "G96";
    }
    else{
        return [false, true];
    }
    if (!value){
        return [false, false];
    }
    write(typ+" F"+value);
    return [typ, value];
}

export function coolant(typ, coolant){
    switch(typ){
        case "FLOOD":
            write("M8");
            return [true, "M8"];
        
        case "MIST":
            write("M7");
            return [true, "M7"];

        case "ON":
            write(coolant);
            return  [true, coolant];

        case "OFF":
            write("M9");
            return [true, "M9"];
        default:
            return [false];
    }
}

export function airPurge(state){
    if (state === "ON"){
        write("M71");
        return true;
    }
    else if (state === "OFF"){
        write("M72");
        return true;
    }
    else{
        return false;
    }
}

export function delay(val, typ){
    if (typ === "REV"){
        write("G4 S"+val);
    }
    else{
        write("G4 R"+val);
    }
}

export function cycle(name, general, specific, coords, tlaxis){
    
    if (name){
        write(";"+name);
    }
    else{
        return ["name"];
    }
    let total_depth = +general[0];
    let clearance = +general[1];
    let feed_1 = +general[2];
    let feed_typ = general[3].trim();
    let spindle_ = +general[4];
    let spindle_unit = general[5].trim();
    let retract = +general[6];
    let feed_2 = +general[7];
    let dir;
    let pos;

    let dwell = false;
    let peck_y = false;
    let peck_d = false;

    let cyc_dwell;
    let peck;
    let decrement;
    let decrement_limit;
    let D;

    if (!retract){
        feed_2 = "rapid";
    }
    switch (specific[0].trim()){
        case "CY1":
            dwell = true;
            if (+specific[1] === 1){
                cyc_dwell = "G4 S"+ specific[2].trim();
            }
            else if (+specific[1] === 2){
                cyc_dwell = "G4 R"+ specific[3].trim();
            }
            else{
                cyc_dwell = "";
            }
        break;
        case "CY2":
        case "CY3":
            dwell = true;
            peck_y = true;
            if (+specific[1] === 1){
                cyc_dwell = "G4 S"+ specific[2].trim();
            }
            else if (+specific[1] === 2){
                cyc_dwell = "G4 R"+ specific[3].trim();
            }
            else{
                cyc_dwell = "";
            }
            peck = +specific[4];
            decrement = +specific[5];
            decrement_limit = +specific[6];
        break;
    }
    if (specific[0].trim()=== "CY3"){
        peck_d = true;
    }

    if (Math.abs(+tlaxis[2])+Math.abs(+tlaxis[0])+Math.abs(+tlaxis[1]) !== 1) {
        wError("Tlaxis is not valid "+tlaxis);
        return ["tlaxisSum"];
    }
    else if(Math.abs(+tlaxis[2])=== 1){
        dir = "Z";
        if (+tlaxis[2] > 0){
            pos = 1;
        }
        else{
            pos = -1;
        }
    }
    else if(Math.abs(+tlaxis[0])=== 1){
        dir = "X";
        if (+tlaxis[0] > 0){
            pos = 1;
        }
        else{
            pos = -1;
        }
    }
    else if(Math.abs(+tlaxis[1])=== 1){
        dir = "Y";
        if (+tlaxis[1] > 0){
            pos = 1;
        }
        else{
            pos = -1;
        }
    }
    else{
        wError("ERROR: tlaxis not valid");
        return ["tlaxisNot1"];
    }

    for (const set of coords){
        let x = +set[0];
        let y = +set[1];
        let z = +set[2];
        let coord = "X"+x+" Y"+y+" Z"+z;
        
        write("G0 "+coord);
        write("G91");
        write(dir+(clearance* pos));

        if (feed_typ === "MMPR"){
            write("G95 F"+feed_1);
        }
        else{
            write("G94 F"+feed_1);
        }

        if (spindle_unit === "RPM"){
            write ("G97 S"+spindle_);
        }
        else{
            write ("G96 S"+spindle_);
        }
        D = total_depth

        if (peck_y){
            let loop_nr = 0;
            let currentPeck = peck;
            let remaining = total_depth;

            while (remaining > 0){
                if (!peck_d){
                    if (loop_nr <= decrement_limit && currentPeck >= 0.05 * peck){
                        currentPeck = peck * Math.pow((1 - decrement), loop_nr);
                    }
                    loop_nr += 1;
                }
                else {
                    currentPeck = peck;
                }

                let peck_this = Math.min(currentPeck, remaining);
                write("G1 " + dir + (peck_this * pos));
                remaining -= peck_this;

                if (dwell){
                    write(cyc_dwell);
                }
            }
        }
        else {
            write("G1 " + dir + (total_depth * pos));
            if (dwell){
                write(cyc_dwell);
            }
        }

        write("G1 "+dir+(D*pos));
        if (dwell){
            write(cyc_dwell);
        }

        if (feed_2 === "rapid"){
            write("G90");
            write("G0 "+coord);
        }
        else{
            if (feed_typ === "MMPR"){
                write("G95 F"+feed_2);
            }
            else{
                write("G94 F"+feed_2);
            }
            write("G90");
            write(coord);
        }
    }
}

export function psis(i,j,k){
    let D = getPlane(["axs",i,j,k]);
    if (D === null){
        write("ERROR with plane definition not enough data to define a plane, check console log");
        console.error("ERROR with plane definition not enough data to define a plane, this are the given inputs",{
        axis:       ["axs",...axis]}
        );
        return [false];
    }
    else if (!D){
        write("ERROR with plane definition, check console log");
        console.error("ERROR with plane definition, this are the given inputs",{
        axis:       ["axs",...axis]}
        );
        return [false];
    }
    else{
        switch (D.trim()){
            case "xy":
                write("G17");
            break;
            case "xz":
                write("G18");
            break;
            case "yz":
                write("G19");
            break;
        }
    }
}

export function cutcom(value, general, ps, ds){
    switch (value.trim()){
        case "ON":
            write(general);
            return [true, general, ps, ds];
            return 
        case "LEFT":
            write("G41");
            return [true, "G41", ps, ds];
        case "RIGHT":
            write("G42");
            return [true, "G42", ps, ds];
        case "OFF":
            write("G40");
            return [true, general, ps, ds];
        case "NORMDS_ON":
            wError("Unknown command NORMDS_ON");
            return [false, general, ps, "normds_on"];
        case "NORMDS_OFF":
            wError("Unknown command NORMDS_OFF");
            return [false, general, ps, "normds_off"];
        case "NORMPS_ON":
            wError("Unknown command NORMPS_ON");
            return [false, general, ps, "normds_on"];
        case "NORMPS_OFF":
            wError("Unknown command NORMPS_OFF");
            return [false, general, ps, "normds_off"];
    }
}

export function change_tool(name){
    if (name){
        write("T="+name);
        return [true];
    }
    else{
        return [false, "name"];
    }
}

export function writeComment(el){
    if (el){
        write(";"+el);
        return true;
    }
    else{
        return false;
    }
    
}
