const nota = document.getElementById("nota-1");
const ponder = document.getElementById("ponder-1");
const plus = document.getElementById("plus");
const calc = document.getElementById("calc");
const content = document.querySelector("main");
const result = document.querySelector(".result");

const sumprom = (n, p) => n.reduce((_sum, _val, _i) => _sum + (_val * p[_i]), 0) / 100;
const round = (a, d) => Math.round(a * d) / d;

plus.onclick = () => {
    let n = document.querySelectorAll(".input-number[id^='nota']").length;
    let original = document.querySelector(".flex-row");
    let el = original.cloneNode(true);
    el.childNodes[1].id = `nota-${++n}`;
    el.childNodes[1].value = NaN;
    el.childNodes[3].id = `ponder-${n}`;
    el.childNodes[3].value = NaN;
    original.parentElement.append(el);
};

calc.onclick = () => {
    let notas = Array.from(document.querySelectorAll(".input-number[id^='nota']"));
    let percent = Array.from(document.querySelectorAll(".input-number[id^='ponder']"));
    notas = notas.map((_) => isNaN(_.valueAsNumber) ? 0 : _.valueAsNumber >= 10 ? _.valueAsNumber / 10 : _.valueAsNumber);
    percent = percent.map((_) => isNaN(_.valueAsNumber) ? 0 : _.valueAsNumber);
    let psum = percent.reduce((_a, _b) => _a + _b);
    if (psum > 100) {
        result.textContent = "La suma de los porcentajes es mayor a 100";
        return;
    } else if (psum < 100) {
        percent.push(100 - psum);
        notas.push(round(100 * (3.95 - sumprom(notas, percent)) / (100 - psum), 10));
        globalThis.notas = notas;
        globalThis.percent = percent;
        result.textContent =  `${round(sumprom(notas, percent), 100)} Necesitas un ${notas.at(-1)} al ${percent.at(-1)}% para aprobar`
        return;
    }
    result.textContent = round(sumprom(notas, percent), 100);
}

