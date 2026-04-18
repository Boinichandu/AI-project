// LOAD FOODS
function loadFoods() {
  fetch("http://localhost:5000/food")
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById("foodList");
      list.innerHTML = "";

      data.forEach(item => {
        list.innerHTML += `
          <div class="food-item">
            <img src="${item.image}" width="50">
            ${item.name} ₹${item.price} 
            <b>[${item.hotel}]</b>
            <button onclick="deleteFood(${item.id})">Delete</button>
          </div>
        `;
      });
    });
}

// 🔔 LOAD ORDERS (SHOW ITEM + HOTEL)
function loadOrders() {
  fetch("http://localhost:5000/orders")
    .then(res => res.json())
    .then(data => {
      const box = document.getElementById("ordersBox");
      box.innerHTML = "";

      data.forEach(order => {
        if (order.status === "pending") {
          box.innerHTML += `
            <div style="background:#fff3cd;padding:10px;margin:10px;border-radius:10px;">
              🛎 <b>${order.item_name}</b><br>
              🏨 ${order.hotel}<br>
              💰 ₹${order.total}<br>
              <button onclick="completeOrder(${order.id})">Done</button>
            </div>
          `;
        }
      });
    });
}

// COMPLETE ORDER
function completeOrder(id) {
  fetch(`http://localhost:5000/order/${id}`, {
    method: "PUT"
  }).then(loadOrders);
}

// ADD FOOD
function addFood() {
  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;
  const image = document.getElementById("image").value;
  const category = document.getElementById("category").value;
  const hotel = document.getElementById("hotel").value;

  fetch("http://localhost:5000/food", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ name, price, image, category, hotel })
  }).then(loadFoods);
}

// DELETE FOOD
function deleteFood(id) {
  fetch(`http://localhost:5000/food/${id}`, {
    method: "DELETE"
  }).then(loadFoods);
}

// AUTO REFRESH
setInterval(loadOrders, 3000);

// LOAD
window.onload = function () {
  loadFoods();
  loadOrders();
};