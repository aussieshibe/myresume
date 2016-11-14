class BFVM {
    
    constructor(program) {
        this.program = program;
        this.mem = [0];
        this.pgmCtr = 0;
        this.memPtr = 0;
        this.loopStack = [];
        this.out = function defaultOutputFunction(o) {
            console.log(o + ": " + String.fromCharCode(o));
        };
        this.in = function defaultInputFunction() {
            return 'a'.charCodeAt(0);
        };
        this.extUpdate = function () {};
        
    }
    
    run() {
        while(this.step()) {
        }
    }
    
    step() {
        switch (this.program[this.pgmCtr]) {
            case '+':
                this.handleInc();
                break;
            case '-':
                this.handleDec();
                break;
            case '>':
                this.memPtr++;
                break;
            case '<':
                if(this.memPtr > 0)
                    this.memPtr--;
                break;
            case '.':
                this.out(this.mem[this.memPtr]);
                break;
            case ',':
                this.mem[this.memPtr] = this.in();
                break;
            case '[':
                this.handleLoopStart();
                break;
            case ']':
                this.handleLoopEnd();
                break;
            default:
                // If this command is undefined, we're at the end, so return false
                if(typeof this.program[this.pgmCtr] === 'undefined')
                    return false;
                // Ignore, not a parsable character in brainfuck
                break;
        }
        this.pgmCtr++;
        this.extUpdate(this.pgmCtr, this.memPtr, this.mem);

        return true;
       
    }
    
    handleInc() {
        // Set the current cell to its value + 1, or 1 if its current value = NA
        // TODO: Handle overflow
        this.mem[this.memPtr] = this.mem[this.memPtr] + 1 || 1;
    }
    
    handleDec() {
        // Set the current cell to its value - 1, or 0 if its current value = NA
        // TODO: Handle underflow
        this.mem[this.memPtr] = this.mem[this.memPtr] - 1 || 0;
    }
    
    handleLoopStart() {
        // Push the pointer to this loop start to the loopStack
        // Save the length of the current loop stack as loopStackDepth
        var loopStackDepth = this.loopStack.push(this.pgmCtr);
        // If the value of the current cell is 0, jump to after the matching ]
        if (this.mem[this.memPtr] === 0) {
            
            // While no matching ']' has been found
            while (this.loopStack.length >= loopStackDepth) {
                // Increment the program counter
                this.pgmCtr++;
                // If the current command is undefined, we have an invalid pgm
                if (typeof this.program[this.pgmCtr] === 'undefined')
                    throw "Invalid program exception. Reached EOF while " +
                        "looking for closing ']'";
                // If the current command is a [, add it to the loopStack
                if (this.program[this.pgmCtr] === '[')
                    this.loopStack.push(this.pgmCtr);
                // If the current command is a ], pop it's matching [
                else if (this.program[this.pgmCtr] === ']')
                    // TODO: Error out if we make the loop Stack < loopStackDepth
                    this.loopStack.pop();
            }
        }
    }
    
    handleLoopEnd() {
        // If the current cell is non-zero, jump back to the matching '['
        if (this.mem[this.memPtr] != 0) {
            this.pgmCtr = this.loopStack[this.loopStack.length - 1];
        // Otherwise advance the program counter
        } else {
            this.loopStack.pop();
        }
    }

}