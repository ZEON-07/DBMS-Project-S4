# Inventory & Supplier Management System

A robust, full-stack DBMS Mini Project built with **Node.js, Express, and SQLite**. The system is designed to emphasize core database concepts like **Third Normal Form (3NF) Normalization** and **Database Triggers**, pulling the critical business logic out of the backend code and strictly enforcing it directly inside the database.

## 🚀 Features
- **Normalized SQLite Database (3NF)**: Uniquely mapped standard tables to prevent data redundancy and anomalies.
- **Database-Level Triggers (Automated Logic)**:
  - New Products automatically trigger the initialization of a `0` balance `Stock` row.
  - Recording a new `Purchase` automatically updates the exact imported quantity directly into the `Stock` table natively.
  - Strict constraints (`BEFORE UPDATE`, `CHECK`) prevent stock from ever falling below zero dynamically, blocking bad API requests.
- **RESTful API Backend**: A clean Express server (`app.js`) handling generic JSON requests.
- **Ultra-Premium Vanilla Frontend**: Built entirely with plain HTML, advanced CSS Variables (supporting adaptive Glassmorphism, Dynamic Dark/Light mode), and the native JavaScript Fetch API. No templating engines are required.

## 📂 Project Structure
```text
/DBMS-Project-S4
├── app.js               # Main Express Node.js Server & REST API endpoints
├── db.js                # SQLite Database connection and initialization script
├── schema.sql           # The core DBMS schema! Contains all table structures & TRIGGERS
├── package.json         # Node.js dependencies
└── /public              # Static Frontend Interface
    ├── style.css        # Premium UI/UX stylesheet (Dark/Light mode auto-adaptation)
    ├── index.html       # Analytics Dashboard aggregating all DB metrics
    ├── product.html     # Product CRUD Interface
    ├── supplier.html    # Supplier CRUD Interface
    ├── purchase.html    # Record Purchases (Relational JOINs & inserts)
    └── stock.html       # Real-time Stock Layout display
```

## 🛠️ Installation & Setup
1. Ensure you have [Node.js](https://nodejs.org/) installed.
2. Clone or download this project folder.
3. Open your terminal in the directory (`c:\Code-Arena\DBMS-Project-S4`).
4. Install the backend dependencies constraints:
   ```bash
   npm install
   ```

## 💻 Running the Application
1. Start the Express server:
   ```bash
   node app.js
   ```
2. On initial startup, `db.js` will automatically read `schema.sql` and safely generate your `database.db` instance, including all relational tables and trigger functions.
3. Open your web browser and navigate to:
   **[http://localhost:3005](http://localhost:3005)**

## 🛡️ Database Schema Overview
- **Product** `(product_id PK, product_name, category, price)`
- **Supplier** `(supplier_id PK, name, phone)`
- **Purchase** `(purchase_id PK, supplier_id FK, purchase_date)`
- **Purchase_Items** `(purchase_id FK, product_id FK, quantity)` -> *Composite Primary Key*
- **Stock** `(product_id PK/FK, quantity_available)`

*Developed as a structured DBMS S4 Mini Project focusing heavily on Relational Database mapping.*
