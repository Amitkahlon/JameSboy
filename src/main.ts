import { Emu } from "./emu";


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

    const file = romInput.files[0];
    console.log("Selected file:", file.name);

    // קריאה כ־ArrayBuffer (חשוב כי זה בינארי, לא טקסט)
    const arrayBuffer = await file.arrayBuffer()

    const context = new Emu()

    await context.insertCart(file)
    await context.emu_run()

  });

  // const romName = `dmg-acid2`


})()




