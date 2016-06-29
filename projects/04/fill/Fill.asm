// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/04/Fill.asm

// Runs an infinite loop that listens to the keyboard input. 
// When a key is pressed (any key), the program blackens the screen,
// i.e. writes "black" in every pixel. When no key is pressed, the
// program clears the screen, i.e. writes "white" in every pixel.

// Put your code here.
@SCREEN
D=A
@curAddr
M=D
(LOOP)
    @KBD
    D=M
    @RELEASED
    D;JEQ
    @curAddr
    D=M
    @24576
    D=D-A
    @LOOP
    D;JGE
    @curAddr
    A=M
    M=-1
    @curAddr
    M=M+1
    @LOOP
    0;JMP
    (RELEASED)
        @curAddr
        D=M
        @SCREEN
        D=D-A
        @LOOP
        D;JLT
        @curAddr
        A=M
        M=0
        @curAddr
        M=M-1
        @LOOP
        0;JMP

