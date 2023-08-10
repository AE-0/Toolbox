// 1, 3, 2, 0, 1, 2, 0, 2, 4, 5, 0, 6, 5, 4, 1, 3, 5, 2, 4, 6, 1, 0
// 1, 1, 1, 2, 0, 1, 2, 0, 2, 4, 5, 0, 6, 5, 4, 1, 3, 5, 2, 4, 6
// 7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1
const page = document.getElementById("page-1");
const bloq = document.getElementById("bloques");
const plus = document.getElementById("plus");
const minus = document.getElementById("minus");
const clipboard = document.getElementById("clipboard");
const text = document.getElementById("parse");
const calc = document.getElementById("calc");
const content = document.querySelector("main");
const option = document.querySelector(".select-menu");
const settings = document.querySelector("#settings");

let npages = document.querySelectorAll(".input-number[id^='page']").length;

let algo = option.value;
option.onchange = () => algo = option.value;

fifo = (aux, arr, p) => {
    aux = aux.map(_ => _ = {value: _, t: 0, special: false});
    aux[0].special = true;
    arr.push(deepCopy(aux));
    globalThis.aux = aux;
    while (p.length > 1 ) {
        p.shift();
        aux.map(_ => _.special = false);
        aux.map(_ => _.t++);
        if (aux.has("value", p[0])) {
            let i = aux.findIndex(_ => _.has("value", p[0]));
            aux[i].value = p[0];
            arr.push(deepCopy(aux));
        }
        else if (aux.has("value", -1)) {
            let i = aux.findIndex(_ => _.has("value", -1));
            aux[i].value = p[0];
            aux[i].t = 0;
            aux[i].special = true;
            arr.push(deepCopy(aux));
        }
        else {
            let i = aux.findIndex(_ => _.has("t", aux.map(_ => _.t).max()));
            aux[i].value = p[0];
            aux[i].t = 0;
            aux[i].special = true;
            arr.push(deepCopy(aux));
        }
    }
    return arr;
}

lru = (aux, arr, p) => {
    aux = aux.map(_ => _ = {value: _, t: 0, special: false});
    aux[0].special = true;
    arr.push(deepCopy(aux));
    globalThis.aux = aux;
    while (p.length > 1 ) {
        p.shift();
        aux.map(_ => _.special = false);
        aux.map(_ => _.t++);
         if (aux.has("value", p[0])) {
            let i = aux.findIndex(_ => _.has("value", p[0]));
            aux[i].value = p[0];
            aux[i].t = 0;
            arr.push(deepCopy(aux));
        }
        else if (aux.has("value", -1)) {
            let i = aux.findIndex(_ => _.has("value", -1));
            aux[i].value = p[0];
            aux[i].t = 0;
            aux[i].special = true;
            arr.push(deepCopy(aux));
        } 
        else {
            let i = aux.findIndex(_ => _.has("t", aux.map(_ => _.t).max()));
            aux[i].value = p[0];
            aux[i].t = 0;
            aux[i].special = true;
            arr.push(deepCopy(aux));
        }
    }
    return arr;
}

optimo = (aux, arr, p) => {
    aux = aux.map(_ => _ = {value: _, t: 0, special: false});
    aux[0].special = true;
    arr.push(deepCopy(aux));
    globalThis.aux = aux;
    while (p.length > 1 ) {
        p.shift();
        aux.map(_ => _.special = false);
        aux.map(_ => _.t++);
        if (aux.has("value", p[0])) { 
            let i = aux.findIndex(_ => _.has("value", p[0]));
            aux[i].value = p[0];
            arr.push(deepCopy(aux));
        } 
        else if (aux.has("value", -1)) {            // aux.some(obj => obj.value == -1) 
            let i = aux.findIndex(_ => _.has("value", -1));
            aux[i].value = p[0];
            aux[i].t = 0;
            aux[i].special = true;
            arr.push(deepCopy(aux));
        }
        else {
            let max = aux.map(_ => _.value).map(_a => p.findIndex(_ => _ == _a));
            if (max.includes(-1)) {
                var i = max.findIndex(_ => _ == -1);
                //var i = aux.findIndex(_ => _.has("t", aux.map(_ => _.t).max()));
            }
            else {
                max = max.max();
                var i = aux.findIndex(_ => _.has("value", p[max]))
            }
            aux[i].value = p[0];
            aux[i].t = 0;
            aux[i].special = true;
            arr.push(deepCopy(aux));
        }
    }
    return arr;
}

create_table = (arr, el) => {
    let n = 1;
    let table = document.createElement("div");
    table.classList.add("table");
    if (Array.isArray(arr[0])) n = arr[0].length;
    for (let i = 0; i < n; i++) { // needs to be refactored
        let table_row = document.createElement("div");
        table_row.classList.add(`table-row-${i}`);
        for (let j = 0; j < arr.length; j++) {
            let table_item = document.createElement("div");
            table_item.classList.add(`table-item-${j}`);
            if (typeof arr[0] == "number") {
                table_item.textContent = arr[j];
                table.classList.add("table-header")
            }
            else if (typeof arr[0][0] === "object") {
                if (arr[j][i].value >= 0) {
                    table_item.textContent = arr[j][i].value;
                    if (arr[j][i].special) table_item.classList.add("special");
                } 
            } 
            else {
                if (arr[j][i] >= 0) table_item.textContent = arr[j][i];
            }
            table_row.appendChild(table_item);
        }
        table.appendChild(table_row);
    }
    el.append(table);
}



plus.onclick = () => {
    let el = page.cloneNode(true);
    el.id = `page-${++npages}`;
    el.value = NaN;
    page.parentElement.append(el);
};

minus.onclick = () => {
    if (npages == 1) return;
    document.getElementById(`page-${npages--}`).remove();
}

calc.onclick = () => {
    let co = document.createElement("div");
    co.classList.add("container-alt");
    content.append(co);

    let fr = document.createElement("div");
    fr.classList.add("flex-row");
    co.append(fr);

    let al = document.createElement("span");
    al.classList.add("text-caps")
    al.textContent = algo;
    fr.appendChild(al);

    if (page.hasAttribute("hidden")) {
        pages = parse(text.value)
        
    } else {
        var pages = Array.from(document.querySelectorAll(".input-number[id^='page']"));
        pages = pages.map((_) => isNaN(_.valueAsNumber) ? 0 : _.valueAsNumber);
    }
    create_table(pages, co);
    globalThis.pages = pages;
    let matrix = [pages[0]];
    let nbloq = bloq.valueAsNumber;

    for (let i = 1; i < nbloq; i++) matrix.push(-1);
    let aux = JSON.parse(JSON.stringify(matrix));
    matrix = [];
    
    switch (algo) {
        case "fifo":
            matrix = fifo(aux, matrix, pages);
            break;
            
        case "lru":
            matrix = lru(aux, matrix, pages);
            break;
    
        case "optimo":
            matrix = optimo(aux, matrix, pages);
            break;
    }

    globalThis.matrix = matrix;
    create_table(matrix, co);
    let fallos = matrix.filter(_ => _.has("special", true)).length
    let el = document.createElement("p");
    el.textContent = `Fallos de paginas: ${fallos}`;
    co.appendChild(el);
    let el2 = document.createElement("p");
    el2.textContent = `Total: ${fallos + (fallos - nbloq)}`;
    co.appendChild(el2);
    let index = matrix.filter(_ => !_.has("special", true)).map(_ => matrix.indexOf(_));
};

text.oninput = () => text.style.width = `${text.value.length * 1.35}vh`;

clipboard.onclick = () => {
    plus.toggleAttribute("hidden");
    minus.toggleAttribute("hidden");
    text.toggleAttribute("hidden");
    document.querySelectorAll(".input-number[id^='page']").forEach(_ => _.toggleAttribute("hidden"));
    if (text.hasAttribute("hidden")) clipboard.style.backgroundImage = "url(./assets/icons/clipboard-line.png)";
    else clipboard.style.backgroundImage = "url(./assets/icons/input-cursor-move.png)";
}

settings.onclick = () => {
    i = 4;
    document.querySelectorAll(`.table-item-${i}`).forEach(_ => _.style.visibility = "hidden");
    document.querySelector(`.table-header > div[class^='table-row'] > .table-item-${i}`).style.visibility = "visible"
}
