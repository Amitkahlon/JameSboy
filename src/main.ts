import { Console } from "console";
import { u8 } from "./common";
import { Emu } from "./emu";
import { Regs } from "./entities/regs";

let context: Emu;
let debugMode = true
let gameFile: File

const debugBtn = document.getElementById("btn-debug") as HTMLButtonElement;
const stepBtn = document.getElementById("step") as HTMLButtonElement
const resetBtn = document.getElementById("reset") as HTMLButtonElement

resetBtn.addEventListener("click", () => {
  context.terminated = true

  drawUI(new Regs())
  initGame()

  console.clear()
  console.log("~Gameboy reseted~")
})

debugBtn.addEventListener("click", () => {
  debugMode = !debugMode;

  debugBtn.setAttribute('aria-pressed', String(debugMode));
  debugBtn.textContent = debugMode ? 'Debug: ON' : 'Debug: OFF';

  if (!debugMode) {
    stepBtn.disabled = true
  } else {
    stepBtn.disabled = false
  }
})

async function stepClick() {
  await context.emu_run_step()
}

stepBtn.addEventListener("click", stepClick)

// format helpers
const hx8 = v => '0x' + (v & 0xFF).toString(16).toUpperCase().padStart(2, '0');
const hx16 = v => '0x' + (v & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');

// Set a single register cell by id (expects hex string already or number)
function setReg(id, val, is16 = false) {
  const el = document.getElementById(id);
  if (!el) return;

  debugger
  const newText = typeof val === 'number' ? (is16 ? hx16(val) : hx8(val)) : val;
  const oldText = el.textContent;

  // if register changed
  if (newText !== oldText) {
    el.style.color = "red"
  } else {
    el.style.color = null
  }

  el.textContent = newText;
}


// Toggle one flag badge
function setFlag(id, on) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.toggle('on', on);
  el.classList.toggle('off', !on);
}

const drawUI = (regs: Regs) => {
  setReg('reg-a', regs.a)
  setReg('reg-f', regs.f)
  setReg('reg-b', regs.b)
  setReg('reg-c', regs.c)
  setReg('reg-d', regs.d)
  setReg('reg-e', regs.e)
  setReg('reg-h', regs.h)
  setReg('reg-l', regs.l)
  setReg('reg-pc', regs.pc, true)
  setReg('reg-sp', regs.sp, true)
  setFlag('flag-z', regs.Z)
  setFlag('flag-n', regs.N)
  setFlag('flag-h', regs.H)
  setFlag('flag-c', regs.C)
}

const initGame = async () => {
  context = new Emu(drawUI)

  await context.insertCart(gameFile)
  if (!debugMode) {
    await context.emu_run()
  }
}

(async () => {
  const canvas = document.getElementById("screen") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d")!;
  const imageData = ctx.createImageData(canvas.width, canvas.height);
  const romInput = document.getElementById("romInput") as HTMLInputElement;

  function clearScreen() {
    for (let i = 0; i < imageData.data.length; i += 4) {
      imageData.data[i] = 255;     // R
      imageData.data[i + 1] = 255; // G
      imageData.data[i + 2] = 255; // B
      imageData.data[i + 3] = 255; // A
    }
    ctx.putImageData(imageData, 0, 0);
  }

  clearScreen();

  romInput.addEventListener("change", async (event) => {
    if (!romInput.files || romInput.files.length === 0) return;

    gameFile = romInput.files[0];

    console.log("Selected file:", gameFile.name);

    await initGame()
  });


})()






