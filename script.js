document.addEventListener("DOMContentLoaded", function () {
  const popup = document.getElementById("popupCont");
  const popupField = document.getElementById("popup");
  const add = document.getElementById("add");
  const select = document.querySelector("select");
  const submit = document.getElementById("submit");
  const inputs = document.getElementById("inputs");
  const inputSide = document.getElementById("inputSide");
  const l = document.getElementById("l");

  let draggedElem = null;

  popup.addEventListener("click", (e) => {
    popup.style.visibility = "hidden";
  });

  popupField.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  add.addEventListener("click", () => {
    popup.style.visibility = "visible";
  });

  function dragStartHandler(e, elem) {
    draggedElem = elem;
  }

  function dropHandler(e, elem) {
    e.preventDefault();
    e.target.style.backgroundColor = "white";
    let order = elem.getAttribute("order");
    elem.setAttribute("order", draggedElem.getAttribute("order"));
    draggedElem.setAttribute("order", order);
    draw([...inputs.children]);
  }

  function dragOverHandler(e) {
    e.preventDefault();
    e.target.style.backgroundColor = "lightgray";
  }

  function dragEndHandler(e) {
    e.target.style.backgroundColor = "white";
  }

  function draw(arr) {
    inputs.innerHTML = "";
    let sorted = arr.sort(
      (a, b) => a.getAttribute("order") - b.getAttribute("order")
    );
    sorted.forEach((elem, index) => {
      elem.setAttribute("order", index);
      inputs.appendChild(elem);
    });
    drawInputs(sorted);
  }

  function drawInputs(arr) {
    const divMap = new Map();
    inputSide.querySelectorAll("div").forEach((div) => {
      const inputType = div.querySelector("input").type;
      divMap.set(inputType, div);
    });
    arr.forEach((elem, index) => {
      const inputType = elem.textContent.slice(0, -1);
      const div = divMap.get(inputType);
      if (div) {
        div.style.order = index;
      }
    });
  }

  function createElem(text) {
    const div = document.createElement("div");
    div.classList.add("elem");
    div.innerText = text;
    div.draggable = true;
    div.setAttribute("order", inputs.childElementCount);
    div.addEventListener("dragstart", (e) => dragStartHandler(e, div));
    div.addEventListener("drop", (e) => dropHandler(e, div));
    div.addEventListener("dragover", (e) => dragOverHandler(e));
    div.addEventListener("dragend", (e) => dragEndHandler(e));
    const span = document.createElement("span");
    span.innerText = "X";
    span.addEventListener("click", () => {
      let deletedOrder = div.getAttribute("order");
      div.remove();
      let childToRemove = [...inputSide.children].find(
        (child) => child.style.order === deletedOrder
      );
      if (childToRemove) {
        inputSide.removeChild(childToRemove);
      }
    });
    div.appendChild(span);
    inputs.appendChild(div);
  }

  function createInput(type) {
    const input = document.createElement("input");
    const div = document.createElement("div");
    const label = document.createElement("label");
    label.textContent = l.value;
    div.appendChild(label);
    input.type = type;
    div.appendChild(input);
    inputSide.appendChild(div);
  }

  submit.addEventListener("click", () => {
    popup.style.visibility = "hidden";
    createElem(select.value);
    createInput(select.value);
  });
});
