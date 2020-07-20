import { repl } from "./repl.js";

console.log("INIT");

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form[name=repl]");
  const prompt = document.querySelector("[name=prompt]");
  const clearBtn = document.querySelector(".clear-btn");
  const scrollback = document.querySelector(".scrollback");
  const scriptFileInput = document.querySelector("[name=script_file]");

  clearBtn.addEventListener("click", () => {
    scrollback.innerHTML = "";
  });

  scriptFileInput.addEventListener("change", () => {
    // store the file content off in a global so the runtime can grab it
    // (runtime is not async-aware, otherwise we could probably do this on-demand)
    scriptFileInput.files[0].text().then(text => {
      window.scriptFileContent = text;
    });
  });

  form.addEventListener("submit", event => {
    event.preventDefault();
    const result = repl(prompt.value);
    const userInput = document.createElement("div");
    userInput.innerText = `> ${prompt.value}`;
    prompt.value = "";
    const toPrint = document.createElement("div");
    toPrint.innerText = result;
    scrollback.appendChild(userInput);
    scrollback.appendChild(toPrint);
  });
});
