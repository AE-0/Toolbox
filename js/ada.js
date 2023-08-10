const code_cont = document.querySelector(".code-container");
const cursor = document.querySelector(".cursor");
const cursor_layer = document.querySelector(".cursor-layer");
const container = document.querySelector("#main-content");

code_cont.addEventListener("click", (e) => {
    let keyword = Array.from(document.querySelectorAll(".line > span > span"));
    cords = keyword.map(_ => Object({"x": _.offsetLeft, "y": _.offsetTop}))
    let diffs = cords.map( (_) => { return Math.abs(_.x - e.clientX) + Math.abs(_.y - e.clientY) });
    let i = diffs.indexOf(diffs.min());   
    cursor_layer.style.left = `${keyword[i].offsetLeft + keyword[i].offsetWidth}px`;
    cursor_layer.style.top = `${keyword[i].offsetTop}px`;
    globalThis.cords = cords;
});

code_cont.addEventListener("focus", () => { cursor.removeAttribute("hidden")});
code_cont.addEventListener("blur", () => { cursor.setAttribute("hidden", "")});

code_cont.addEventListener("keydown", (e) => {
    let keyword = Array.from(document.querySelectorAll(".line > span > span"));
    let current = keyword.filter(_ => _.offsetLeft + _.offsetWidth == cursor_layer.offsetLeft && _.offsetTop ==  cursor_layer.offsetTop).pop();
    let i = keyword.findIndex(_ => _ == current);
    
    if (e.key === "Backspace") {
        current.textContent = current.textContent.cut(-1);
    }
    else if (e.key === "Tab") {
        e.preventDefault();
        current.textContent += "uwu"
    }
    else if (e.key === "ArrowRight") {
        current = keyword.at(++i);
        //current.style.outlineStyle = "dashed";
    }
    else if (e.key === "ArrowLeft") {
        current = keyword.at(--i);
    }
    else {
        current.textContent += e.key;
    }
    cursor_layer.style.left = `${current.offsetLeft + current.offsetWidth}px`;
    cursor_layer.style.top = `${current.offsetTop}px`;
    globalThis.keyword = keyword;
    globalThis.current = current;
});