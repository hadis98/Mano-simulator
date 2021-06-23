function DecToHex(decimal) { // Data (decimal)

    length = -1; // Base string length
    string = ''; // Source 'string'

    characters = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F']; // character array

    do { // Grab each nibble in reverse order because JavaScript has no unsigned left shift

        string += characters[decimal & 0xF]; // Mask byte, get that character
        ++length; // Increment to length of string

    } while (decimal >>>= 4); // For next character shift right 4 bits, or break on 0

    decimal += 'x'; // Convert that 0 into a hex prefix string -> '0x'

    do
        decimal += string[length];
    while (length--); // Flip string forwards, with the prefixed '0x'

    return (decimal); // return (hexadecimal);
}
console.log(DecToHex(-23));
console.log(DecToHex(-4096));

/* Original: */

D = 3678; // Data (decimal)
C = 0xF; // Check
A = D; // Accumulate
B = -1; // Base string length
S = ''; // Source 'string'
H = '0x'; // Destination 'string'

do {
    ++B;
    A &= C;

    switch (A) {
        case 0xA:
            A = 'A'
            break;

        case 0xB:
            A = 'B'
            break;

        case 0xC:
            A = 'C'
            break;

        case 0xD:
            A = 'D'
            break;

        case 0xE:
            A = 'E'
            break;

        case 0xF:
            A = 'F'
            break;

            A = (A);
    }
    S += A;

    D >>>= 0x04;
    A = D;
} while (D)

do
    H += S[B];
while (B--)

S = B = A = C = D; // Zero out variables
// alert(H);
// console.log(H);