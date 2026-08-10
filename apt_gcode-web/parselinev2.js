import {kk} from "./output.js";
import {getSettings} from "./settings.js";



export class catiav5_1_0{
    constructor(settings){
            this.tolr_coord = 1e-3;
            this.lsplane = "";
            this.lsrotation = "";
            this.ls_tip_rev = "";
            this.ls_tip_posmak = "";
            this.lssklop = "";
            this.ls_x = "";
            this.ls_y = "";
            this.ls_z = "";
            this.ls_i = "";
            this.ls_j = "";
            this.ls_k = "";
            this.ls_spindle_speed = 0.0;
            this.ls_on_rotation = "";
            this.ls_dim_typ = "";
            this.ls_clnt_typ = "";
            this.ls_cycle = "";
            this.lsunits = "";
            this.comments = ["TPRINT", "PPRINT", "LOADTL", "TOOLNO", "REWIND", "SELECTL", "CUTTER", "INTOL", "OUTTOL", "TOLER", "FINI", "END", "PARTNO", "OPERATION NAME", "TLAXIS", "CUTCOM"];
            this.non_def = ["SWITCH", "PPFUN", "GO", "INDIRP"];
            this.lsautops = 0;
            this.ls_feed_speed = 0.0;
            this.ls_ls_movement;
            this.rapto=0;
            this.header="";
        }
    parseline(line){
            let elements;
            let centar_x;
            let centar_y;
            let centar_z;
            let centar2_x;
            let centar2_y;
            let centar2_z;
            let kraj_x;
            let kraj_y;
            let kraj_z;
            let vektor2_x;
            let vektor2_y;
            let vektor2_z;
            let D;
            let movement;
            let koord;
            let koord_x;
            let koord_y;
            let koord_z;
            let x;
            let y;
            let z;
            let dist;
            let ratio;
            let rdtx;
            let rdty;
            let rdtz;
            let koord__x;
            let koord__y;
            let koord__z;
            let dtx;
            let dty;
            let dtz;
            let spindlDT;
            let num;
            let rotation;
            let rotation_typ;
            let feednumf;
            let tool_slot;
            let cutter;
            let intol;
            let outol;
            let toler;
            let feed;
            let numf;
            let dwell;
            let revs;
            let radius;
            let start;
            let end;
            let angle;
            let direction;

console.log(line);

        if (this.header === ""){
            kk(window.add_command);
            this.header = "yes";
        }
        if (!line || !line.trim()) return;

        if (line.startsWith("UNITS")){
            if (line.includes("MM")){
                if (this.lsunits !== "UNIT: MM"){
                    kk("UNIT: MM");
                    this.lsunits = "UNIT: MM";
                }
            } else if (line.includes("INCH")){
                if (this.lsunits !== "UNIT: INCH"){
                    kk("UNIT: INCH");
                    this.lsunits = "UNIT: INCH";
                }
            } else {
                kk("ERROE: Unknown unit type " + line);
            }
        }                          
        else if (this.comments.some(word => line.startsWith(word))){
            if (line.startsWith("LOADTL/") || line.startsWith("SELECTL/")){
                 tool_slot = line.split("/")[1].trim();
                kk("COMMENT:Magazine slot number: " + tool_slot);
            }
            else if (line.startsWith("CUTTER/")){
                let unit = (this.lsunits === "UNIT: MM" || line.includes("MM")) ? "MM" : "INCH";
                if (line.split(/[,\/()]+/).length < 3){
                     cutter = line.split("/")[1].trim();
                    kk("COMMENT:Tool cutter radius: " + cutter + " " + unit);
                }
                else if (line.split(/[,\/()]+/).length >=3){
                     cutter = line.split("/")[1].trim();
                    kk("COMMENT:Tool cutter radius: " + cutter + " " + unit);
                }
            }
            else if (line.startsWith("INTOL/")){
                 intol = line.split("/")[1].trim();
                kk("COMMENT:Inside tolerance from the path: " + intol + this.ls_units_word);
            }
            else if (line.startsWith("OUTOL/")){
                 outtol = line.split("/")[1].trim();
                kk("COMMENT:Outside tolerance from the path: "+ outtol + this.ls_units_word);
            }
            else if (line.startsWith("TOLER/")){
                 toler = line.split("/")[1].trim();
                kk("COMMENT:Tolerance from the path: " + toler + this.ls_units_word);
            }
            else if (line.startsWith("FINI") || line.startsWith("END")){
                kk("COMMENT:End of program")
            }
            else if (line.startsWith("PARTNO")){
                 line = line.replace(/^PARTNO/, "COMMENT:Part number: ");
                kk(line);
            }
            else if (line.startsWith("OPERATION NAME")){
                 line = line.replace(/^OPERATION NAME/, "COMMENT:").replace(/^:/, "");
                kk(line);
            }
            else if (line.startsWith("TLAXIS")){
                 elements = line.split(" ");
                kk("COMMENT:Tool axies are I" + elements[1].trim() + " J" + elements[2].trim() + " K" + elements[3].trim());
            }
            else if (line.startsWith("PPRINT")|| line.startsWith("TPRINT") ){
                line=line.split("/")[1]
                kk("COMMENT: ")
            }
            else {
                kk("COMMENT: " + line);
            }
        }
        else if (line.startsWith("AUTOPS")){
            this.autops = 1;
        }
        else if (line.includes("CIRCLE") ){
             elements = line.split(/[,\/()]+/).map(e=> e.trim()).filter(e=>e.length>0);
             centar_x = +elements[3];
             centar_y = +elements[4];
             centar_z = +elements[5];
             radius = +elements[6];
             kraj_x = +elements[12];
             kraj_y = +elements[13];
             kraj_z = +elements[14];

                if (Math.abs(centar_x - kraj_x) <= this.tolr_coord && Math.abs(centar_x - this.ls_x) <= this.tolr_coord){
                    this.lsplane = "zy";
                }
                else if (Math.abs(centar_y - kraj_y) <= this.tolr_coord && Math.abs(centar_y - this.ls_y) <= this.tolr_coord){
                    this.lsplane = "xz";
                }
                else if (Math.abs(centar_z - kraj_z) <= this.tolr_coord && Math.abs(centar_z - this.ls_z) <= this.tolr_coord){
                    this.lsplane = "xy";
                }
                else {
                    kk("ERROR CHANGE OF ALL 3 COORDINATES RE-DO THE APT OUTPUT " + line);
                }
                kk("PLANE: "+this.lsplane);

            if (this.lsplane == "xz"){
                 vektor2_x = this.ls_x - centar_x;
                 vektor2_z = this.ls_z - centar_z;
                 D = this.ls_i * vektor2_z - vektor2_x * this.ls_k;


                if (D<0){
                     movement = "cw";
                }
                else if (D>0){
                     movement = "ccw";
                }
                else {
                    kk("ERROR CIRCLE CENTER XZ IS ON THE CIRCLE TANGENT " + line)
                }

                start = Math.atan2(this.ls_x-centar_x, this.ls_z-centar_z);
                end = Math.atan2(kraj_x-centar_x, kraj_z-centar_z);

                if (movement === "ccw") {
                    angle = end - start;
                    if (angle < 0){
                        angle += 2*Math.PI;
                    }
                    }
                else if (movement === "cw") {
                    angle = start - end;
                    if (angle < 0){
                        angle += 2*Math.PI;
                    }
                    }  
            }
            else if (this.lsplane == "xy"){
                 vektor2_x = +this.ls_x - +centar_x;
                 vektor2_y = +this.ls_y - +centar_y;
                 D = +this.ls_i * vektor2_y - vektor2_x * +this.ls_j;


                if (D<0){
                     movement = "cw";
                }
                else if (D>0){
                     movement = "ccw";
                }
                else {
                    kk("ERROR CIRCLE CENTER XY IS ON THE CIRCLE TANGENT " + line)
                }
                start = Math.atan2(this.ls_x-centar_x, this.ls_y-centar_y);
                end = Math.atan2(kraj_x-centar_x, kraj_y-centar_y);

                if (movement === "ccw") {
                    angle = end - start;
                    if (angle < 0){
                        angle += 2*Math.PI;
                    }
                    }
                else if (movement === "cw") {
                    angle = start - end;
                    if (angle < 0){
                        angle += 2*Math.PI;
                    }
                    }  

            }
            else if (this.lsplane == "zy"){
                 vektor2_y = +this.ls_y - +centar_y;
                 vektor2_z = +this.ls_z - +centar_z;
                 D = +this.ls_j * vektor2_z - vektor2_y * +this.ls_k;

                if (D<0){
                     movement = "cw";
                }
                else if (D>0){
                     movement = "ccw";
                }
                else {
                    kk("ERROR CIRCLE CENTER ZY IS ON THE CIRCLE TANGENT " + line)
                }
                start = Math.atan2(this.ls_z-centar_z, this.ls_y-centar_y);
                end = Math.atan2(kraj_z-centar_z, kraj_y-centar_y);

                if (movement === "ccw") {
                    angle = end - start;
                    if (angle < 0){
                        angle += 2*Math.PI;
                    }
                    }
                else if (movement === "cw") {
                    angle = start - end;
                    if (angle < 0){
                        angle += 2*Math.PI;
                    }
                    }  
            }
            kk("ARCH: RADIUS: "+radius+" BEGIN: "+this.ls_x+" "+this.ls_y+" "+this.ls_z+" CENTER: "+centar_x+" "+centar_y+" "+centar_z+" END: "+kraj_x+" "+kraj_y+" "+kraj_z+" VECTOR: "+this.ls_i+" "+this.ls_j+" "+this.ls_k+" DIRECTION: "+movement+" ANGLE: "+angle);

            this.ls_x = kraj_x;
            this.ls_y = kraj_y;
            this.ls_z = kraj_z;
            this.lsautops = 0;
        }
        else if (line.startsWith("GODLTA")){
             koord_x="";
             koord_y="";
             koord_z="";

            if (this.ls_dim_typ !== "MOVEMENT: incremental"){
                kk("MOVEMENT: incremental");
                this.ls_dim_typ = "MOVEMENT: incremental";
            }
             koord = line.split(/[,/]+/)
            if (koord.length === 4){
                 x = +koord[1];
                 y = +koord[2];
                 z = +koord[3];
            }
            else if (koord.length === 2){
                 x = "++";
                 y = "++";
                 z = +koord[1];
            }
            else {
                kk("ERROR: GODLTA " + line);
            }
            this.ls_x = (this.ls_x + x);
            this.ls_y = (this.ls_y + y);
            this.ls_z = (this.ls_z + z);
            
            if (x !== "++"){
                koord_x = " X" + x;
            }
            if (y !== "++"){
                koord_y = " Y" + y;
            }
            if (z !== "++"){
                koord_z = " Z" + z;
            }

            if (this.rapto === 1) {
                 dist = Math.hypot(x, y, z);
                 ratio = dist !== 0 ? this.rapto_num / dist : 0;
                 rdtx = ratio*x;
                 rdty = ratio*y;
                 rdtz = ratio*z;
                 koord__x = koord_x-rdtx;
                 koord__y = koord_y-rdty;
                 koord__z = koord_z-rdtz;

                kk("AIR");
                kk("LINE: X" + koord__x + " Y" + koord__y + " Z" + koord__z);
                kk("CUT");

                this.rapto = 0;
            }

            kk("LINE:" + koord_x + koord_y + koord_z);

        }
        else if (line.startsWith("GOTO")){
             koord_x=" X++";
             koord_y=" Y++";
             koord_z=" Z++";

            if (this.ls_dim_typ !== "MOVEMENT: absolute"){
                kk("MOVEMENT: absolute");
                this.ls_dim_typ = "MOVEMENT: absolute";
            }
             koord = line.split(/[,/]+/);
             x = +koord[1];
             y = +koord[2];
             z = +koord[3];

            if (x !== this.ls_x){
                 koord_x = " X" + x;
            }
            if (y !== this.ls_y){
                 koord_y = " Y" + y;
            }
            if (z !== this.ls_z){
                 koord_z = " Z" + z;
            }

            if (this.rapto === 1){
                 dtx = this.ls_x - x;
                 dty = this.ls_y - y;
                 dtz = this.ls_z - z;
                 dist = Math.hypot(dtx, dty, dtz);
                 ratio = dist !== 0 ? this.rapto_num / dist : 0;
                 rdtx = ratio*dtx;
                 rdty = ratio*dty;
                 rdtz = ratio*dtz;
                 koord__x = koord_x-rdtx;
                 koord__y = koord_y-rdty;
                 koord__z = koord_z-rdtz;
                kk("AIR");
                kk("LINE: X"+ koord__x + " Y" + koord__y + " Z" + koord__z);
                kk("CUT");

                this.rapto = 0;
            }
            kk("LINE:"+koord_x + koord_y + koord_z);

            this.ls_x=x;
            this.ls_y=y;
            this.ls_z=z;
        }
        else if (line.startsWith("SPINDL")){
            if (line.includes("OFF")){
                this.lsrotation = "SPINDLE: STATE:OFF";
                kk("SPINDLE: STATE:off NUM:1");
            }
            else if (!line.includes("ON")){
                 spindlDT = line.split(/[,/]+/)
                if (spindlDT.length === 4){
                     num = spindlDT[1].trim();
                     rotation = spindlDT[3].trim();
                     rotation_typ = ""

                    this.ls_spindle_speed = parseFloat(num)

                    if (line.includes("SFM")||line.includes("SMM")) {
                        rotation_typ = "TYPE:surface";
                    }
                    else if (line.includes("RPM")){
                        rotation_typ = "TYPE:fix";
                    }
                    else {
                        kk("ERROR SPINDLE SPEED IS NOT DEFINED CORECTLY (SFM OR RPM) "+line);
                    }
                    if (this.ls_tip_rev !== rotation_typ){
                        this.ls_tip_rev = rotation_typ;
                    }
                    if (line.includes("CLW")){
                        this.lsrotation = "DIRECTION:cw";
                    }
                    else if (line.includes("CCLW")){
                        this.lsrotation = "DIRECTION:ccw";
                    }
                    else {
                        kk("ERROR SPINDLE DIRECTION NOT DEFINED " +line);
                    }
                    this.ls_on_rotation = ("SPINDLE: STATE:on " + rotation_typ + " SPEED:" + this.ls_spindle_speed + " " + " " + this.lsrotation + " NUM:1");
                    kk(this.ls_on_rotation);
                }
                else {
                    kk("ERROR SPINDLE DATA NOT VALID REQUIRES NUM VALUE SFM/SMM/RPM AND DIRECTION "+ line);
                }
            }
            else {
                kk(this.ls_on_rotation);
            }
        }
        else if (line.startsWith("FEDRAT")){
            feed = line.split(/[,/]+/);
            numf = feed[1].trim();

            if (line.includes("MMPR")||line.includes("IPR")||line.includes("REV")){
                this.ls_tip_posmak = "TYPE:rev";
            }
            else if (line.includes("MMPM")||line.includes("IPM")||line.includes("MIN")){
                this.ls_tip_posmak = "TYPE:time";
            }
            if (line.includes("RAPTO")){
                this.rapto=1;
                this.rapto_num = +feed[4]
            }
            kk("FEEDRATE: " + this.ls_tip_posmak + " SPEED:" + numf);
        }
        else if (line.startsWith("RAPID")){

            if (line.includes("GOTO")){
                 koord_x=" X++";
                 koord_y=" Y++";
                 koord_z=" Z++";

                if (this.ls_dim_typ !== "MOVEMENT: absolute"){
                    kk("MOVEMENT: absolute");
                    this.ls_dim_typ = "MOVEMENT: absolute";
                }
                 koord = line.split(/[,/]+/);
                 x = +koord[1];
                 y = +koord[2];
                 z = +koord[3];

                if (x !== this.ls_x){
                     koord_x = " X" + x;
                }
                if (y !== this.ls_y){
                     koord_y = " Y" + y;
                }
                if (z !== this.ls_z){
                     koord_z = " Z" + z;
                }

                if (this.rapto === 1){
                     dtx = this.ls_x - x;
                     dty = this.ls_y - y;
                     dtz = this.ls_z - z;
                     dist = Math.hypot(dtx, dty, dtz);
                     ratio = dist !== 0 ? this.rapto_num / dist : 0;
                     rdtx = ratio*dtx;
                     rdty = ratio*dty;
                     rdtz = ratio*dtz;
                     koord__x = koord_x-rdtx;
                     koord__y = koord_y-rdty;
                     koord__z = koord_z-rdtz;
                    kk("AIR")
                    kk("LINE: X" + koord__x + " Y" + koord__y + " Z" + koord__z);
                    kk("CUT");

                    this.rapto = 0;
                }
                kk("LINE: " + koord_x + koord_y + koord_z);
            
                this.ls_x=x;
                this.ls_y=y;
                this.ls_z=z;

            }
            else if (line.includes("GODLTA")){
                 koord_x="";
                 koord_y="";
                 koord_z="";

                if (this.ls_dim_typ !== "MOVEMENT: incremental"){
                    kk("MOVEMENT: incremental");
                    this.ls_dim_typ = "MOVEMENT: incremental";
                }
                koord = line.split(/[,/]+/)
                if (koord.length === 4){
                     x = +koord[1];
                     y = +koord[2];
                     z = +koord[3];
                }
                else if (koord.length === 2){
                     x = "++";
                     y = "++";
                     z = +koord[1];
                }
                else {
                    kk("ERROR: GODLTA " + line);
                }
                this.ls_x = (this.ls_x + x);
                this.ls_y = (this.ls_y + y);
                this.ls_z = (this.ls_z + z);
                
                if (x !== 0){
                    koord_x = " X" + x;
                }
                if (y !== 0){
                    koord_y = " Y" + y;
                }
                if (z !== 0){
                    koord_z = " Z" + z;
                }

                if (this.rapto === 1) {
                     dist = Math.hypot(x, y, z);
                    ratio = dist !== 0 ? this.rapto_num / dist : 0;
                     rdtx = ratio*x;
                     rdty = ratio*y;
                     rdtz = ratio*z;
                     koord__x = koord_x-rdtx;
                     koord__y = koord_y-rdty;
                     koord__z = koord_z-rdtz;

                    kk("AIR");
                    kk("LINE: X" + koord__x + " Y" + koord__y + " Z" + koord__z);
                    kk("CUT");

                    this.rapto = 0;
                }
                kk("LINE: " + koord_x + koord_y + koord_z);

            }

        }
        else if (line.startsWith("COOLNT")){
            if (line.includes("FLOOD")){
                this.ls_clnt_typ = "COOLANT: STATE:on TYPE:flood";
                kk("COOLANT: STATE:on TYPE:flood");
            }
            else if (line.includes("MIST")){
                this.ls_clnt_typ = "COOLANT: STATE:on TYPE:mist";
                kk("COOLANT: STATE:on TYPE:mist");
            }
            else if (line.includes("OFF")){
                kk("COOLANT: STATE:off");
            }
            else if (line.includes("ON")){
                if (this.ls_clnt_typ !== ""){
                    kk(this.ls_clnt_typ);
                }
                else {
                    kk("ERROR: THERE IS NO PREDEFINED COOLANT TYPE, FUNTION ON CANNOT WORK");
                }
            }
        }
        else if (line.startsWith("DELAY")||line.startsWith("DWELL")){
            dwell=line.split("/")[1];
            if (line.includes("REV")){
                revs=dwell.split(",").trim();
                kk("DWELL: TYPE:rev NUMBER:" + revs);
            }
            else{
                kk("DWELL: TYPE:time NUMBER:" + dwell.trim());
            }
        }
        else if (line.startsWith("CYCLE")){
            line = line.replace("CYCLE/", "");
            kk("CYCLE: " + line);
        }
        else if (line.startsWith("$$")){
            line = line.split("$$")[1];
            kk("COMMENT:" + line);
        }
        else if (line.startsWith("INDIRV")){
            elements=line.split(/[,\/\s]+/).filter(Boolean);
            this.ls_i = +elements[1];
            this.ls_j = +elements[2];
            this.ls_k = +elements[3];
        }
        else if (this.non_def.some(word => line.startsWith(word))){
            kk("ERROR not defined:" + line);
        }
        else{
            kk("ERROR: beans" + line);
        }
    }
}
export class kkod{
    parseline(line){
        kk(line);
    }
}
