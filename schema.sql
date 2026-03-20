-- schema.sql
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS Product (
    product_id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_name TEXT NOT NULL,
    category TEXT NOT NULL,
    price REAL NOT NULL CHECK(price >= 0)
);

CREATE TABLE IF NOT EXISTS Supplier (
    supplier_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS Purchase (
    purchase_id INTEGER PRIMARY KEY AUTOINCREMENT,
    supplier_id INTEGER NOT NULL,
    purchase_date TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_id) REFERENCES Supplier(supplier_id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS Purchase_Items (
    purchase_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL CHECK(quantity > 0),
    PRIMARY KEY (purchase_id, product_id),
    FOREIGN KEY (purchase_id) REFERENCES Purchase(purchase_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES Product(product_id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS Stock (
    product_id INTEGER PRIMARY KEY,
    quantity_available INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (product_id) REFERENCES Product(product_id) ON DELETE CASCADE
);

-- Triggers for Stock Management

CREATE TRIGGER IF NOT EXISTS after_product_insert
AFTER INSERT ON Product
BEGIN
    INSERT INTO Stock (product_id, quantity_available) VALUES (NEW.product_id, 0);
END;

CREATE TRIGGER IF NOT EXISTS after_purchase_item_insert
AFTER INSERT ON Purchase_Items
BEGIN
    UPDATE Stock 
    SET quantity_available = quantity_available + NEW.quantity 
    WHERE product_id = NEW.product_id;
END;

CREATE TRIGGER IF NOT EXISTS after_purchase_item_delete
AFTER DELETE ON Purchase_Items
BEGIN
    UPDATE Stock
    SET quantity_available = quantity_available - OLD.quantity
    WHERE product_id = OLD.product_id;
END;

CREATE TRIGGER IF NOT EXISTS prevent_negative_stock_update
BEFORE UPDATE ON Stock
WHEN NEW.quantity_available < 0
BEGIN
    SELECT RAISE(FAIL, 'Stock cannot be negative');
END;

CREATE TRIGGER IF NOT EXISTS prevent_negative_stock_insert
BEFORE INSERT ON Stock
WHEN NEW.quantity_available < 0
BEGIN
    SELECT RAISE(FAIL, 'Stock cannot be negative');
END;

-- Default Optional Sample Data (Inserts only if empty to prevent duplication on restart)
INSERT INTO Product (product_name, category, price) 
SELECT 'Mechanical Keyboard', 'Electronics', 150.00
WHERE NOT EXISTS(SELECT 1 FROM Product WHERE product_name = 'Mechanical Keyboard');

INSERT INTO Product (product_name, category, price) 
SELECT 'Ergonomic Mouse', 'Electronics', 60.00
WHERE NOT EXISTS(SELECT 1 FROM Product WHERE product_name = 'Ergonomic Mouse');

INSERT INTO Supplier (name, phone) 
SELECT 'Electro Supplier Hub', '555-9000'
WHERE NOT EXISTS(SELECT 1 FROM Supplier WHERE name = 'Electro Supplier Hub');
