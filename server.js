const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ DB CONNECTION
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "chandu",
  database: "foodapp"
});

db.connect(err => {
  if (err) console.error("DB Error:", err);
  else console.log("✅ MySQL Connected");
});


// ================= FOOD =================

// ✅ GET FOOD (FILTER BY HOTEL)
app.get("/food", (req, res) => {
  const { hotel } = req.query;

  let query = "SELECT * FROM fooditems";
  let values = [];

  if (hotel) {
    query += " WHERE hotel = ?";
    values.push(hotel);
  }

  db.query(query, values, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// ✅ ADD FOOD
app.post("/food", (req, res) => {
  const { name, price, image, category, hotel } = req.body;

  db.query(
    "INSERT INTO fooditems (name, price, image, category, hotel) VALUES (?, ?, ?, ?, ?)",
    [name, price, image, category, hotel],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Food Added ✅" });
    }
  );
});

// ✅ DELETE FOOD
app.delete("/food/:id", (req, res) => {
  db.query("DELETE FROM fooditems WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Deleted 🗑️" });
  });
});


// ================= LOGIN =================

app.post("/user/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email=? AND password=?",
    [email, password],
    (err, result) => {
      if (err) return res.status(500).json(err);

      if (result.length > 0) {
        res.json({ user: result[0] });
      } else {
        res.status(401).json({ message: "Invalid Login ❌" });
      }
    }
  );
});


// ================= ORDER =================

// ✅ PLACE ORDER (IMPORTANT)
app.post("/order", (req, res) => {
  console.log("ORDER DATA:", req.body); // 🔍 DEBUG

  const { total, item_name, hotel } = req.body;

  db.query(
    "INSERT INTO orders(total, item_name, hotel, status) VALUES (?, ?, ?, 'pending')",
    [total, item_name, hotel],
    (err) => {
      if (err) {
        console.error("Order Error:", err);
        return res.status(500).json(err);
      }
      res.json({ message: "Order Placed 🎉" });
    }
  );
});

// ✅ GET ORDERS (ADMIN)
app.get("/orders", (req, res) => {
  db.query("SELECT * FROM orders ORDER BY id DESC", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// ✅ COMPLETE ORDER
app.put("/order/:id", (req, res) => {
  db.query(
    "UPDATE orders SET status='completed' WHERE id=?",
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Order Completed ✅" });
    }
  );
});


// ================= FEEDBACK =================

app.post("/feedback", (req, res) => {
  const { name, message } = req.body;

  db.query(
    "INSERT INTO feedback(name, message) VALUES(?, ?)",
    [name, message],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Feedback Saved 👍" });
    }
  );
});


// ================= SERVER =================

app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});