const box = document.getElementById("box");
const btn = document.getElementById("btn");
const api = "https://catfact.ninja/fact";

async function callbox() {
        const response = await fetch(api);
        const data = await response.json();
        
        box.innerHTML = data.fact;
}

btn.addEventListener("click", callbox);