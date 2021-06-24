// create a table to show instructions:
const row_items = ['element', 'initial values', 'T0', 'T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'After Execution'];
const column_items = ['statements', 'IR', 'AC', 'DR', 'PC', 'AR', 'M[AR]', 'E'];
const inst_table = document.createElement('table');
const inst_table_container = document.querySelector('.instruction-table');
for (let i = 0; i < 10; i++) {
    let row = document.createElement('tr');
    for (let j = 0; j < 8; j++) {
        let column = document.createElement('td');
        if (j !== 0) {
            column.classList.add('text-center'); //every elemetn except first column
        }
        if (i == 0) {
            column.innerText = column_items[j];
            column.classList.add('bold-text');
        }
        if (j == 0) {
            column.innerText = row_items[i];
            column.classList.add('bold-text');
        }
        row.appendChild(column);
    }
    inst_table.appendChild(row);
}
inst_table_container.appendChild(inst_table);


// create a memory table
const memoryTable = document.createElement('table');
const memoryTable__container = document.querySelector('.memory-table');
for (let i = 0; i < 4097; i++) {
    let row = document.createElement('tr');
    for (let j = 0; j < 3; j++) {
        let column = document.createElement('td');
        if (i == 0) {
            if (j == 0) {
                column.innerText = 'Decimal Addrress';
            } else if (j == 1) {
                column.innerText = 'Hex Addrress';
            } else if (j == 2) {
                column.innerText = 'Contents';
            }
            column.classList.add('bold-text');
            row.classList.add('sticky-header');
        } else if (j == 0) {
            column.innerText = i;
            column.classList.add('bold-text');
        } else if (j == 1) {
            column.innerText = DecToHex(i);
            column.classList.add('bold-text');
        }

        // else if (j == 1) {
        //     column.classList.add('second-column');
        // }
        column.classList.add('text-center');
        row.appendChild(column);
    }
    memoryTable.appendChild(row);
}
memoryTable__container.appendChild(memoryTable);
// console.log(memory_array);


function updateContentsColumn() {
    const table = document.querySelector('.memory-table table');
    const rows = table.getElementsByTagName('tr');
    const columns = table.getElementsByTagName('td');
    let counter = startAddress;
    for (let i = parseInt('0x' + startAddress); i < parseInt('0x' + startAddress) + numberOfAddress; i++) {
        columns[i * 3 + 2].innerText = memory_table[counter];
        counter++;
    }
    scrollToRow(parseInt('0x' + startAddress));
}

function scrollToRow(number) {
    const table = document.querySelector('.memory-table table');
    const rows = table.getElementsByTagName('tr');
    table.scrollTop = rows[number - 2].offsetTop;
}