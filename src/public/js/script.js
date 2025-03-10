const menuBtn = document.getElementById("menuBtn");
const navList = document.querySelector(".nav_list");
const minusButton = document.querySelector("#minusBtn");
const plusButton = document.querySelector("#plusBtn");
const itemAmount = document.querySelector(".quantity_form input");
const button = document.createElement("button");

menuBtn.addEventListener("click", () => {
  navList.classList.toggle("active");
  menuBtn.classList.toggle("active");
});

minusButton.addEventListener("click", () => {
  itemValue = parseInt(itemAmount.value);
  itemAmount.textContent = itemValue - 1;
  itemAmount.value = itemValue - 1;
});

plusButton.addEventListener("click", () => {
  itemValue = parseInt(itemAmount.value);
  itemAmount.textContent = itemValue + 1;
  itemAmount.value = itemValue + 1;
});

const tBody = document.querySelector('.tBody')

tBody.querySelectorAll('tr').forEach(tr => {
  const tdatas = tr.querySelectorAll('td')
  const price = Number(tdatas[1].textContent)
  tdatas[2].querySelectorAll('form button').forEach(button => {
    button.addEventListener("click", () => {
      let itemCount = tdatas[2].querySelector('input').value
      tdatas[3].textContent = parseInt(itemCount) * price
    })
  })
})