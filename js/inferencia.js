const calc = document.getElementById("calc");
const content = document.querySelector("main");
const params = Array.from(document.querySelectorAll("#parameters > *"));
const result = document.querySelector(".result");
const math = document.querySelector(".math");
const option = document.querySelector(".select-menu");
const DECIMALS = 4;

const P = [
    2.46196981473530512524E-10,
    5.64189564831068821977E-1,
    7.46321056442269912687E0,
    4.86371970985681366614E1,
    1.96520832956077098242E2,
    5.26445194995477358631E2,
    9.34528527171957607540E2,
    1.02755188689515710272E3,
    5.57535335369399327526E2,
];
const Q = [
    1.32281951154744992508E1,
    8.67072140885989742329E1,
    3.54937778887819891062E2,
    9.75708501743205489753E2,
    1.82390916687909736289E3,
    2.24633760818710981792E3,
    1.65666309194161350182E3,
    5.57535340817727675546E2,
];
const R = [
    5.64189583547755073984E-1,
    1.27536670759978104416E0,
    5.01905042251180477414E0,
    6.16021097993053585195E0,
    7.40974269950448939160E0,
    2.97886665372100240670E0,
];
const S = [
    2.26052863220117276590E0,
    9.39603524938001434673E0,
    1.20489539808096656605E1,
    1.70814450747565897222E1,
    9.60896809063285878198E0,
    3.36907645100081516050E0,
];
const T = [
    9.60497373987051638749E0,
    9.00260197203842689217E1,
    2.23200534594684319226E3,
    7.00332514112805075473E3,
    5.55923013010394962768E4,
];
const U = [
    3.35617141647503099647E1,
    5.21357949780152679795E2,
    4.59432382970980127987E3,
    2.26290000613890934246E4,
    4.92673942608635921086E4,
];
function polevl(x, c) {
    return c.reduce((r, c) => r * x + c, 0);
}
function p1evl(x, c) {
    return c.reduce((r, c) => r * x + c, 1);
}

function erf(x) {
    if (Math.abs(x) > 1) return 1 - erfc(x);
    const z = x * x;
    return x * polevl(z, T) / p1evl(z, U);
}
// erfc(x) = 1 - erf(x)
const MAXLOG = Math.log(Number.MAX_VALUE);
function erfc(x0) {
    const x = Math.abs(x0);
    if (x < 1) return 1 - erf(x);
    const z = -x0 * x0;
    if (z < -MAXLOG) return x0 < 0 ? 2 : 0;
    const [p, q] = x < 8 ? [P, Q] : [R, S];
    const y = Math.exp(z) * polevl(x, p) / p1evl(x, q);
    return x0 < 0 ? 2 - y : y;
}

class Mean {
    constructor(mu, n, o2) {
        this.mu = mu;
        this.n = n;
        this.o2 = o2;
        this.s = o2;
        //[this.o2, this.S] = typeof(this.o2) === 'undefined' ? this.S : this.o2 = o2
    }
    Z(x) {
        return (x - this.mu) / (this.o2 / Math.sqrt(this.n));
    }
    T(x) {
        return (x - this.mu) / (this.s / Math.sqrt(this.n));
    }
    solve(x) {
        return erfc(this.Z(x).roundTo(4) / Math.SQRT2) / 2;
    }
}
class Proportion {
    constructor(p, n) {
        this.p = p;
        this.n = n;
        this.q = 1 - p;
        this.o2 = Math.sqrt((this.p * this.q) / this.n)
    }
    Z(prob) {
        return (prob - this.p) / this.o2;
    }
    solve(prob) {
        return erfc(this.Z(prob).roundTo(2) / Math.SQRT2) / 2;
    }
}
class Variance {
    constructor(s2, n, o2) {
        this.s2 = s2;
        this.n = n;
        this.o2 = o2;
    }
    X2() {
        return ( (this.n - 1) * this.s2 ) / this.o2;
    }
}

function calc__test(n, mu, sigma, s) {
    if (!sigma) {
        s ??= s()
        tstudent();
    } else {
        z(x, mu, sigma, n)
    }
    if ( n < 30 ) {
        if (!sigma) {
            if (!s) { s = s()}
            tstudent();
        } else {
            z(x, mu, sigma, n)
        }
    } else {
        z(x, mu, sigma, n)
    }
}

function statistics() {
    let stat = option.value;
    switch (stat) {
        case 'mean':
            Object.assign(params[0], { id: "mu",  placeholder: "mu" });
            Object.assign(params[1], { id: "n", placeholder: "n" });
            Object.assign(params[2], { id: "o2",  placeholder: "o2" });
            Object.assign(params[3], { id: "x",  placeholder: "x", style: "display: flex;" });

            calc.onclick = () => {
                const mu = params[0].value;
                const n = params[1].value;
                const o2 = params[2].value;
                const x = params[3].value;

                const mean = new Mean(mu, n, o2, x)
                //result.textContent = mean.solve(x);

                let lex = "\\overline{X} \\sim N(\\mu, \\sigma^2) \\newline ";
                lex += `\\overline{X} \\sim N \\Big(${mu}, \\frac{ ${o2} } {\\sqrt{ ${n} }} \\Big) \\newline `;
                lex += `P(Z > \\frac{ ${x} - ${mu} }{ ${o2}/\\sqrt{ ${n} } }) \\newline `
                lex += `P(Z > ${mean.Z(x).roundTo(4)}) = ${mean.solve(x).roundTo(4)} `
                katex.render(lex, math, {displayMode: true});
            }
            break;
        case 'proportion':
            Object.assign(params[0], { id: "p",  placeholder: "p" });
            Object.assign(params[1], { id: "n", placeholder: "n" });
            Object.assign(params[2], { id: "prob",  placeholder: "prob" });
            Object.assign(params[3], { style: "display: none;" });

            calc.onclick = () => {
                const p = params[0].value;
                const n = params[1].value;
                const prob = params[2].value;

                const proportion = new Proportion(p, n)
                result.textContent = proportion.solve(prob);
            }
            break;
        case 'variance':
            Object.assign(params[0], { id: "s2",  placeholder: "s2" });
            Object.assign(params[1], { id: "n", placeholder: "n" });
            Object.assign(params[2], { id: "o2",  placeholder: "o2" });
            Object.assign(params[3], { style: "display: none;" });

            calc.onclick = () => {
                const s2 = params[0].value;
                const n = params[1].value;
                const o2 = params[2].value;

                const variance = new Variance(s2, n, o2)
                result.textContent = variance.X2();
            }
            break;
    }
}

statistics();
option.onchange = statistics;
