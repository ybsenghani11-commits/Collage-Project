
const display = document.getElementById('password-display');
const resultBox = document.querySelector('.result-box');
const lengthEl = document.getElementById('length');
const lowerEl = document.getElementById('lowercase');
const upperEl = document.getElementById('uppercase');
const numbersEl = document.getElementById('numbers');
const symbolsEl = document.getElementById('symbols');
const generateBtn = document.getElementById('generate-btn');

const charSets = {
    lower: "abcdefghijklmnopqrstuvwxyz",
    upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    number: "0123456789",
    symbol: "!@#$%^&*()_+~`|}{[]:;?><,./-="
};

function generatePassword() {
    let length = parseInt(lengthEl.value);
    let charPool = "";
    
    // Build pool based on checkboxes
    if (lowerEl.checked) charPool += charSets.lower;
    if (upperEl.checked) charPool += charSets.upper;
    if (numbersEl.checked) charPool += charSets.number;
    if (symbolsEl.checked) charPool += charSets.symbol;

    // Validation: Check if pool is empty
    if (charPool === "") {
        display.innerText = "Select an option!";
        display.style.color = "red";
        return;
    }

    let generatedPassword = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charPool.length);
        generatedPassword += charPool[randomIndex];
    }

    // Update UI
    display.innerText = generatedPassword;
    display.style.color = "#3b054e";
    resultBox.style.borderStyle = "solid";
    resultBox.style.borderColor = "#ddd";
}

generateBtn.addEventListener('click', generatePassword);
