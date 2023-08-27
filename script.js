const colorPickerBtn = document.querySelector("#color-picker");
const clearAll = document.querySelector(".clear-all");
const colorList = document.querySelector(".all-colors");
const pickedColors = JSON.parse(localStorage.getItem("picked-colors") || "[]");

// Copying The Color Code To The Clipboard And Updating The Element Text.
const copyColor = (elem) => {
    elem.innerText = "Copied";
    navigator.clipboard.writeText(elem.dataset.color);
    setTimeout(() => elem.innerText = elem.dataset.color, 1000);
}

const showColor = () => {
    if (!pickedColors.length) return; // Returning If There Are No Picked Colors.
    colorList.innerHTML = pickedColors.map(color => `
        <li class ="color">
            <span class ="rect" style="background: ${color}; border: 1px solid ${color == "#ffffff" ? "#ccc" : color}"></span>
            <span class ="value hex" data-color="${color}">${color}</span>
        </li>
        `).join(""); //  // Generating li for the picked color and adding it to the colorList.
    document.querySelector(".picked-colors").classList.remove("hide");

    // Add a Click Event Listener To Each Color Element To Copy The Color Code.
    document.querySelectorAll(".color").forEach(li => {
        li.addEventListener("click", e => copyColor(e.currentTarget.lastElementChild));
    });
}
showColor();

const activateEyeDropper = () => {
    document.body.style.display = "none";
    setTimeout(async () => {
        try {
            // Opening The Eye Dropper And Getting The Selected Color.
            const eyeDropper = new EyeDropper();
            const { sRGBHex } = await eyeDropper.open();
            navigator.clipboard.writeText(sRGBHex);

            // Adding The Color To The List if It Does Not Already Exist.
            if (!pickedColors.includes(sRGBHex)) {
                pickedColors.push(sRGBHex);
                localStorage.setItem("picked-colors", JSON.stringify(pickedColors));
                showColor();
            }
        } catch (error) {
            alert("Failed To Copy The Color Code!");
        }
        document.body.style.display = "block";
    }, 10);
}

// Clearing All Picked Colors , Updating Local Storage, And Hiding The colorList Elements.
const clearAllColors = () => {
    pickedColors.length = 0;
    localStorage.setItem("picked-colors", JSON.stringify(pickedColors));
    document.querySelector(".picked-colors").classList.add("hide");
}

clearAll.addEventListener("click", clearAllColors);
colorPickerBtn.addEventListener("click", activateEyeDropper);