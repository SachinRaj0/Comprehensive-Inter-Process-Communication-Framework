// Grab DOM
const ipcSelect = document.getElementById("ipcSelect");
const startBtn = document.getElementById("startBtn");
const sendA = document.getElementById("sendA");
const sendB = document.getElementById("sendB");
const inputA = document.getElementById("inputA");
const inputB = document.getElementById("inputB");
const logA = document.getElementById("logA");
const logB = document.getElementById("logB");
const traceLog = document.getElementById("traceLog");

let currentIPC = "sharedMemory";

// State simulation
let messageStore = {
    sharedMemory: "",
    messageQueue: [],
    socket: []
};

startBtn.addEventListener("click", () => {
    currentIPC = ipcSelect.value;
    resetSimulation();
    logTrace(`Simulation started with IPC: ${currentIPC}`);
});

// Send from Process A
sendA.addEventListener("click", () => {
    const message = inputA.value.trim();
    if (!message) return;
    simulateSend("A", message);
    inputA.value = "";
});

// Send from Process B
sendB.addEventListener("click", () => {
    const message = inputB.value.trim();
    if (!message) return;
    simulateSend("B", message);
    inputB.value = "";
});

// Simulations
function simulateSend(sender, msg) {
    const receiver = sender === "A" ? "B" : "A";
    logTrace(`[${sender} -> ${receiver}] (${currentIPC}) : ${msg}`);

    switch(currentIPC) {
        case "sharedMemory":
            messageStore.sharedMemory = msg;
            simulateReceive(receiver, messageStore.sharedMemory);
            break;

        case "messageQueue":
            messageStore.messageQueue.push({from: sender, to: receiver, text: msg});
            processQueue();
            break;

        case "socket":
            messageStore.socket.push({from: sender, to: receiver, text: msg});
            processSocket();
            break;
    }
}

function simulateReceive(process, msg) {
    const logEl = process === "A" ? logA : logB;
    logEl.innerHTML += `<div>Received: ${msg}</div>`;
    logTrace(`Delivered to ${process}: ${msg}`);
}

function processQueue() {
    while (messageStore.messageQueue.length > 0) {
        const pkt = messageStore.messageQueue.shift();
        simulateReceive(pkt.to, pkt.text);
    }
}

function processSocket() {
    while (messageStore.socket.length > 0) {
        const pkt = messageStore.socket.shift();
        simulateReceive(pkt.to, pkt.text);
    }
}

function logTrace(text) {
    const time = new Date().toLocaleTimeString();
    traceLog.innerHTML += `<div>[${time}] ${text}</div>`;
    traceLog.scrollTop = traceLog.scrollHeight;
}

function resetSimulation() {
    logA.innerHTML = "";
    logB.innerHTML = "";
    traceLog.innerHTML = "";
    messageStore = { sharedMemory: "", messageQueue: [], socket: [] };
}
