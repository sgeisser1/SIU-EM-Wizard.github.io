// Math Solver for SIU-EM-Wizard
// Provides mathematical calculations and validations

class MathSolver {
    constructor() {
        this.precision = 6; // Default precision for calculations
    }

    // Basic arithmetic operations
    add(a, b) {
        return this.roundToPrecision(a + b);
    }

    subtract(a, b) {
        return this.roundToPrecision(a - b);
    }

    multiply(a, b) {
        return this.roundToPrecision(a * b);
    }

    divide(a, b) {
        if (Math.abs(b) < Number.EPSILON) {
            throw new Error('Division by zero');
        }
        return this.roundToPrecision(a / b);
    }

    // Power and root operations
    power(base, exponent) {
        return this.roundToPrecision(Math.pow(base, exponent));
    }

    sqrt(number) {
        if (number < 0) {
            throw new Error('Square root of negative number');
        }
        return this.roundToPrecision(Math.sqrt(number));
    }

    nthRoot(number, n) {
        if (n === 0) {
            throw new Error('Root index cannot be zero');
        }
        if (number < 0 && n % 2 === 0) {
            throw new Error('Even root of negative number');
        }
        return this.roundToPrecision(Math.pow(number, 1/n));
    }

    // Fraction operations
    gcd(a, b) {
        a = Math.abs(a);
        b = Math.abs(b);
        while (b !== 0) {
            let temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }

    lcm(a, b) {
        return Math.abs(a * b) / this.gcd(a, b);
    }

    reduceFraction(numerator, denominator) {
        if (denominator === 0) {
            throw new Error('Denominator cannot be zero');
        }
        
        const gcdValue = this.gcd(numerator, denominator);
        return {
            num: numerator / gcdValue,
            den: denominator / gcdValue
        };
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
        if (num2 === 0) {
            throw new Error('Cannot divide by zero fraction');
        }
        return this.reduceFraction(num1 * den2, den1 * num2);
    }

    // Electrical calculations
    ohmsLaw = {
        voltage: (current, resistance) => {
            return this.multiply(current, resistance);
        },
        
        current: (voltage, resistance) => {
            return this.divide(voltage, resistance);
        },
        
        resistance: (voltage, current) => {
            return this.divide(voltage, current);
        },
        
        power: (voltage, current) => {
            return this.multiply(voltage, current);
        },
        
        powerFromVoltage: (voltage, resistance) => {
            return this.divide(this.multiply(voltage, voltage), resistance);
        },
        
        powerFromCurrent: (current, resistance) => {
            return this.multiply(this.multiply(current, current), resistance);
        }
    };

    // Specific resistance calculations
    specificResistance = {
        resistance: (rho, length, area, isLine = false) => {
            const factor = isLine ? 2 : 1;
            return this.multiply(factor, this.multiply(rho, this.divide(length, area)));
        },
        
        length: (resistance, rho, area, isLine = false) => {
            const factor = isLine ? 2 : 1;
            return this.divide(this.multiply(resistance, area), this.multiply(factor, rho));
        },
        
        area: (resistance, rho, length, isLine = false) => {
            const factor = isLine ? 2 : 1;
            return this.divide(this.multiply(factor, this.multiply(rho, length)), resistance);
        }
    };

    // Power and work calculations
    powerWork = {
        mechanicalPower: (force, velocity) => {
            return this.multiply(force, velocity);
        },
        
        rotationalPower: (torque, angularVelocity) => {
            return this.multiply(torque, angularVelocity);
        },
        
        powerFromWork: (work, time) => {
            return this.divide(work, time);
        },
        
        work: (power, time) => {
            return this.multiply(power, time);
        },
        
        efficiency: (outputPower, inputPower) => {
            return this.divide(outputPower, inputPower);
        },
        
        outputPower: (inputPower, efficiency) => {
            return this.multiply(inputPower, efficiency);
        },
        
        inputPower: (outputPower, efficiency) => {
            return this.divide(outputPower, efficiency);
        },
        
        totalEfficiency: (...efficiencies) => {
            return efficiencies.reduce((total, eff) => this.multiply(total, eff), 1);
        }
    };

    // Linear equation solver
    solveLinearEquation(a, b, c) {
        // Solves ax + b = c for x
        if (Math.abs(a) < Number.EPSILON) {
            throw new Error('Coefficient of x cannot be zero');
        }
        return this.divide(this.subtract(c, b), a);
    }

    // Trigonometric functions (in degrees)
    sin(degrees) {
        return this.roundToPrecision(Math.sin(this.degreesToRadians(degrees)));
    }

    cos(degrees) {
        return this.roundToPrecision(Math.cos(this.degreesToRadians(degrees)));
    }

    tan(degrees) {
        const radians = this.degreesToRadians(degrees);
        const cosValue = Math.cos(radians);
        if (Math.abs(cosValue) < Number.EPSILON) {
            return 'undefined';
        }
        return this.roundToPrecision(Math.tan(radians));
    }

    degreesToRadians(degrees) {
        return degrees * Math.PI / 180;
    }

    radiansToDegrees(radians) {
        return radians * 180 / Math.PI;
    }

    // Utility functions
    roundToPrecision(number, precision = this.precision) {
        if (typeof number !== 'number' || isNaN(number)) {
            return number;
        }
        return Math.round(number * Math.pow(10, precision)) / Math.pow(10, precision);
    }

    isEqual(a, b, tolerance = 0.001) {
        return Math.abs(a - b) <= tolerance;
    }

    formatNumber(number, decimals = 3) {
        if (typeof number !== 'number' || isNaN(number)) {
            return number;
        }
        
        // Remove trailing zeros
        let formatted = number.toFixed(decimals);
        formatted = formatted.replace(/\.?0+$/, '');
        return formatted;
    }

    // Percentage calculations
    percentage(value, total) {
        return this.roundToPrecision(this.multiply(this.divide(value, total), 100));
    }

    percentageOf(percentage, total) {
        return this.roundToPrecision(this.multiply(total, this.divide(percentage, 100)));
    }

    // Unit conversions
    conversions = {
        // Power
        wattsToKilowatts: (watts) => this.divide(watts, 1000),
        kilowattsToWatts: (kw) => this.multiply(kw, 1000),
        
        // Energy
        joulesToKwh: (joules) => this.divide(joules, 3600000),
        kWhToJoules: (kwh) => this.multiply(kwh, 3600000),
        
        // Time
        hoursToSeconds: (hours) => this.multiply(hours, 3600),
        secondsToHours: (seconds) => this.divide(seconds, 3600),
        
        // Frequency
        hzToRadsPerSec: (hz) => this.multiply(hz, this.multiply(2, Math.PI)),
        radsPerSecToHz: (rads) => this.divide(rads, this.multiply(2, Math.PI)),
        
        // Angle
        degreesToRadians: (deg) => this.multiply(deg, this.divide(Math.PI, 180)),
        radiansToDegrees: (rad) => this.multiply(rad, this.divide(180, Math.PI))
    };

    // Complex number operations (for AC circuits)
    complex = {
        add: (a, b) => {
            return {
                real: this.add(a.real, b.real),
                imag: this.add(a.imag, b.imag)
            };
        },
        
        multiply: (a, b) => {
            return {
                real: this.subtract(this.multiply(a.real, b.real), this.multiply(a.imag, b.imag)),
                imag: this.add(this.multiply(a.real, b.imag), this.multiply(a.imag, b.real))
            };
        },
        
        magnitude: (complex) => {
            return this.sqrt(this.add(this.multiply(complex.real, complex.real), 
                                     this.multiply(complex.imag, complex.imag)));
        },
        
        phase: (complex) => {
            return this.radiansToDegrees(Math.atan2(complex.imag, complex.real));
        }
    };

    // Vector operations (for fields)
    vector = {
        magnitude: (x, y) => {
            return this.sqrt(this.add(this.multiply(x, x), this.multiply(y, y)));
        },
        
        angle: (x, y) => {
            return this.radiansToDegrees(Math.atan2(y, x));
        },
        
        components: (magnitude, angle) => {
            const radians = this.degreesToRadians(angle);
            return {
                x: this.multiply(magnitude, Math.cos(radians)),
                y: this.multiply(magnitude, Math.sin(radians))
            };
        }
    };

    // Validation functions
    validate = {
        isPositive: (value) => value > 0,
        isNonNegative: (value) => value >= 0,
        isInRange: (value, min, max) => value >= min && value <= max,
        isInteger: (value) => Number.isInteger(value),
        isValidFraction: (num, den) => den !== 0,
        isValidPercentage: (value) => value >= 0 && value <= 100
    };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MathSolver;
} else {
    window.MathSolver = MathSolver;
}

// Create global instance
if (typeof window !== 'undefined') {
    window.mathSolver = new MathSolver();
}