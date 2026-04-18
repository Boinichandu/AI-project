let cart = [];
let allItems = [];

// ================= LOAD PAGE =================
window.onload = function () {

  const hotel = localStorage.getItem("hotel");

  if (hotel) {
    document.getElementById("hotelName").innerText =
      "🍽️ Welcome to " + hotel;
  }

  fetch(`http://localhost:5000/food?hotel=${hotel}`)
    .then(res => res.json())
    .then(data => {
      allItems = data;
      displayMenu(data);
    })
    .catch(err => console.error("Error:", err));
};


// ================= DISPLAY MENU =================
function displayMenu(items) {
  const menu = document.getElementById("menu");
  menu.innerHTML = "";

  items.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";

    let imageUrl = item.image || "https://picsum.photos/200";

    card.innerHTML = `
      <img src="${imageUrl}" onerror="this.src='https://picsum.photos/200'">
      <h4>${item.name}</h4>
      <p>${item.category || "Other"}</p>
      <p>₹${item.price}</p>

      <button class="add-btn">Add</button>
      <button class="order-btn">Order</button>
    `;

    card.querySelector(".add-btn").onclick = () => addToCart(item);
    card.querySelector(".order-btn").onclick = () => orderNow(item);

    menu.appendChild(card);
  });
}


// ================= FILTER CATEGORY =================
function showCategory(cat) {

  if (cat === "all") {
    displayMenu(allItems);
    return;
  }

  const filtered = allItems.filter(item =>
    item.category &&
    item.category.toLowerCase().includes(cat.toLowerCase())
  );

  displayMenu(filtered);
}


// ================= CART =================
function addToCart(item) {
  cart.push(item);
  updateCart();
}

function updateCart() {
  const cartDiv = document.getElementById("cart");
  const totalDiv = document.getElementById("total");

  cartDiv.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    total += item.price;

    cartDiv.innerHTML += `
      <p>${item.name} - ₹${item.price}</p>
    `;
  });

  totalDiv.innerText = "Total: ₹" + total;
}


// ================= ORDER =================
function orderNow(item) {

  const hotel = localStorage.getItem("hotel");

  fetch("http://localhost:5000/order", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({
      total: item.price,
      item_name: item.name,
      hotel: hotel
    })
  })
  .then(res => res.json())
  .then(() => {
    alert("Order placed successfully 🎉");
  })
  .catch(() => alert("Order failed ❌"));
}


// ================= FEEDBACK =================
function submitFeedback() {

  const name = document.getElementById("fbName").value;
  const message = document.getElementById("fbMessage").value;

  if (!name || !message) {
    alert("Please fill all fields");
    return;
  }

  fetch("http://localhost:5000/feedback", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ name, message })
  })
  .then(() => {
    alert("Thank you for your feedback 😊");

    document.getElementById("fbName").value = "";
    document.getElementById("fbMessage").value = "";
  })
  .catch(() => alert("Error submitting feedback"));
}