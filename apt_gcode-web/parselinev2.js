import {getLastJSON, kk} from "./output.js";
import {getSettings} from "./settings.js";

export class catiav5_1_0{
    constructor(settings){
            this.tolr_coord = 1e-3;
            this.lsplane;
            this.lsrotation;
            this.ls_tip_rev;
            this.ls_tip_posmak;
            this.lssklop;
            this.ls_x;
            this.ls_y;
            this.ls_z;
            this.ls_i;
            this.ls_j;
            this.ls_k;
            this.ls_spindle_speed;
            this.ls_on_rotation;
            this.ls_dim_typ;
            this.ls_clnt_typ;
            this.ls_cycle;
            this.ls_cycle_data;
            this.ls_cycle_coord = "";
            this.lsunits;
            this.ls_units_word = "mm";
            this.multax;
            this.lsautops = false;
            this.ls_feed_speed;
            this.rapid = false;
            this.ls_movement = "CUT";
            this.rapto;
            this.header = false;
            this.cycleon = false;
            this.ls_tool_axis;
            this.psis = false;
            this.rejected_cyc = false;
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
            let radius;
            let start;
            let end;
            let angle;

            let cycle_typ;
            let total_depth;
            let plunge;
            let axial_depth;
            let dwell_in_time;
            let clearance;
            let cycle_feed;
            let cycle_spindle;
            let depth_decrement;
            let aditional_element;

            let amplitude;
            let element;
            let begin;

        if (!this.header){
            kk(window.add_command);
            this.header = true;
        }
        if (!line || !line.trim()) {return};
        console.log(line);
        

        elements = line.split(/[,/ *]+/);
        begin = elements[0];
        element = line.split("/");
        console.log(line);

        switch (begin){

        case "UNITS":
            if (line.includes("MM")){
                if (this.lsunits !== "UNIT: MM"){
                    kk("UNIT: MM");
                    this.lsunits = "UNIT: MM";
                    this.ls_units_word = "mm";
                }
            } else if (line.includes("INCH")){
                if (this.lsunits !== "UNIT: INCH"){
                    kk("UNIT: INCH");
                    this.lsunits = "UNIT: INCH";
                    this.ls_units_word = "inch";
                }
            } else {
                kk("ERROR: Unknown unit type " + line);
            }
            break;
        
        case "SWITCH":
            D = element[1];
            D = D.trim();
            switch (D) {
                case "1":
                    x ="TR";
                    break;
                case "2":
                    x ="TL";
                    break;
                case "3":
                    x ="BL";
                    break;
                case "4":
                    x ="BR";
                    break;
                case "5":
                    x ="CR";
                    break;
                case "6":
                    x ="TC";
                    break;
                case "7":
                    x ="CL";
                    break;
                case "8":
                    x ="BC";
                    break;
                case "9":
                    x ="CC";
                    break;
                default:
                    x ="OFF";
            }
            kk("COMPENSATION:" + x);
            break;
        
        case "TLAXIS":
            x = elements[1].trim();
            y = elements[2].trim();
            z = elements[3].trim();
            kk("TLAXIS "+x+" "+y+" "+z);
            this.multax = false;
            kk("MULTAX: off")
            break;
        
        case "CUTTER":
            if (elements.length < 3){
                kk("COMMENT: Corner radius is "+elements[1]);
            }
            else if (elements.length == 8){
                kk("COMMENT: Tool specs are: ");
                kk("COMMENT: -cutter diameter "+elements[1]);
                kk("COMMENT: -corner radius "+elements[2]);
                kk("COMMENT: -horizontal distance between radius center point and tool axis "+elements[3]);
                kk("COMMENT: -verical distnce between radius center point and cutter tip "+elements[4]);
                kk("COMMENT: -angle of cutter tip "+elements[5]);
                kk("COMMENT: -flank angle "+elements[6]);
                kk("COMMENT: -tool height "+elements[7]);
            }
            break;
        
        case "MULTAX":
            if (line.includes("OFF")){
                kk("MULTAX: off");
                this.multax = false;
            }
            else {
                kk("MULTAX: on");
                kk("ERROR: multi axial machining is not supported")
                this.multax = true;
            }
            break;
        
        case "LOADTL":
        case "SELECTL":
            D = element[1].trim();
            kk("COMMENT:Magazine slot number: " + D);
            break;
        
        case "INTOL":
            D = element[1].trim();
            kk("COMMENT:Inside tolerance from the path: " + D +" "+ this.ls_units_word);
            break;
        
        case "OUTTOL":
            D = element[1].trim();
            kk("COMMENT:Outside tolerance from the path: "+ D +" "+ this.ls_units_word);
            break;
        
        case "TOLER":
            D = element[1].trim();
            kk("COMMENT:Tolerance from the path: " + D +" "+ this.ls_units_word);
            break;
        
        case "FINI":
        case "END":
            kk("COMMENT:End of program");
            break;
        
        case "PARTNO":
            D = line.replace(/^PARTNO/, "COMMENT:Part number: ");
            kk(D);
            break;
        
        case "OPERATION NAME":
            D = line.replace(/^OPERATION NAME/, "COMMENT:").replace(/^:/, "");
            kk(D);
            break;
        
        case "PPRINT":
        case "TPRINT":
            D = element[1];
            kk("COMMENT: ")
            break;
        
        case "TOOLNO":
        case "REWIND":
        case "PARTNO":
            kk("COMMENT: " + line);
            break;
        
        case "AUTOPS":
            this.autops = true;
            break;
        
        case "TLON":
            if (line.includes("GOFWD")){
            elements = line.split(/[,\/()]+/).map(e=> e.trim()).filter(e=>e.length>0);
            console.log(elements);
            if (line.includes("CIRCLE")){
                centar_x = +elements[3];
                centar_y = +elements[4];
                centar_z = +elements[5];
                radius = +elements[6];
                if (!line.includes("INTOF")&& elements.length == 15){
                kraj_x = +elements[12];
                kraj_y = +elements[13];
                kraj_z = +elements[14];
                }
                else if (line.includes("INTOF")&& elements.length == 17){
                    kraj_x = +elements[14];
                    kraj_y = +elements[15];
                    kraj_z = +elements[16];
                }
                else {
                    kk("COMMENT: Circle syntacs is invalid, there fore command rejected, for correct syntacs visit: https://catiahelp.azurewebsites.net/English/NcgUserMap/ncg-r-rf-AptFormat-SyntAptImport.htm#ncg-r-rf-AptFormat-SyntAptImport__rs-CircularInterpolationCIRCLE");
                }

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
                    break;
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
                        kk("ERROR CIRCLE CENTER XZ IS ON THE CIRCLE TANGENT " + line);
                        break;
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
                        kk("ERROR CIRCLE CENTER XY IS ON THE CIRCLE TANGENT " + line);
                        break;
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
                        kk("ERROR CIRCLE CENTER ZY IS ON THE CIRCLE TANGENT " + line);
                        break;
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

                
                this.lsautops = 0;
            }
            else if (line.includes("CYLNDR")){
                centar_x = +elements[3];
                centar_y = +elements[4];
                centar_z = +elements[5];
                amplitude = +elements[9];
                if (!line.includes("INTOF")){
                    kraj_x = +elements[28];
                    kraj_y = +elements[29];
                    kraj_z = +elements[30];
                }
                else if (line.includes("INTOF")){
                    kraj_x = +elements[30];
                    kraj_y = +elements[31];
                    kraj_z = +elements[32];
                }
                kk("COMMENT: CENTAR "+centar_x+" "+centar_y+" "+centar_z);
                kk("COMMENT: AMPLITUDA "+amplitude);
                kk("COMMENT: KRAJ "+kraj_x+" "+kraj_y+" "+kraj_z);
                kk("COMMENT: VEKTOR TANG "+this.ls_i+" "+this.ls_j+" "+this.ls_k);
                kk("LINE: X"+kraj_x+" Y"+kraj_y+" Z"+kraj_z);
                this.ls_x = kraj_x;
                this.ls_y = kraj_y;
                this.ls_z = kraj_z;
            }
            else{
                kk("COMMENT: Unknown command "+line);
            }
            this.ls_x = kraj_x;
            this.ls_y = kraj_y;
            this.ls_z = kraj_z;
            break;
            }
            else {
            kk("ERROR: unrecognized command " + line);
            break;
            }
            break;
        
        case "HELICAL":
            elements = line.split(/[,\/()]+/).map(e=> e.trim()).filter(e=>e.length>0);
            centar_x = +elements[1];
            centar_y = +elements[2];
            centar_z = +elements[3];
            this.ls_i = +elements[4];
            this.ls_j = +elements[5];
            this.ls_k = +elements[6];
            vektor2_x = +elements[7];
            vektor2_y = +elements[8];
            vektor2_z = +elements[9];
            D = +elements[10];
            radius = +elements[11];
            kraj_x = +elements[12];
            kraj_y = +elements[13];
            kraj_z = +elements[14];
            
            this.ls_x = kraj_x;
            this.ls_y = kraj_y;
            this.ls_z = kraj_z;

            kk("HELIX: CENTER: "+" "+centar_x+" "+centar_y+" "+centar_z+" VECTOR: "+this.ls_i+" "+this.ls_j+" "+this.ls_k+" DIRTECTION: "+vektor2_x+" "+vektor2_y+" "+vektor2_z+" PITCH: "+D+" RADIUS:"+radius+" END: "+kraj_x+" "+kraj_y+" "+kraj_z);
            break;
        console.log(line);
        
        case "GODLTA":
            if (this.cycleon === true) {
                x = +elements[1];
                y = +elements[2];
                z = +elements[3];

                this.ls_x += x;
                this.ls_y += y;
                this.ls_z += z;


                this.ls_cycle_coord += "( X" + this.ls_x +" Y"+ this.ls_y +" Z"+ this.ls_z + " )";
            }
            else {
            if (this.rapid === true){
                if (this.ls_movement === "CUT"){
                    kk("AIR");
                    this.ls_movement = "AIR";
                }
            }
            else {
                if (this.ls_movement === "AIR"){
                    kk("CUT");
                    this.ls_movement = "CUT";
                }
            }
            koord_x="";
             koord_y="";
             koord_z="";

            if (this.ls_dim_typ !== "MOVEMENT: incremental"){
                kk("MOVEMENT: incremental");
                this.ls_dim_typ = "MOVEMENT: incremental";
            }
            if (elements.length === 4){
                x = +elements[1];
                y = +elements[2];
                z = +elements[3];
            }
            else if (elements.length === 2){
                x = "++";
                y = "++";
                z = +elements[1];
            }
            else {
                kk("ERROR: GODLTA ELEMENTS ARE INCOMPLETE" + line);
                break;
            }
            this.ls_x += x;
            this.ls_y +=y;
            this.ls_z +=z;
            
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
            break;
        
        case "GOTO":
            if (this.cycleon === true) {
                x = +elements[1];
                y = +elements[2];
                z = +elements[3];

                this.ls_x = x;
                this.ls_y = y;
                this.ls_z = z;


                this.ls_cycle_coord += "( X" + this.ls_x +" Y"+ this.ls_y +" Z"+ this.ls_z + " )";
            }
            else {
            if (this.rapid === true){
                if (this.ls_movement === "CUT"){
                    kk("AIR");
                    this.ls_movement = "AIR";
                }
            }
            else {
                if (this.ls_movement === "AIR"){
                    kk("CUT");
                    this.ls_movement = "CUT";
                }
            }

             koord_x=" X++";
             koord_y=" Y++";
             koord_z=" Z++";

            if (this.ls_dim_typ !== "MOVEMENT: absolute"){
                kk("MOVEMENT: absolute");
                this.ls_dim_typ = "MOVEMENT: absolute";
            }
             x = +elements[1];
             y = +elements[2];
             z = +elements[3];

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
            break;
        
        case "SPINDL":
            if (line.includes("OFF")){
                this.lsrotation = "SPINDLE: STATE:OFF";
                kk("SPINDLE: STATE:off");
            }
            else if (!line.includes("ON")){
                for (let values of elements){
                    values = values.trim();
                    
                    switch(values){
                        case "SFM":
                        case "SMM":
                            D = "TYPE:surface";
                            break;
                        case "RPM":
                            D = "TYPE:fix";
                            break;
                        case "CLW":
                            this.lsrotation = "DIRECTION:cw";
                            break;
                        case "CCLW":
                            this.lsrotation = "DIRECTION:ccw";
                            break;
                        default:
                            if (values !== "" && !isNaN(values)){
                                this.ls_spindle_speed = Number(values);
                            }
                    }                                        
                    
                    if (this.ls_tip_rev !== D){
                        this.ls_tip_rev = D;
                    }
                }
                    this.ls_on_rotation = ("SPINDLE: STATE:on " + D + " SPEED:" + this.ls_spindle_speed + " " + " " + this.lsrotation);
                    kk(this.ls_on_rotation);
            }
            else {
                kk(this.ls_on_rotation);
            }
            break;
        
        case "FEDRAT":
            let second_number = false;
                for (let values of elements){
                    values = values.trim();
                    
                    switch(values){
                        case "MMPR":
                        case "IPR":
                        case "REV":
                        case "PERREV":
                            this.ls_tip_posmak = "TYPE:rev";
                            break;
                        case "MMPM":
                        case "IPM":
                        case "MIN":
                        case "PERMIN":
                            this.ls_tip_posmak = "TYPE:time";
                            break;
                        case "RAPTO":
                            this.rapto = 1;
                            this.rapto_num = +element[4];
                            break;
                        default:
                            if (values !== "" && !isNaN(values)&& second_number === false){
                                D = Number(values);
                                second_number = true;
                            }
                    }
                }
            kk("FEEDRATE: " + this.ls_tip_posmak + " SPEED:" + D);
            break;
        
        case "RAPID":
            if (line.includes("GOTO")){
                 koord_x=" X++";
                 koord_y=" Y++";
                 koord_z=" Z++";

                if (this.ls_dim_typ !== "MOVEMENT: absolute"){
                    kk("MOVEMENT: absolute");
                    this.ls_dim_typ = "MOVEMENT: absolute";
                }
                 x = +elements[1];
                 y = +elements[2];
                 z = +elements[3];

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
                    kk("LINE: X" + koord__x + " Y" + koord__y + " Z" + koord__z);
                    kk("CUT");

                    this.rapto = 0;
                }
                kk("AIR");
                kk("LINE: " + koord_x + koord_y + koord_z);
                kk("CUT");
            
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
                if (elements.length === 4){
                     x = +elements[1];
                     y = +elements[2];
                     z = +elements[3];
                }
                else if (elements.length === 2){
                     x = "++";
                     y = "++";
                     z = +elements[1];
                }
                else {
                    kk("ERROR: GODLTA ELEMENTS ARE INCOMPLETE " + line);
                    break;
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
                kk("AIR");
                kk("LINE: " + koord_x + koord_y + koord_z);
                kk("CUT");

            }
            else {
                this.rapid = true;
            }
            break;
        
        case "COOLNT":
            if (line.includes("FLOOD")){
                this.ls_clnt_typ = "COOLANT: STATE:on TYPE:flood";
                kk("COOLANT: STATE:on TYPE:flood");
            }
            else if (line.includes("MIST")){
                this.ls_clnt_typ = "COOLANT: STATE:on TYPE:mist";
                kk("COOLANT: STATE:on TYPE:mist");
            }
            else if (line.includes("AIR")){
                this.ls_clnt_typ = "COOLANT: STATE:on TYPE:air";
                kk("COOLANT: STATE:on TYPE:air");
            }
            else if (line.includes("OFF")){
                kk("COOLANT: STATE:off");
            }
            else if (line.includes("ON")){
                if (this.ls_clnt_typ === ""){
                    kk("ERROR: THERE IS NO PREDEFINED COOLANT TYPE, FUNTION ON CANNOT WORK");
                }
                else {
                    kk(this.ls_clnt_typ+" ");
                }
            }
            break;
        
        case "DELAY":
        case "DWELL":
            D=element[1];
            if (line.includes("REV")){
                x=D.split(",").trim();
                kk("DWELL: TYPE:rev NUMBER:" + x);
            }
            else{
                kk("DWELL: TYPE:time NUMBER:" + D.trim());
            }
            break;
        
        case "CYCLE":
            elements = line.split(",");
            if (elements.length === 12){
                kk("MOVEMENT: absolute");
                this.cycleon = true;
                cycle_typ = elements[0].trim();
                total_depth = +elements[1];
                plunge = +elements[2];
                axial_depth = +elements[3];
                dwell_in_time = +elements[4];
                clearance = +elements[5];
                cycle_feed = +elements[6];
                cycle_spindle = +elements[7];
                depth_decrement = +elements[10];
                aditional_element = +elements[11];

                if (cycle_typ.includes("DRILL")||cycle_typ.includes("DEEPHL")||cycle_typ.includes("BRKCHP")){
                    this.ls_cycle_data = "TYPE:DRILL_1 " + total_depth+" "+plunge+" "+dwell_in_time+" "+clearance+" "+cycle_feed+" "+cycle_spindle+" "+axial_depth+" "+depth_decrement+" "+aditional_element;
                }
                else if (cycle_typ.includes("REAM")||cycle_typ.includes("BORE")) {
                    this.ls_cycle_data = "TYPE:REAM"+" "+total_depth +" "+ plunge+" "+dwell_in_time+" "+clearance+" "+cycle_feed+" "+cycle_spindle+" "+aditional_element;
                }
                else if (cycle_typ.includes("TAP")) {
                    this.ls_cycle_data = "TYPE:TAP"+" "+total_depth+" "+plunge+" "+dwell_in_time+" "+clearance+" "+cycle_feed+" "+cycle_spindle+" "+aditional_element;
                }
            }
            else if (line.includes("OFF")) {
                if (!this.rejected_cyc){
                    this.cycleon = false;
                    this.ls_cycle = "CYCLE: LOCATION: "+this.ls_cycle_coord+"/ "+this.ls_cycle_data;
                    kk(this.ls_cycle);
                    this.rejected_cyc = false;
                }
            }
            else if ((line.includes("ON"))) {
                kk("MOVEMENT: absolute");
                this.cycleon = true;
            }
            else{
                kk("COMMENT: Cycle rejected invalid cycle type look at https://github.com/karlo-c277/APT-Gcode/blob/main/DOCUMENTATIONS/Catia%20V5.md");
                this.rejected_cyc = true;
                kk("COMMENT: "+line);
                break;
            }
            break;
        
        case "PSIS":
            this.psis = true;
            elements = line.split(/[,\/()]+/).map(e=> e.trim()).filter(e=>e.length>0);
            this.ls_i = +elements[8];
            this.ls_j = +elements[9];
            this.ls_k = +elements[10];
            x = +elements[3];
            y = +elements[4];
            z = +elements[5];
            koord_x=" X++";
            koord_y=" Y++";
            koord_z=" Z++";
            
            this.ls_x=x;
            this.ls_y=y;
            this.ls_z=z;
            let plane_counter = 0;

            if (this.ls_i !== 0){
                kk("PLANE: yz");
                plane_counter += 1;
            }
            if (this.ls_j !== 0){
                kk("PLANE: xz");
                plane_counter += 1;
            }
            if (this.ls_k !== 0){
                kk("PLANE: xy");
                plane_counter += 1;
            }
            if (plane_counter > 1){
                kk("ERROR: more than one vector is defined for this circular movement meaning it is not in a standard plane\n"+line);
            }
            break;
        
        case "INDIRV":
            elements=line.split(/[,\/\s]+/).filter(Boolean);
            this.ls_i = +elements[1];
            this.ls_j = +elements[2];
            this.ls_k = +elements[3];
            break;
         
        case "ROTABL":
            for (let values of elements){
                values = values.trim();

                switch(values){
                    case "CLW":
                        D = "CLW";
                        break;
                    case "CCLW":
                        D = "CCLW";
                        break;
                    case "ATANGL":
                        movement = "ANGLE";
                        break;
                    case "INCR":
                        movement = "INCREMENT ANGLE";
                        break;
                }

                kk("COMMENT: Unkown syntacs "+line);
                break;
            }
            break;
        
        case "PPFUN":
        case "INDIRP":
            kk("ERROR not defined:" + line);
            break;
        
        case "$$":
            D = line.split("$$")[1];
            kk("COMMENT:" + D);
            break;
        
        case "CUTCOM":
            break;
        
        default:
            kk("ERROR: unrecognized command " + line);
            break;

    }
    if (!line.startsWith("RAPID")) {
            this.rapid = false;
    }
    console.log(line);
    }
}
export class kkod{
    parseline(line){
        kk(line);
    }
}