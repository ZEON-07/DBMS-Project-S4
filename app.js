// app.js
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const db = require("./db");

const app = express();
const PORT = 3005;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// =======================
// PRODUCTS API
// =======================
app.get("/api/products", (req, res) => {
  db.all("SELECT * FROM Product", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post("/api/products", (req, res) => {
  const { product_name, category, price } = req.body;
  db.run(
    "INSERT INTO Product (product_name, category, price) VALUES (?, ?, ?)",
    [product_name, category, price],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, product_id: this.lastID });
    },
  );
});

app.put("/api/products/:id", (req, res) => {
  const { product_name, category, price } = req.body;
  db.run(
    "UPDATE Product SET product_name = ?, category = ?, price = ? WHERE product_id = ?",
    [product_name, category, price, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, changes: this.changes });
    },
  );
});

app.delete("/api/products/:id", (req, res) => {
  db.run(
    "DELETE FROM Product WHERE product_id = ?",
    [req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, changes: this.changes });
    },
  );
});

// =======================
// SUPPLIERS API
// =======================
app.get("/api/suppliers", (req, res) => {
  db.all("SELECT * FROM Supplier", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post("/api/suppliers", (req, res) => {
  const { name, phone } = req.body;
  db.run(
    "INSERT INTO Supplier (name, phone) VALUES (?, ?)",
    [name, phone],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, supplier_id: this.lastID });
    },
  );
});

app.put("/api/suppliers/:id", (req, res) => {
  const { name, phone } = req.body;
  db.run(
    "UPDATE Supplier SET name = ?, phone = ? WHERE supplier_id = ?",
    [name, phone, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, changes: this.changes });
    },
  );
});

app.delete("/api/suppliers/:id", (req, res) => {
  db.run(
    "DELETE FROM Supplier WHERE supplier_id = ?",
    [req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, changes: this.changes });
    },
  );
});

// =======================
// PURCHASES API
// =======================
app.get("/api/purchases", (req, res) => {
  const historyQuery = `
        SELECT p.purchase_id, p.purchase_date, s.name as supplier_name, 
               pr.product_name, pi.quantity, pr.price, (pi.quantity * pr.price) as total_cost
        FROM Purchase p
        JOIN Supplier s ON p.supplier_id = s.supplier_id
        JOIN Purchase_Items pi ON p.purchase_id = pi.purchase_id
        JOIN Product pr ON pi.product_id = pr.product_id
        ORDER BY p.purchase_date DESC
    `;
  db.all(historyQuery, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post("/api/purchase", (req, res) => {
  const { supplier_id, product_id, quantity } = req.body;

  db.run("BEGIN TRANSACTION", (err) => {
    if (err) return res.status(500).json({ error: "Transaction Error setup" });

    db.run(
      "INSERT INTO Purchase (supplier_id) VALUES (?)",
      [supplier_id],
      function (err) {
        if (err) {
          db.run("ROLLBACK");
          return res.status(500).json({ error: err.message });
        }
        const purchase_id = this.lastID;
        db.run(
          "INSERT INTO Purchase_Items (purchase_id, product_id, quantity) VALUES (?, ?, ?)",
          [purchase_id, product_id, quantity],
          function (err) {
            if (err) {
              db.run("ROLLBACK");
              return res.status(500).json({ error: err.message });
            }
            db.run("COMMIT", (err) => {
              if (err) return res.status(500).json({ error: "Commit Error" });
              res.json({ success: true, purchase_id: purchase_id });
            });
          },
        );
      },
    );
  });
});

// =======================
// STOCK API
// =======================
app.get("/api/stock", (req, res) => {
  const query = `
        SELECT s.product_id, p.product_name, p.category, s.quantity_available
        FROM Stock s
        JOIN Product p ON s.product_id = p.product_id
        ORDER BY s.quantity_available ASC
    `;
  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app
  .listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  })
  .on("error", (err) => {
    console.error("Server error:", err.message);
  });
