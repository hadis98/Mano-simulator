// instructions

// memory instructions
// only we define opcodes here
const memory_instructions = {
    AND: [0, 8],
    ADD: [1, 9],
    LDA: [2, "A"],
    STA: [3, "B"],
    BUN: [4, "C"],
    BSA: [5, "D"],
    ISZ: [6, "E"],
};

// registor instructions
const register_instructions = {
    CLA: "7800",
    CLE: "7400",
    CMA: "7200",
    CIR: "7080",
    CIL: "7040",
    INC: "7020",
    SPA: "7010",
    SNA: "7008",
    SZA: "7004",
    SZE: "7002",
    HLT: "7001",
};

// input output instructions
const IO_instructions = {
    INP: "F800",
    OUT: "F400",
    SKI: "F200",
    SKO: "F100",
    ION: "F080",
    IOF: "F040",
};

const labels_table = {};
const memory_table = {};
const assemblerBtn = document.getElementById("assemblerBtn");
let editor_contents;
let results;
let results_index = 0;
// firt level of simulations:

// line counter
let LC = 0;

// in this function we calculate label_table and check every line of codes in editor
function firstStep() {
    for (let i = 0; i < results.length; i++) {
        scanEveryLine_first();
    }
}

function secondStep() {
    LC = 0;
    results_index = 0;
}

// this function scans every line of codes in editor
function scanEveryLine_first() {
    let ith_line = results[results_index]; // ith line of results in string
    let results_contents = results[results_index].split(/[ ,]+/);
    // console.log(results_contents); //'a' 'b'
    // console.log('ithLine: ', ith_line);
    if (!ith_line.includes(",")) {
        //dont have label:
        if (ith_line.includes("ORG")) {
            LC = parseInt(results_contents[1]);
            console.log("lc: ", LC);
        } else {
            if (ith_line.includes("END")) {
                // start second step
            } else {
                LC++;
            }
        }
    } else {
        const symbol = results_contents[0];
        // console.log(symbol);
        labels_table[symbol] = LC;
        LC++;
    }

    results_index++; //be ready to scan next line
}

function scanEveryLine_second() {
    let ith_line = results[results_index];
    let results_contents = results[results_index].split(/[ ,]+/);
    if (
        ith_line.includes("ORG") ||
        ith_line.includes("END") ||
        ith_line.includes("HEX") ||
        ith_line.includes("DEC")
    ) {
        if (ith_line.includes("ORG")) {
            LC = parseInt(results_contents[1]);
        } else if (ith_line.includes("END")) {
            console.log('end of program');
            // end of program
        } else if (ith_line.includes("HEX")) {

        } else if (ith_line.includes("DEC")) {

        }
    } else {
        // if it is memory refrence:
        let target = results_contents[0];
        if (search_in_object(memory_instructions, target)) {

        } else if (search_in_object(register_instructions, target)) {

        } else if (search_in_object(IO_instructions, target)) {

        }
    }
}

// get contents of editor
// click on assemble button
assemblerBtn.addEventListener("click", () => {
    const strings = document.getElementById("editor").value;
    editor_contents = strings;
    results = editor_contents.split("\n");
    console.log(editor_contents);
    console.log(results);
    firstStep();
    // secondStep();
    console.log(labels_table);
});

/**

ORG 100
LDA SUB
CMA
INC
ADD MIN
STA DIF
HLT
MIN, DEC 83
SUB, DEC -23
DIF, HEX 0
END

 */


function search_in_object(object, target) {
    for (let i = 0; i < Object.keys(object).length; i++) {
        if (object[target]) {
            return 1;
        }
    }
    return 0;
}

// console.log(search_in_object(memory_instructions, 'ADD'));