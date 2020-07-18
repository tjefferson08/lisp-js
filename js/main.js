import { repl } from "./repl.js";

console.log("INIT");

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form[name=repl]");
  const prompt = document.querySelector("[name=prompt]");
  const clearBtn = document.querySelector(".clear-btn");
  const scrollback = document.querySelector(".scrollback");

  clearBtn.addEventListener("click", () => {
    scrollback.innerHTML = "";
  });

  form.addEventListener("submit", event => {
    event.preventDefault();
    const result = repl(prompt.value);
    prompt.value = "";
    const toPrint = document.createElement("div");
    toPrint.innerText = result;
    scrollback.appendChild(toPrint);
  });
});
