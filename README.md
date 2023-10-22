# Mano simulator

* Mano Simulator is a web-based application that simulates the Mano machine, a hypothetical computer designed by Morris Mano.
* The Mano machine is a simple 16-bit computer that can perform basic arithmetic and logical operations, as well as input and output operations. 
* The Mano Simulator allows you to write, assemble, and execute assembly code for the Mano machine, and observe the changes in the memory and registers.
* Written with html, css, and javascript.

* To see the list of instructions please use [Mano Instructions Table](https://en.wikipedia.org/wiki/Mano_machine#Instruction_set)

### [Live Site](https://hadis98.github.io/Mano-simulator)

<img  src="https://i.postimg.cc/XJprNdzk/mano-simulator.png"/>


## Features
• A code editor.

• A memory table that displays the addresses and contents of the 4096 words of memory.

• A instructio table that shows the current state of the program counter, accumulator, and flags.

• A command table that displays the current instruction, operand, and operation code.

• A control panel that allows you to fetch, decode, and execute each instruction step by step, or reset the program.

• A help button that shows information about the program and the Mano assembly language.

## How to Use
To use this program, follow these steps:

1. Write your code in the left box of the page.
    * You should add each instruction in a separate line. 
2.  Click the Assemble button to assemble your code. 
    * If the assembly process is successful, you will see a message saying "Assemble Successful".
    * Otherwise, you will see an error message indicating the type and location of the error.
3. If the assembly process is successful, the addresses and contents of the memory will be displayed in the table on the right.
    * This table shows how your code is stored in the memory of the Mano machine.
4. To execute your code, you must first click on the Fetch button, then the Decode button, and then Execute for each instruction.
    * You must follow this order to simulate the instruction cycle of the Mano machine. 
    * The buttons will be activated or deactivated accordingly.   
5. By clicking on the Fetch, Decode, and Execute buttons, the middle table related to the commands will change and display the current instruction, operand, and operation code.
6. For convenience, each instruction that is executed will be shown in a box below the code editor. 
    * This box shows which instruction is currently being processed by the Mano machine.
7. Whenever the memory table is updated by an instruction, it will be displayed at the right table of the program
    * the updated value will be highlighted with a different color.
    * This helps you to see how your code affects the memory of the Mano machine.
9. you should have "END" instruction in your code in order to be executed.
8. At the end of executing your code, a message box will be displayed saying "End of Program". 
    * This means that your code has finished executing and there are no more instructions to process.
9. To use the program again, you must click on the Reset button. 
    * This will clear all the tables and boxes, and reset all the values to zero.
    * You can then enter a new code or modify your existing code and assemble it again.

### Some possible errors are:
• Empty code box: You have not entered any code in the box.

• Invalid instruction: You have entered an instruction that is not recognized by the assembler.

• Undefined variable: You have used a variable that has not been defined before.

## Examples 
### 1. Add two 32bit numbers
```Assembly
ORG 100
LDA AL
ADD BL
STA CL
CLA
CIL
ADD AH
ADD BH
STA CH
HLT
AL, DEC 12
AH, DEC 32
BL, DEC 40
BH, DEC 02
CL,DEC 0
CH, DEC 0
END
```
1. Clicking on Assemble Button 
    - <img width="100%" style="max-width: 900px;" src="https://i.postimg.cc/0QFp16ty/01.png"/>

2. Executing LDA instruction
    - <img width="100%" style="max-width: 900px;" src="https://i.postimg.cc/MTQnR9Dz/02.png"/>

3. Executing ADD instruction
    - <img width="100%" style="max-width: 900px;" src="https://i.postimg.cc/BbfXC2YH/03.png"/>

4. Executing STA instruction
    - <img width="100%" style="max-width: 900px;" src="https://i.postimg.cc/qqcgDgSY/04.png"/>

5. Executing CLA instruction
    - <img width="100%" style="max-width: 900px;" src="https://i.postimg.cc/zX5ybSR1/05.png"/>

6. Executing CLI instruction
    - <img width="100%" style="max-width: 900px;" src="https://i.postimg.cc/g0rXczLX/06.png"/>

7. Executing ADD instruction
    - <img width="100%" style="max-width: 900px;" src="https://i.postimg.cc/QxbHp9pK/07.png"/>

8. Executing ADD instruction
    - <img width="100%" style="max-width: 900px;" src="https://i.postimg.cc/9Xy4QN0p/08.png"/>

9. Executing STA instruction
    - <img width="100%" style="max-width: 900px;" src="https://i.postimg.cc/MG4cvC1s/09.png"/>

10. Executing HLT instruction
    - <img width="100%" style="max-width: 900px;" src="https://i.postimg.cc/QCDd7hCq/11.png"/>

11. END of the program
    - <p><img width="100%" style="max-width: 900px;" src="https://i.postimg.cc/rmxpzKVm/10.png"/></p>



## Demo
- You can see a live demo of this program [here](https://hadis98.github.io/Mano-simulator).
- You can also download or clone this repository and run it locally on your browser.

## License
- This project is licensed under [MIT License]. 
- You can use it for personal or educational purposes as long as you give credit to its author.

## Author
* This project was created by Hadis Ghafouri as a final project for Computer Architecture course at IUT.
* You can contact me by email at hadisghafouri@gmail.com.

