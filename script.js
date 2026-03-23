const display = document.getElementById("display");
const historyDiv = document.getElementById("history");

function append(val) {
    display.value += val;
}

function clearDisplay() {
    display.value = "";
    historyDiv.textContent = "";
}

function deleteLast() {
    display.value = display.value.slice(0, -1);
}

const precedence = {
    "+": 1,
    "-": 1,
    "*": 2,
    "/": 2
};

function isOperator(c) {
    return ["+", "-", "*", "/"].includes(c);
}

function toPostfix(expr) {
    let output = [];
    let stack = [];
    let tokens = expr.match(/\d+(\.\d+)?|[+\-*/()]/g);

    if (!tokens) throw "Invalid";

    for (let token of tokens) {
        if (!isNaN(token)) {
            output.push(token);
        } else if (isOperator(token)) {
            while (
                stack.length &&
                isOperator(stack[stack.length - 1]) &&
                precedence[stack[stack.length - 1]] >= precedence[token]
            ) {
                output.push(stack.pop());
            }
            stack.push(token);
        } else if (token === "(") {
            stack.push(token);
        } else if (token === ")") {
            while (stack.length && stack[stack.length - 1] !== "(") {
                output.push(stack.pop());
            }
            if (stack.length === 0) throw "Mismatched parentheses";
            stack.pop();
        }
    }

    while (stack.length) {
        if (stack[stack.length - 1] === "(") throw "Mismatched parentheses";
        output.push(stack.pop());
    }

    return output;
}

function evaluatePostfix(postfix) {
    let stack = [];

    for (let token of postfix) {
        if (!isNaN(token)) {
            stack.push(parseFloat(token));
        } else {
            let b = stack.pop();
            let a = stack.pop();

            if (a === undefined || b === undefined) throw "Invalid";

            if (token === "/" && b === 0) throw "Divide by zero";

            switch (token) {
                case "+": stack.push(a + b); break;
                case "-": stack.push(a - b); break;
                case "*": stack.push(a * b); break;
                case "/": stack.push(a / b); break;
            }
        }
    }

    return stack[0];
}

function calculate() {
    try {
        const expr = display.value;
        if (!expr) return;

        const postfix = toPostfix(expr);
        const result = evaluatePostfix(postfix);

        historyDiv.textContent = `${expr} =`;
        display.value = result;

    } catch {
        display.value = "Error";
    }
}

// Keyboard support
document.addEventListener("keydown", (e) => {
    if (!isNaN(e.key) || "+-*/().".includes(e.key)) {
        append(e.key);
    } else if (e.key === "Enter") {
        calculate();
    } else if (e.key === "Backspace") {
        deleteLast();
    } else if (e.key === "Escape") {
        clearDisplay();
    }
});