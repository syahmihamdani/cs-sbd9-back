CREATE TABLE IF NOT EXISTS items(   
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),   
    name VARCHAR(255) NOT NULL,   price INT NOT NULL,   
    store_id UUID NOT NULL,   
    image_url VARCHAR(255),   
    stock INT DEFAULT 0,   
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,   
    FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE ); 

    CREATE type transaction_status AS ENUM ('pending', 'paid'); CREATE TABLE IF NOT EXISTS transactions( id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), user_id UUID NOT NULL, item_id UUID NOT NULL, quantity INT NOT NULL, total INT NOT NULL, status transaction_status DEFAULT 'pending', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE, FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE ); 