// --- UTILITY FUNCTIONS ---
// Generates a random integer between min and max (inclusive)
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Finds the greatest common divisor for simplifying fractions
const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);

// --- EXERCISE DATABASE ---
const exercises = {
    // --- MATHEMATICS ---
    'math-fraction-add': {
        title: "Bruchrechnung: Addition & Subtraktion",
        description: "Berechnen Sie das Ergebnis und kürzen Sie so weit wie möglich.",
        levels: ['Einfach', 'Mittel', 'Schwer'],
        generate: (level) => {
            let n1, d1, n2, d2, op, question, res_n, res_d;
            if (level === 'Einfach') { // Common denominators
                d1 = d2 = randInt(3, 9);
                n1 = randInt(1, d1 - 1);
                n2 = randInt(1, d1 - 1);
            } else if (level === 'Mittel') { // Different denominators
                d1 = randInt(3, 7);
                d2 = randInt(3, 7);
                n1 = randInt(1, d1 - 1);
                n2 = randInt(1, d2 - 1);
            } else { // Harder different denominators
                d1 = randInt(5, 12);
                d2 = randInt(5, 12);
                n1 = randInt(2, d1 - 1);
                n2 = randInt(2, d2 - 1);
            }
            op = Math.random() < 0.5 ? '+' : '-';
            question = `\\frac{${n1}}{${d1}} ${op} \\frac{${n2}}{${d2}}`;

            if (op === '+') {
                res_n = n1 * d2 + n2 * d1;
                res_d = d1 * d2;
            } else {
                res_n = n1 * d2 - n2 * d1;
                res_d = d1 * d2;
            }

            const commonDivisor = gcd(Math.abs(res_n), Math.abs(res_d));
            const simplified_n = res_n / commonDivisor;
            const simplified_d = res_d / commonDivisor;

            let answer = `\\frac{${simplified_n}}{${simplified_d}}`;
            if (simplified_d === 1) answer = `${simplified_n}`;
            if (simplified_n === 0) answer = '0';
            
            const solutionSteps = `
                1. Hauptnenner finden: $${d1} \\cdot ${d2} = ${d1 * d2}$
                2. Brüche erweitern: $\\frac{${n1} \\cdot ${d2}}{${d1 * d2}} ${op} \\frac{${n2} \\cdot ${d1}}{${d1 * d2}} = \\frac{${n1 * d2}}{${res_d}} ${op} \\frac{${n2 * d1}}{${res_d}}$
                3. Zähler berechnen: $${n1 * d2} ${op} ${n2 * d1} = ${res_n}$
                4. Ergebnis vor Kürzung: $\\frac{${res_n}}{${res_d}}$
                5. Gekürztes Endergebnis: $${answer}$
            `;
            return { question, answer, solutionSteps };
        },
    },
    'math-fraction-multiply': {
        title: "Bruchrechnung: Multiplikation & Division",
        description: "Berechnen Sie das Ergebnis. Bei Division, denken Sie an den Kehrwert.",
        levels: ['Einfach', 'Mittel'],
        generate: (level) => {
            const d1 = randInt(3, 9), d2 = randInt(3, 9);
            const n1 = randInt(1, 8), n2 = randInt(1, 8);
            const op = Math.random() < 0.6 ? '\\cdot' : ':';
            
            let question = `\\frac{${n1}}{${d1}} ${op} \\frac{${n2}}{${d2}}`;
            let res_n, res_d, solutionSteps;

            if (op === '\\cdot') {
                res_n = n1 * n2;
                res_d = d1 * d2;
                solutionSteps = `
                    1. Zähler mal Zähler: $${n1} \\cdot ${n2} = ${res_n}$
                    2. Nenner mal Nenner: $${d1} \\cdot ${d2} = ${res_d}$
                    3. Ergebnis vor Kürzung: $\\frac{${res_n}}{${res_d}}$`;
            } else { // Division
                res_n = n1 * d2;
                res_d = d1 * n2;
                solutionSteps = `
                    1. Mit dem Kehrwert multiplizieren: $\\frac{${n1}}{${d1}} \\cdot \\frac{${d2}}{${n2}}$
                    2. Zähler mal Zähler: $${n1} \\cdot ${d2} = ${res_n}$
                    3. Nenner mal Nenner: $${d1} \\cdot ${n2} = ${res_d}$
                    4. Ergebnis vor Kürzung: $\\frac{${res_n}}{${res_d}}$`;
            }

            const commonDivisor = gcd(res_n, res_d);
            const simplified_n = res_n / commonDivisor;
            const simplified_d = res_d / commonDivisor;
            let answer = `\\frac{${simplified_n}}{${simplified_d}}`;
             if (simplified_d === 1) answer = `${simplified_n}`;

            solutionSteps += `<br>5. Gekürztes Endergebnis: $${answer}$`;
            return { question, answer, solutionSteps };
        },
    },
    'math-equation-linear': {
        title: "Lineare Gleichungen lösen",
        description: "Stellen Sie die Gleichung um und finden Sie den Wert für x.",
        levels: ['Einfach', 'Mittel', 'Schwer'],
        generate: (level) => {
            const a = randInt(2, 7), b = randInt(2, 15);
            let c, d, question, solutionSteps, answer;
            
            if (level === 'Einfach') { // ax + b = c
                c = randInt(10, 50);
                question = `${a}x + ${b} = ${c}`;
                answer = (c - b) / a;
                solutionSteps = `
                    ${a}x + ${b} = ${c} \\quad | -${b} \\\\
                    ${a}x = ${c - b} \\quad | \\div ${a} \\\\
                    x = \\frac{${c - b}}{${a}} = ${answer.toFixed(2)}
                `;
            } else { // ax + b = cx + d
                c = randInt(2, 7);
                if (a === c) c++; // Avoid 0x
                d = randInt(2, 20);
                question = `${a}x + ${b} = ${c}x + ${d}`;
                answer = (d - b) / (a - c);
                 solutionSteps = `
                    ${a}x + ${b} = ${c}x + ${d} \\quad | -${c}x \\\\
                    ${a-c}x + ${b} = ${d} \\quad | -${b} \\\\
                    ${a-c}x = ${d - b} \\quad | \\div ${a-c} \\\\
                    x = \\frac{${d - b}}{${a-c}} = ${answer.toFixed(2)}
                `;
            }
            // Schwer is not implemented yet, but could involve brackets
            return { question, answer: `x = ${answer.toFixed(2)}`, solutionSteps };
        },
    },
    'math-equation-fractional': {
        title: "Bruchgleichungen lösen",
        description: "Lösen Sie die Gleichung nach x auf. (Analog Musterprüfung Aufgabe 1)",
        levels: ['Musterprüfung'],
        generate: (level) => {
            const n1 = randInt(2, 5);
            const n2 = randInt(n1 + 1, 10);
            const a = randInt(1, 3);
            const b = randInt(1, 3);

            const question = `\\frac{${n1}}{x - ${a}} = \\frac{${n2}}{x + ${b}}`;
            
            const term1 = n1;
            const term1x = n1;
            const term2 = -n2 * a;
            const term2x = n2;
            
            // n1(x+b) = n2(x-a) -> n1x + n1b = n2x - n2a
            // n1b + n2a = n2x - n1x
            // n1b + n2a = (n2 - n1)x
            const x = (n1*b + n2*a) / (n2 - n1);
            
            const answer = `x = ${x.toFixed(3)}`;
            const solutionSteps = `
                1. Über Kreuz multiplizieren: $${n1}(x + ${b}) = ${n2}(x - ${a})$ <br>
                2. Klammern auflösen: $${n1}x + ${n1*b} = ${n2}x - ${n2*a}$ <br>
                3. Terme mit x auf eine Seite, Zahlen auf die andere: $${n1*b} + ${n2*a} = ${n2}x - ${n1}x$ <br>
                4. Zusammenfassen: $${n1*b + n2*a} = ${n2-n1}x$ <br>
                5. Nach x auflösen: $x = \\frac{${n1*b + n2*a}}{${n2-n1}} = ${x.toFixed(3)}$
            `;
            return { question, answer, solutionSteps };
        }
    },
    
    // --- DC CIRCUITS ---
    'dc-ohm-law': {
        title: "Ohmsches Gesetz",
        description: "Berechnen Sie die fehlende Grösse (U, I oder R). Achten Sie auf die Einheiten!",
        levels: ['Einfach', 'Mittel (mit k/m)'],
        generate: (level) => {
            const scenario = randInt(1, 3); // 1:U, 2:R, 3:I gesucht
            let U, I, R, question, answer, solutionSteps;
            const usePrefix = level !== 'Einfach';
            
            if (scenario === 1) { // U gesucht
                I = usePrefix ? randInt(10, 500) / 1000 : randInt(1, 5); // A oder mA
                R = usePrefix ? randInt(1, 10) * 1000 : randInt(10, 200); // Ohm oder kOhm
                U = I * R;
                const iUnit = usePrefix ? 'mA' : 'A';
                const rUnit = usePrefix ? 'k\\Omega' : '\\Omega';
                question = `Gegeben: $I = ${usePrefix ? I*1000 : I}\\,${iUnit}$, $R = ${usePrefix ? R/1000 : R}\\,${rUnit}$. <br>Gesucht: $U$ in Volt.`;
                answer = `U = ${U.toFixed(2)}\\,V`;
                solutionSteps = `$U = R \\cdot I = ${R}\\,\\Omega \\cdot ${I}\\,A = ${U.toFixed(2)}\\,V$`;
            } else if (scenario === 2) { // R gesucht
                U = randInt(5, 48);
                I = randInt(50, 500) / 1000;
                R = U / I;
                question = `Gegeben: $U = ${U}\\,V$, $I = ${I*1000}\\,mA$. <br>Gesucht: $R$ in Ohm.`;
                answer = `R = ${R.toFixed(2)}\\,\\Omega`;
                solutionSteps = `$R = \\frac{U}{I} = \\frac{${U}\\,V}{${I}\\,A} = ${R.toFixed(2)}\\,\\Omega$`;
            } else { // I gesucht
                U = randInt(12, 230);
                R = randInt(100, 2000);
                I = U / R;
                question = `Gegeben: $U = ${U}\\,V$, $R = ${R}\\,\\Omega$. <br>Gesucht: $I$ in Ampere und Milliampere.`;
                answer = `I = ${I.toFixed(3)}\\,A = ${(I*1000).toFixed(1)}\\,mA`;
                solutionSteps = `$I = \\frac{U}{R} = \\frac{${U}\\,V}{${R}\\,\\Omega} = ${I.toFixed(3)}\\,A$`;
            }
             return { question, answer, solutionSteps };
        }
    },
    'dc-series-parallel': {
        title: "Serien- & Parallelschaltung",
        description: "Berechnen Sie den Gesamtwiderstand der Schaltung.",
        levels: ['Serie', 'Parallel', 'Gemischt'],
        generate: (level) => {
            const R1 = randInt(10, 100);
            const R2 = randInt(10, 100);
            const R3 = randInt(10, 100);
            let Rges, question, answer, solutionSteps;
            
            if(level === 'Serie') {
                question = `Zwei Widerstände $R_1=${R1}\\,\\Omega$ und $R_2=${R2}\\,\\Omega$ sind in Serie geschaltet.`;
                Rges = R1 + R2;
                solutionSteps = `$R_{ges} = R_1 + R_2 = ${R1}\\,\\Omega + ${R2}\\,\\Omega = ${Rges}\\,\\Omega$`;
            } else if (level === 'Parallel') {
                question = `Zwei Widerstände $R_1=${R1}\\,\\Omega$ und $R_2=${R2}\\,\\Omega$ sind parallel geschaltet.`;
                Rges = (R1 * R2) / (R1 + R2);
                 solutionSteps = `$R_{ges} = \\frac{R_1 \\cdot R_2}{R_1 + R_2} = \\frac{${R1} \\cdot ${R2}}{${R1} + ${R2}} = \\frac{${R1*R2}}{${R1+R2}} = ${Rges.toFixed(2)}\\,\\Omega$`;
            } else { // Gemischt
                 question = `$R_1=${R1}\\,\\Omega$ ist in Serie zu einer Parallelschaltung von $R_2=${R2}\\,\\Omega$ und $R_3=${R3}\\,\\Omega$.`;
                 const R23_parallel = (R2 * R3) / (R2 + R3);
                 Rges = R1 + R23_parallel;
                 solutionSteps = `
                    1. Zuerst den Ersatzwiderstand der Parallelschaltung berechnen: <br>
                    $R_{23} = \\frac{R_2 \\cdot R_3}{R_2 + R_3} = \\frac{${R2} \\cdot ${R3}}{${R2} + ${R3}} = ${R23_parallel.toFixed(2)}\\,\\Omega$ <br>
                    2. Dann den Serienwiderstand addieren: <br>
                    $R_{ges} = R_1 + R_{23} = ${R1}\\,\\Omega + ${R23_parallel.toFixed(2)}\\,\\Omega = ${Rges.toFixed(2)}\\,\\Omega$
                 `;
            }
            answer = `R_ges = ${Rges.toFixed(2)}\\,\\Omega`;
            return { question, answer, solutionSteps };
        }
    },
};


// --- DYNAMIC PAGE BUILDER ---
function initExerciseGenerator() {
    const containers = document.querySelectorAll('.exercise-container');
    
    containers.forEach(container => {
        const exerciseId = container.dataset.exerciseId;
        const exerciseData = exercises[exerciseId];
        
        if (!exerciseData) {
            container.innerHTML = `<p><strong>Fehler:</strong> Aufgabe mit ID "${exerciseId}" nicht gefunden.</p>`;
            return;
        }

        // Build the HTML structure for the exercise
        let levelOptions = exerciseData.levels.map(level => `<option value="${level}">${level}</option>`).join('');

        container.innerHTML = `
            <div class="exercise-header">
                <hgroup>
                    <h4>${exerciseData.title}</h4>
                    <p>${exerciseData.description}</p>
                </hgroup>
                <div class="difficulty-selector">
                    <select>${levelOptions}</select>
                </div>
            </div>
            <div class="exercise-body">
                <div class="question">Wähle eine Schwierigkeitsstufe und klicke auf "Neue Aufgabe".</div>
                <div class="solution hidden">
                    <h6>Lösungsweg</h6>
                    <div class="solution-steps"></div>
                </div>
            </div>
            <div class="grid">
                <button class="generate-btn">Neue Aufgabe</button>
                <button class="show-solution-btn secondary" disabled>Lösung anzeigen</button>
            </div>
        `;

        // Add event listeners
        const generateBtn = container.querySelector('.generate-btn');
        const showSolutionBtn = container.querySelector('.show-solution-btn');
        const levelSelector = container.querySelector('select');
        const questionDiv = container.querySelector('.question');
        const solutionDiv = container.querySelector('.solution');
        const solutionStepsDiv = container.querySelector('.solution-steps');

        generateBtn.addEventListener('click', () => {
            const level = levelSelector.value;
            const { question, answer, solutionSteps } = exerciseData.generate(level);

            // Display question and hide solution
            questionDiv.innerHTML = question;
            solutionStepsDiv.innerHTML = `<strong>Antwort: $${answer}$</strong><br><hr>${solutionSteps}`;
            solutionDiv.classList.add('hidden');
            showSolutionBtn.disabled = false;
            showSolutionBtn.textContent = 'Lösung anzeigen';
            
            // Re-render math formulas with KaTeX
            renderMathInElement(container, {
                delimiters: [
                    {left: '$$', right: '$$', display: true},
                    {left: '$', right: '$', display: false},
                ]
            });
        });

        showSolutionBtn.addEventListener('click', () => {
            solutionDiv.classList.toggle('hidden');
            showSolutionBtn.textContent = solutionDiv.classList.contains('hidden') 
                ? 'Lösung anzeigen' 
                : 'Lösung ausblenden';
        });
    });
}