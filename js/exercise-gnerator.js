// Exercise Generator for SIU-EM-Wizard
// Generates various types of exercises for different topics

class ExerciseGenerator {
    constructor() {
        this.difficultyLevels = {
            easy: { min: 1, max: 20, complexity: 1 },
            medium: { min: 10, max: 100, complexity: 2 },
            hard: { min: 50, max: 500, complexity: 3 }
        };
        
        // Material properties for specific resistance
        this.materials = {
            'Kupfer': 0.0175,
            'Aluminium': 0.03,
            'Eisen': 0.10,
            'Silber': 0.017
        };
    }

    // Generate random number within difficulty range
    getRandomNumber(difficulty, options = {}) {
        const level = this.difficultyLevels[difficulty] || this.difficultyLevels.medium;
        const min = options.min || level.min;
        const max = options.max || level.max;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Generate basic arithmetic exercises
    generateArithmetic(difficulty = 'medium', operation = null) {
        const operations = operation ? [operation] : ['+', '-', '×', '÷'];
        const op = operations[Math.floor(Math.random() * operations.length)];
        
        let a, b, answer, question, hint, solution;

        switch (difficulty) {
            case 'easy':
                a = this.getRandomNumber('easy', { max: 20 });
                b = this.getRandomNumber('easy', { max: 20 });
                break;
            case 'medium':
                a = this.getRandomNumber('medium', { max: 100 });
                b = this.getRandomNumber('medium', { max: 100 });
                break;
            case 'hard':
                a = this.getRandomNumber('hard', { max: 500 });
                b = this.getRandomNumber('hard', { max: 500 });
                break;
        }

        switch (op) {
            case '+':
                answer = a + b;
                question = `${a} + ${b}`;
                hint = `Addieren Sie ${a} und ${b}`;
                solution = `${a} + ${b} = ${answer}`;
                break;
            case '-':
                if (a < b) [a, b] = [b, a]; // Ensure positive result
                answer = a - b;
                question = `${a} - ${b}`;
                hint = `Subtrahieren Sie ${b} von ${a}`;
                solution = `${a} - ${b} = ${answer}`;
                break;
            case '×':
                if (difficulty === 'easy') {
                    a = this.getRandomNumber('easy', { max: 12 });
                    b = this.getRandomNumber('easy', { max: 12 });
                } else if (difficulty === 'medium') {
                    a = this.getRandomNumber('medium', { max: 25 });
                    b = this.getRandomNumber('medium', { max: 25 });
                }
                answer = a * b;
                question = `${a} \\times ${b}`;
                hint = `Multiplizieren Sie ${a} mit ${b}`;
                solution = `${a} \\times ${b} = ${answer}`;
                break;
            case '÷':
                answer = this.getRandomNumber(difficulty, { min: 2, max: 20 });
                a = answer * b;
                question = `${a} \\div ${b}`;
                hint = `Teilen Sie ${a} durch ${b}`;
                solution = `${a} \\div ${b} = ${answer}`;
                break;
        }

        return {
            type: 'arithmetic',
            difficulty,
            question,
            answer,
            hint,
            solution,
            steps: this.generateArithmeticSteps(a, b, op, answer)
        };
    }

    generateArithmeticSteps(a, b, operation, result) {
        const steps = [];
        
        switch (operation) {
            case '+':
                steps.push(`Gegeben: ${a} + ${b}`);
                steps.push(`Addiere die beiden Zahlen: ${a} + ${b} = ${result}`);
                break;
            case '-':
                steps.push(`Gegeben: ${a} - ${b}`);
                steps.push(`Subtrahiere ${b} von ${a}: ${a} - ${b} = ${result}`);
                break;
            case '×':
                steps.push(`Gegeben: ${a} × ${b}`);
                if (a <= 12 && b <= 12) {
                    steps.push(`Verwende das kleine Einmaleins: ${a} × ${b} = ${result}`);
                } else {
                    steps.push(`Multipliziere ${a} mit ${b}: ${a} × ${b} = ${result}`);
                }
                break;
            case '÷':
                steps.push(`Gegeben: ${a} ÷ ${b}`);
                steps.push(`Teile ${a} durch ${b}: ${a} ÷ ${b} = ${result}`);
                steps.push(`Probe: ${result} × ${b} = ${a} ✓`);
                break;
        }
        
        return steps;
    }

    // Generate fraction exercises
    generateFractions(difficulty = 'medium', operation = null) {
        const operations = operation ? [operation] : ['+', '-', '×', '÷'];
        const op = operations[Math.floor(Math.random() * operations.length)];
        
        let num1, den1, num2, den2;
        
        switch (difficulty) {
            case 'easy':
                num1 = this.getRandomNumber('easy', { min: 1, max: 10 });
                den1 = this.getRandomNumber('easy', { min: 2, max: 10 });
                num2 = this.getRandomNumber('easy', { min: 1, max: 10 });
                den2 = den1; // Same denominator for easy
                break;
            case 'medium':
                num1 = this.getRandomNumber('easy', { min: 1, max: 15 });
                den1 = this.getRandomNumber('easy', { min: 2, max: 12 });
                num2 = this.getRandomNumber('easy', { min: 1, max: 15 });
                den2 = this.getRandomNumber('easy', { min: 2, max: 12 });
                break;
            case 'hard':
                num1 = this.getRandomNumber('medium', { min: 1, max: 25 });
                den1 = this.getRandomNumber('medium', { min: 2, max: 20 });
                num2 = this.getRandomNumber('medium', { min: 1, max: 25 });
                den2 = this.getRandomNumber('medium', { min: 2, max: 20 });
                break;
        }

        // Ensure fractions are proper
        if (num1 >= den1) num1 = den1 - 1;
        if (num2 >= den2) num2 = den2 - 1;
        if (num1 === 0) num1 = 1;
        if (num2 === 0) num2 = 1;

        let question, answer, hint, solution;

        switch (op) {
            case '+':
                const addResult = this.addFractions(num1, den1, num2, den2);
                question = `\\frac{${num1}}{${den1}} + \\frac{${num2}}{${den2}}`;
                answer = addResult;
                hint = den1 === den2 ? 
                    `Gleiche Nenner: Addiere die Zähler` : 
                    `Finde den gemeinsamen Nenner: ${this.lcm(den1, den2)}`;
                solution = `\\frac{${num1}}{${den1}} + \\frac{${num2}}{${den2}} = \\frac{${addResult.num}}{${addResult.den}}`;
                break;
            case '-':
                const subResult = this.subtractFractions(num1, den1, num2, den2);
                question = `\\frac{${num1}}{${den1}} - \\frac{${num2}}{${den2}}`;
                answer = subResult;
                hint = den1 === den2 ? 
                    `Gleiche Nenner: Subtrahiere die Zähler` : 
                    `Finde den gemeinsamen Nenner: ${this.lcm(den1, den2)}`;
                solution = `\\frac{${num1}}{${den1}} - \\frac{${num2}}{${den2}} = \\frac{${subResult.num}}{${subResult.den}}`;
                break;
            case '×':
                const mulResult = this.multiplyFractions(num1, den1, num2, den2);
                question = `\\frac{${num1}}{${den1}} \\times \\frac{${num2}}{${den2}}`;
                answer = mulResult;
                hint = `Multipliziere Zähler mit Zähler und Nenner mit Nenner`;
                solution = `\\frac{${num1}}{${den1}} \\times \\frac{${num2}}{${den2}} = \\frac{${num1 * num2}}{${den1 * den2}} = \\frac{${mulResult.num}}{${mulResult.den}}`;
                break;
            case '÷':
                const divResult = this.divideFractions(num1, den1, num2, den2);
                question = `\\frac{${num1}}{${den1}} \\div \\frac{${num2}}{${den2}}`;
                answer = divResult;
                hint = `Multipliziere mit dem Kehrwert: \\frac{${num1}}{${den1}} \\times \\frac{${den2}}{${num2}}`;
                solution = `\\frac{${num1}}{${den1}} \\div \\frac{${num2}}{${den2}} = \\frac{${num1}}{${den1}} \\times \\frac{${den2}}{${num2}} = \\frac{${divResult.num}}{${divResult.den}}`;
                break;
        }

        return {
            type: 'fractions',
            difficulty,
            question,
            answer,
            hint,
            solution,
            steps: this.generateFractionSteps(num1, den1, num2, den2, op)
        };
    }

    generateFractionSteps(num1, den1, num2, den2, operation) {
        const steps = [];
        
        switch (operation) {
            case '+':
                if (den1 === den2) {
                    steps.push(`Gleiche Nenner: \\frac{${num1}}{${den1}} + \\frac{${num2}}{${den2}}`);
                    steps.push(`Addiere die Zähler: \\frac{${num1} + ${num2}}{${den1}} = \\frac{${num1 + num2}}{${den1}}`);
                } else {
                    const lcm = this.lcm(den1, den2);
                    const newNum1 = num1 * (lcm / den1);
                    const newNum2 = num2 * (lcm / den2);
                    steps.push(`Verschiedene Nenner: finde kgV(${den1}, ${den2}) = ${lcm}`);
                    steps.push(`Erweitere: \\frac{${num1}}{${den1}} = \\frac{${newNum1}}{${lcm}}, \\frac{${num2}}{${den2}} = \\frac{${newNum2}}{${lcm}}`);
                    steps.push(`Addiere: \\frac{${newNum1}}{${lcm}} + \\frac{${newNum2}}{${lcm}} = \\frac{${newNum1 + newNum2}}{${lcm}}`);
                }
                break;
            case '-':
                if (den1 === den2) {
                    steps.push(`Gleiche Nenner: \\frac{${num1}}{${den1}} - \\frac{${num2}}{${den2}}`);
                    steps.push(`Subtrahiere die Zähler: \\frac{${num1} - ${num2}}{${den1}} = \\frac{${num1 - num2}}{${den1}}`);
                } else {
                    const lcm = this.lcm(den1, den2);
                    const newNum1 = num1 * (lcm / den1);
                    const newNum2 = num2 * (lcm / den2);
                    steps.push(`Verschiedene Nenner: finde kgV(${den1}, ${den2}) = ${lcm}`);
                    steps.push(`Erweitere: \\frac{${num1}}{${den1}} = \\frac{${newNum1}}{${lcm}}, \\frac{${num2}}{${den2}} = \\frac{${newNum2}}{${lcm}}`);
                    steps.push(`Subtrahiere: \\frac{${newNum1}}{${lcm}} - \\frac{${newNum2}}{${lcm}} = \\frac{${newNum1 - newNum2}}{${lcm}}`);
                }
                break;
            case '×':
                steps.push(`Multipliziere Zähler mit Zähler und Nenner mit Nenner`);
                steps.push(`\\frac{${num1} \\times ${num2}}{${den1} \\times ${den2}} = \\frac{${num1 * num2}}{${den1 * den2}}`);
                const mulResult = this.multiplyFractions(num1, den1, num2, den2);
                if (mulResult.num !== num1 * num2 || mulResult.den !== den1 * den2) {
                    steps.push(`Kürze den Bruch: \\frac{${mulResult.num}}{${mulResult.den}}`);
                }
                break;
            case '÷':
                steps.push(`Division durch Multiplikation mit dem Kehrwert`);
                steps.push(`\\frac{${num1}}{${den1}} \\div \\frac{${num2}}{${den2}} = \\frac{${num1}}{${den1}} \\times \\frac{${den2}}{${num2}}`);
                steps.push(`= \\frac{${num1} \\times ${den2}}{${den1} \\times ${num2}} = \\frac{${num1 * den2}}{${den1 * num2}}`);
                const divResult = this.divideFractions(num1, den1, num2, den2);
                if (divResult.num !== num1 * den2 || divResult.den !== den1 * num2) {
                    steps.push(`Kürze den Bruch: \\frac{${divResult.num}}{${divResult.den}}`);
                }
                break;
        }
        
        return steps;
    }

    // Generate linear equation exercises
    generateLinearEquation(difficulty = 'medium') {
        let a, b, x;
        
        switch (difficulty) {
            case 'easy':
                a = this.getRandomNumber('easy', { min: 1, max: 10 });
                x = this.getRandomNumber('easy', { min: 1, max: 10 });
                b = this.getRandomNumber('easy', { min: -20, max: 20 });
                break;
            case 'medium':
                a = this.getRandomNumber('easy', { min: 2, max: 15 });
                x = this.getRandomNumber('medium', { min: -20, max: 20 });
                b = this.getRandomNumber('medium', { min: -50, max: 50 });
                break;
            case 'hard':
                a = this.getRandomNumber('easy', { min: 2, max: 20 });
                x = this.getRandomNumber('medium', { min: -30, max: 30 });
                b = this.getRandomNumber('medium', { min: -100, max: 100 });
                break;
        }

        // Generate equation: ax + b = c
        const c = a * x + b;
        const question = `${a}x ${b >= 0 ? '+' : ''} ${b} = ${c}`;
        const answer = x;
        const hint = `Isoliere x: Subtrahiere ${b}, dann teile durch ${a}`;
        const solution = `x = \\frac{${c} - (${b})}{${a}} = \\frac{${c - b}}{${a}} = ${x}`;

        return {
            type: 'linear_equation',
            difficulty,
            question,
            answer,
            hint,
            solution,
            steps: this.generateLinearEquationSteps(a, b, c, x)
        };
    }

    generateLinearEquationSteps(a, b, c, x) {
        const steps = [];
        steps.push(`Gegeben: ${a}x ${b >= 0 ? '+' : ''} ${b} = ${c}`);
        
        if (b !== 0) {
            if (b > 0) {
                steps.push(`Subtrahiere ${b} von beiden Seiten: ${a}x = ${c} - ${b}`);
            } else {
                steps.push(`Addiere ${Math.abs(b)} zu beiden Seiten: ${a}x = ${c} + ${Math.abs(b)}`);
            }
            steps.push(`Vereinfache: ${a}x = ${c - b}`);
        }
        
        steps.push(`Teile beide Seiten durch ${a}: x = \\frac{${c - b}}{${a}}`);
        steps.push(`Lösung: x = ${x}`);
        steps.push(`Probe: ${a} \\cdot ${x} ${b >= 0 ? '+' : ''} ${b} = ${a * x + b} = ${c} ✓`);
        
        return steps;
    }

    // Generate Ohm's Law exercises
    generateOhmsLaw(difficulty = 'medium', unknown = null) {
        const unknowns = unknown ? [unknown] : ['U', 'I', 'R'];
        const solve_for = unknowns[Math.floor(Math.random() * unknowns.length)];
        
        let U, I, R;
        
        switch (difficulty) {
            case 'easy':
                I = this.getRandomNumber('easy', { min: 1, max: 10 }); // 1 to 10 A
                R = this.getRandomNumber('easy', { min: 10, max: 100 }); // 10 to 100 Ω
                U = I * R;
                break;
            case 'medium':
                I = (this.getRandomNumber('medium', { min: 1, max: 50 }) / 10); // 0.1 to 5 A
                R = this.getRandomNumber('medium', { min: 50, max: 1000 }); // 50 to 1000 Ω
                U = Math.round(I * R * 10) / 10;
                break;
            case 'hard':
                I = (this.getRandomNumber('hard', { min: 1, max: 100 }) / 100); // 0.01 to 1 A
                R = this.getRandomNumber('hard', { min: 100, max: 10000 }); // 100 to 10k Ω
                U = Math.round(I * R * 100) / 100;
                break;
        }

        let question, answer, hint, solution, unit;

        switch (solve_for) {
            case 'U':
                question = `Gegeben: I = ${I} A, R = ${R} Ω<br>Berechnen Sie die Spannung U.`;
                answer = U;
                unit = 'V';
                hint = `Verwende das Ohmsche Gesetz: U = I × R`;
                solution = `U = I \\times R = ${I} \\text{ A} \\times ${R} \\text{ Ω} = ${U} \\text{ V}`;
                break;
            case 'I':
                question = `Gegeben: U = ${U} V, R = ${R} Ω<br>Berechnen Sie den Strom I.`;
                answer = I;
                unit = 'A';
                hint = `Verwende das Ohmsche Gesetz: I = U/R`;
                solution = `I = \\frac{U}{R} = \\frac{${U} \\text{ V}}{${R} \\text{ Ω}} = ${I} \\text{ A}`;
                break;
            case 'R':
                question = `Gegeben: U = ${U} V, I = ${I} A<br>Berechnen Sie den Widerstand R.`;
                answer = R;
                unit = 'Ω';
                hint = `Verwende das Ohmsche Gesetz: R = U/I`;
                solution = `R = \\frac{U}{I} = \\frac{${U} \\text{ V}}{${I} \\text{ A}} = ${R} \\text{ Ω}`;
                break;
        }

        return {
            type: 'ohms_law',
            difficulty,
            question,
            answer,
            unit,
            hint,
            solution,
            steps: this.generateOhmsLawSteps(U, I, R, solve_for)
        };
    }

    generateOhmsLawSteps(U, I, R, solve_for) {
        const steps = [];
        steps.push(`Ohmsches Gesetz: U = I \\times R`);
        
        switch (solve_for) {
            case 'U':
                steps.push(`Gegeben: I = ${I} \\text{ A}, R = ${R} \\text{ Ω}`);
                steps.push(`Gesucht: U`);
                steps.push(`Einsetzen: U = ${I} \\text{ A} \\times ${R} \\text{ Ω}`);
                steps.push(`Ergebnis: U = ${U} \\text{ V}`);
                break;
            case 'I':
                steps.push(`Umstellen nach I: I = \\frac{U}{R}`);
                steps.push(`Gegeben: U = ${U} \\text{ V}, R = ${R} \\text{ Ω}`);
                steps.push(`Gesucht: I`);
                steps.push(`Einsetzen: I = \\frac{${U} \\text{ V}}{${R} \\text{ Ω}}`);
                steps.push(`Ergebnis: I = ${I} \\text{ A}`);
                break;
            case 'R':
                steps.push(`Umstellen nach R: R = \\frac{U}{I}`);
                steps.push(`Gegeben: U = ${U} \\text{ V}, I = ${I} \\text{ A}`);
                steps.push(`Gesucht: R`);
                steps.push(`Einsetzen: R = \\frac{${U} \\text{ V}}{${I} \\text{ A}}`);
                steps.push(`Ergebnis: R = ${R} \\text{ Ω}`);
                break;
        }
        
        return steps;
    }

    // Helper functions for fractions
    gcd(a, b) {
        a = Math.abs(a);
        b = Math.abs(b);
        return b === 0 ? a : this.gcd(b, a % b);
    }

    lcm(a, b) {
        return (a * b) / this.gcd(a, b);
    }

    reduceFraction(num, den) {
        const g = this.gcd(Math.abs(num), Math.abs(den));
        return { num: num / g, den: den / g };
    }

    addFractions(num1, den1, num2, den2) {
        const commonDen = this.lcm(den1, den2);
        const newNum1 = num1 * (commonDen / den1);
        const newNum2 = num2 * (commonDen / den2);
        return this.reduceFraction(newNum1 + newNum2, commonDen);
    }

    subtractFractions(num1, den1, num2, den2) {
        const commonDen = this.lcm(den1, den2);
        const newNum1 = num1 * (commonDen / den1);
        const newNum2 = num2 * (commonDen / den2);
        return this.reduceFraction(newNum1 - newNum2, commonDen);
    }

    multiplyFractions(num1, den1, num2, den2) {
        return this.reduceFraction(num1 * num2, den1 * den2);
    }

    divideFractions(num1, den1, num2, den2) {
        return this.reduceFraction(num1 * den2, den1 * num2);
    }

    // Generate multiple choice questions
    generateMultipleChoice(baseExercise) {
        const correctAnswer = baseExercise.answer;
        const choices = [correctAnswer];
        
        // Generate 3 incorrect options
        for (let i = 0; i < 3; i++) {
            let incorrectAnswer;
            if (typeof correctAnswer === 'number') {
                const variation = correctAnswer * (0.2 + Math.random() * 0.6); // 20-80% variation
                incorrectAnswer = Math.random() > 0.5 ? 
                    +(correctAnswer + variation).toFixed(2) : 
                    +(correctAnswer - variation).toFixed(2);
                
                // Ensure different from correct answer
                if (Math.abs(incorrectAnswer - correctAnswer) < 0.01) {
                    incorrectAnswer = correctAnswer + (Math.random() > 0.5 ? 1 : -1);
                }
            } else {
                // For non-numeric answers, generate plausible alternatives
                incorrectAnswer = `Alternative ${i + 1}`;
            }
            choices.push(incorrectAnswer);
        }
        
        // Shuffle choices
        for (let i = choices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [choices[i], choices[j]] = [choices[j], choices[i]];
        }
        
        return {
            ...baseExercise,
            type: 'multiple_choice',
            choices,
            correctIndex: choices.indexOf(correctAnswer)
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ExerciseGenerator;
} else {
    window.ExerciseGenerator = ExerciseGenerator;
}