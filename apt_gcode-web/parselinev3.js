import { wError,  write} from "./output.js";

export class catiav5_1_0{
    constructor(func){
        this.func = func;
        this.tool_axis;
        this.multax;
        this.autops = false;
        this.ls_coord;
        this.ls_circle_tan;
        this.helix_center;
        this.helix_tan;
        this.helix_axis;
        this.helix_info;
        this.helix_end;
        this.rapid  = false;
        this.cyc_coord;
        this.cycleon;
        this.ls_dim_typ;
        this.rapto = false;
        this.rapto_num;
        this.ls_movement;
        this.spindle;
        this.feedrate;
        this.cyc_name;
        this.cyc_data;
        this.cyc_specific;
        this.cut_com = [null,null,null];

    }
    parseline(line){
        const {
            compensation_chg,   tlaxis,         loadtl,     writeComment,   selectl,
            insideToler,        outsideToler,   Toler,      programEnd,     partno,
            tlon,               helix,          godlta,     goto,           spindle,
            feed,               coolant,        airPurge,   delay,          cycle,
            psis,               cutcom,         change_tool
        } = this.func;

        let D;
        let els;
        let elements = line.split(/[,/ ]+/);
        let elements2 = line.split(/[,/:]/);

        switch (elements[0].trim()){
            case "COMPENSATION":
                D = compensation_chg(elements2);
                if (D){
                    console.log(line);
                }
                else{
                    wError("ERROR with compensation compensation_chg \n***"+ line+"\nElements: "+elements2);
                }                
            break;
            
            case "TLAXIS":
                D = tlaxis(elements2);
                if (D[0]){
                    this.tool_axis = [+D[1], +D[2], +D[3]];
                    this.multax = false;
                    console.log("***"+line);
                }
                else{
                    if (D[1] === "notSingleVec"){
                        wError("ERROR with TLAXIS-given vectors indicate multi axial tool axis, which is not supported\n*"+line);
                    }
                    else{
                        wError("ERROR with TLAXIS-given vectors aren't complete\n*"+line+"\n"+elements2);
                    }
                }
            break;

            case "MULTAX":
                if (line.includes("OFF")){
                    this.multax = false;
                }
                else {
                    this.multax = true;
                    wError("ERROR multi axial work is not supported");
                }
            break;

            case "LOADTL":
                D = loadtl(elements2);
                if (D) {
                    console.log("***"+line);
                }
                else{
                    wError("ERROR with LOADTL, check for empty elements or incomplete elements\n*"+line);
                }
            break;

            case "SELECTL":
                D = line.split("/")[1].trim();
                selectl(D);
                if (D) {
                    console.log("***"+line);
                }
                else{
                    wError("ERROR with SELECTL, check for empty elements or incomplete elements\n*"+line);
                }
            break;

            case "INTOL":
                D = insideToler(elements2[1].trim());
                if (D) {
                    console.log("***"+line);
                }
                else{
                    wError("ERROR with INTOL, check for empty elements or incomplete elements\n*"+line);
                }
            break;

            case "OUTTOL":
                D = outsideToler(elements2[1].trim());
                if (D) {
                    console.log("***"+line);
                }
                else{
                    wError("ERROR with OUTTOL, check for empty elements or incomplete elements\n*"+line);
                }
            break;

            case "TOLER":
                D = Toler(elements2[1].trim());
                if (D) {
                    console.log("***"+line);
                }
                else{
                    wError("ERROR with TOLER, check for empty elements or incomplete elements\n*"+line);
                }
            break;

            case "FINI":
            case "END":
                D = programEnd(true);
                if (!D){
                    wError("ERROR with END, check for empty elements or incomplete elements\n*"+line);
                }
            break;

            case "PARTNO":
                els = line.replace(/^PARTNO/, "Part number: ");
                D =partno(els);
                if (!D){
                    wError("ERROR with PARTNO, check for empty elements or incomplete elements\n*"+line);
                }
            break;

            case "PPRINT":
            case "TPRINT":
            case "TOOLNO":
            case "REWIND":
            case "AUTOPS":
            case "OPERATION NAME":
                D = writeComment(line);
                if (!D){
                    wError("ERROR with OPERATION NAME, check for empty elements or incomplete elements\n*"+line);
                }
            break;

            case "TLON":
                D = tlon(line, ...this.ls_coord, ...this.ls_circle_tan);
                if(!D[0]){
                    wError("ERROR unknown command/error with command recognition-should be a gofwd\n"+line);
                }
                else{
                    if (!D[1]){
                        wError("ERROR unknown command/error with command recognition-should be a circle or a cylind(sinusoide)\n"+line);
                    }
                    else if(D[1]==="circle"){
                        if (!D[2][0]){
                            wError("ERROR with element determination (cw or ccw/plane definition)");
                        }
                        else{
                            this.ls_coord = D[2][1];
                        }
                    }
                }
            break;
            
            case "HELICAL":
                switch (elements[1].trim()){
                    case "CENTER":
                        this.helix_center = [+elements[2],+elements[3],+elements[4]];
                    break;
                    case "TANGENT":
                        this.helix_tan = [+elements[2],+elements[3],+elements[4]];
                    break;
                    case "AXIS":
                        this.helix_axis = [+elements[2],+elements[3],+elements[4]];
                    break;
                    case "INFO":
                        this.helix_info = [+elements[2],+elements[3],+elements[4],+elements[5]];
                    break;
                    case "END":
                        this.helix_end = [+elements[2],+elements[3],+elements[4]];
                        D = helix(this.ls_coord,this.helix_center, this.helix_tan, this.helix_axis, this.helix_info, this.helix_end);
                        if (!D[0]){
                            wError("ERROR with element determination (cw or ccw/plane definition)");
                        }
                        else{
                            this.ls_coord = D[1];
                        }
                    break;
                }
            break;

            case "GODLTA":
                if (elements.length===4){
                    els = [+elements[1],+elements[2],+elements[3]];
                }
                else if (elements.length===2){
                    els = [0,0,+elements[1]];
                }
                else{
                    wError("Invalid godlta syntacs "+line+"\n"+elements+"\n"+els);
                }

                this.ls_coord = this.ls_coord.map((v, i) => v + els[i]);
                if (this.cycleon){
                    this.cyc_coord.push(this.ls_coord);
                }
                else{
                    D = godlta(els, this.rapid, this.ls_dim_typ, this.rapto, this.rapto_num, this.ls_movement);
                    this.rapto = false;
                    this.ls_dim_typ = D[0];
                    this.ls_movement = D[1];
                }
            break;

            case "GOTO":
                els = [+elements[1],+elements[2],+elements[3]];
                if (this.cycleon){
                    this.cyc_coord.push(els);
                }
                else{
                    D = goto(this.ls_coord, els, this.rapid, this.ls_dim_typ, this.rapto, this.rapto_num, this.ls_movement);
                    this.rapto = false;
                    this.ls_dim_typ = D[0];
                    this.ls_movement = D[1];
                }
                this.ls_coord = els;
                this.rapto = false;
            break;

            case "SPINDL":
                switch(elements2[1].trim()){
                    case "ON":
                        D = spindle("on",this.spindle);
                        if (!D[0]){
                            wError("The previous Spindle function was incorectly set there should be 3 elements\n"+this.ls_spindle);
                        }
                    break;

                    case "OFF":
                        D = spindle("off");
                    break;

                    case "LOCK":
                        D = spindle("lock");
                    break;

                    default:
                        let spindl = [elements2[2].trim(), elements2[3].trim(), elements2[1].trim()];

                        D = spindle("set",spindl);
                        if(!D[0]){
                            if (D[1].trim()==="typ"){
                                wError("Unknown spindle type (sfm/rpm)\n"+line);
                            }
                            else if (D[1].trim()==="dir"){
                                wError("Unknown spindle type (clw/cclw)\n"+line);
                            }
                        }
                        else{
                            this.spindle = D;
                        }
                    break;

                }
            break;
            
            case "FEDRAT":
                D = feed(elements2[2].trim(),elements2[1].trim());
                if (!D[0]){
                    if(!D[1]){
                        wError("Unknown feedrate number\n"+line);
                    }
                    else{
                        wError("Unknwn feedrate type\n"+line);
                    }
                }
                else{
                    this.feedrate = D;
                }
                if (line.includes("RAPTO")){
                    this.rapto = true;
                    if(!elements2[4]){
                        wError("Rapto value was not defined\n"+line);
                    }
                    else{
                        this.rapto_num = +elements2[4];
                    }
                }
            break;

            case "RAPID":
                this.rapid = true;
                if (line.includes("GOTO")){
                    let coord = [+elements[2],+elements[3],+elements[4]];
                    D = goto(this.ls_coord, coord, this.rapid, this.ls_dim_typ, this.rapto, this.rapto_num, this.ls_movement);
                    this.rapto = false;
                    this.ls_dim_typ = D[0];
                    this.ls_movement = D[1];
                    this.ls_coord = coord;
                }
                else if (line.includes("GODLTA")){
                    if (elements.length===4){
                        els = [+elements[2],+elements[3],+elements[4]];
                    }
                    else if (elements.length===2){
                        els = [0,0,+elements[2]];
                    }
                    else{
                        wError("Invalid godlta syntacs "+line+"\n"+elements+"\n"+els);
                    }

                    this.ls_coord = coord.map((v, i) => v + els[i]);
                    if (this.cycleon){
                        this.cyc_coord.push(this.ls_coord);
                    }
                    else{
                        D = godlta(coord, this.rapid, this.ls_dim_typ, this.rapto, this.rapto_num, this.ls_movement);
                        this.rapto = false;
                        this.ls_dim_typ = D[0];
                        this.ls_movement = D[1];
                    }
                }
            break;
            
            case "COOLNT":
                D = coolant(elements2[1].trim(),this.coolant);
                if (!D[0]){
                    wError("Coolant syntacs is not supported\n"+line);
                }
                else{
                    this.coolant = D[1].trim();
                }
            break;

            case "AIR_PURGE":
                D = airPurge(elements2[1].trim());
                if (!D){
                    wError("Air purge syntacs is not supporteds\n"+line);
                }
            break;

            case "DELAY":
                delay(elements2[1].trim(), elements2[2].trim());
            break;

            case "CYCLE":
                switch(elements2[1].trim()){
                    case "NAME":
                        this.cyc_name = line.replace("CYCLE/NAME,","").trim();
                        break;
                    case "DATA":
                        this.cyc_data = line.replace("CYCLE/DATA,","").trim();
                        this.cycleon = true;
                        break;
                    case "CY0":
                    case "CY1":
                    case "CY2":
                    case "CY3":
                    case "CY4":
                        this.cyc_specific = elements2.slice(1);
                        break;
                    case "END":
                        D = cycle(this.cyc_name, this.cyc_data, this.cyc_specific, this.cyc_coord, this.tool_axis);
                    break;
                }

            break;
            
            case "PSIS":
                els = [+elements[3], +elements[4], +elements[5]];
            break;

            case "kkod":
                if (!(this.ls_coord.length === els.length && this.ls_coord.every((v, i) => v === els[i]))){
                    goto(this.ls_coord, els, this.rapid, this.ls_dim_typ, this.rapto, this.rapto_num, this.ls_movement);
                }
                this.ls_coord = els;
                elements = line.replace(/[()]/g, "").split(/[,/:]/);
                D = psis(+elements[7], +elements[8],+elements[9]);
            break;

            case "INDIRV":
                this.ls_circle_tan = [+elements2[1],+elements2[2],+elements2[3]];
            break;

            case "MAXSPINDL":
                spindle("max", +elements2[1]);
            break;

            case "$$":
                D = line.replace("$$","");
                els = writeComment(D);
                if (!els){
                    wError("Invalid comment syntacs "+line);
                }
            break;
            
            case "CUTCOM":
                switch (elements2.trim()){
                    case "ON":
                        D = cutcom("ON", ...this.cut_com);
                        if (D[0]){
                            this.cut_com = [D[1],D[2],D[3]];
                        }
                        else{
                            wError("CUTCOM ERROR "+line);
                        }
                    break;

                    case "OFF":
                        D = cutcom("OFF", ...this.cut_com);
                        if (D[0]){
                            this.cut_com = [D[1],D[2],D[3]];
                        }
                        else{
                            wError("CUTCOM ERROR "+line);
                        }
                    break;
                    
                    case "SAME":
                        D = cutcom("NORMDS_ON", ...this.cut_com);
                        if (D[0]){
                            this.cut_com = [D[1],D[2],D[3]];
                        }
                        else{
                            wError("CUTCOM ERROR "+line);
                        }
                    break;

                    case "NORMPS":
                        D = cutcom("NORMPS_ON", ...this.cut_com);
                        if (D[0]){
                            this.cut_com = [D[1],D[2],D[3]];
                        }
                        else{
                            wError("CUTCOM ERROR "+line);
                        }
                    break;

                    case "LEFT":
                        D = cutcom("LEFT", ...this.cut_com);
                        if (D[0]){
                            this.cut_com = [D[1],D[2],D[3]];
                        }
                        else{
                            wError("CUTCOM ERROR "+line);
                        }
                    break;

                    case "RIGHT":
                        D = cutcom("RIGHT", ...this.cut_com);
                        if (D[0]){
                            this.cut_com = [D[1],D[2],D[3]];
                        }
                        else{
                            wError("CUTCOM ERROR "+line);
                        }
                    break;
                }
            break;
            
            case "CHANGE_TOOL":
                D = change_tool(elements2[1].trim(),elements2[2].trim(),elements2[3].trim());
                if (!D[0]){
                    if (D[1]==="name"){
                        wError("The tool has no name "+line);
                    }
                }
            break;

            case "rawG":
                write(line);
            break;

            default:
                if (line.startsWith("ERROR")){
                    wError(line);
                }
                else{
                    wError("ERROR: unrecognized command " + line);
                }
            break;
        }
        if (!line.startsWith("RAPID")){
            this.rapid = false;
        }
    }
}