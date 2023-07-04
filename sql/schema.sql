DROP EXTENSION IF EXISTS "uuid-ossp" CASCADE;
DROP SCHEMA public CASCADE;

CREATE SCHEMA public;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- functions
CREATE OR REPLACE FUNCTION update_column_timestamp() RETURNS trigger AS
$$
BEGIN
  new.updated_at = NOW();
  return new;
END
$$
language plpgsql;
-- end functions


-- tables
-- Table: users
CREATE TABLE IF NOT EXISTS users (
    id UUID NOT NULL DEFAULT uuid_generate_v4(),
    name VARCHAR(255)  NOT NULL,
    email VARCHAR(255)  NOT NULL,
    password VARCHAR(255)  NULL,
    status_alias VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP  NULL,
    deleted_at TIMESTAMP  NULL,
    CONSTRAINT users_pk PRIMARY KEY (id)
);

CREATE OR REPLACE TRIGGER tg_users BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_column_timestamp();
CREATE INDEX IF NOT EXISTS users_idx on users (status_alias DESC,created_at DESC,updated_at DESC,deleted_at DESC);
CREATE UNIQUE INDEX users_cols_unique on users (email DESC);


-- Table: roles
CREATE TABLE IF NOT EXISTS roles (
    id UUID NOT NULL DEFAULT uuid_generate_v4(),
    name VARCHAR(255)  NOT NULL,
    CONSTRAINT roles_pk PRIMARY KEY (id)
);

CREATE UNIQUE INDEX roles_cols_unique on roles (name DESC);

INSERT INTO roles (name) VALUES ('admin');


-- Table: user_roles
CREATE TABLE IF NOT EXISTS user_roles (
    id UUID NOT NULL DEFAULT uuid_generate_v4(),
    user_id UUID  NOT NULL,
    role_id UUID  NOT NULL,
    CONSTRAINT user_roles_pk PRIMARY KEY (id),
    FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE CASCADE,
    FOREIGN KEY (role_id)
        REFERENCES roles (id)
        ON DELETE CASCADE
);

CREATE UNIQUE INDEX user_roles_cols_unique on user_roles (user_id DESC, role_id DESC);

-- Table: companies
CREATE TABLE IF NOT EXISTS companies (
    id UUID NOT NULL DEFAULT uuid_generate_v4(),
    name VARCHAR(255)  NOT NULL,
    status_alias VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP  NULL,
    deleted_at TIMESTAMP  NULL,
    CONSTRAINT companies_pk PRIMARY KEY (id)
);

CREATE OR REPLACE TRIGGER tg_companies BEFORE UPDATE ON companies FOR EACH ROW EXECUTE PROCEDURE update_column_timestamp();
CREATE INDEX IF NOT EXISTS companies_idx on companies (status_alias DESC,created_at DESC,updated_at DESC,deleted_at DESC);
CREATE UNIQUE INDEX companies_cols_unique on companies (name DESC);


-- Table: user_companies
CREATE TABLE IF NOT EXISTS user_companies (
    id UUID NOT NULL DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    company_id UUID NOT NULL,
    CONSTRAINT user_companies_pk PRIMARY KEY (id),
    FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE CASCADE,
    FOREIGN KEY (company_id)
        REFERENCES companies (id)
        ON DELETE CASCADE
);

CREATE UNIQUE INDEX user_companies_cols_unique on user_companies (user_id DESC,company_id DESC);

-- Table: products
CREATE TABLE IF NOT EXISTS products (
    id UUID NOT NULL DEFAULT uuid_generate_v4(),
    user_company_id UUID NOT NULL,
    sku VARCHAR(255)  NOT NULL,
    name VARCHAR(500)  NOT NULL,
    slug VARCHAR(500)  NOT NULL,
    type VARCHAR(255)  NULL,
    description Text  NULL,
    weight real  NULL,
    width real  NULL,
    height real  NULL,
    length real  NULL,
    status_alias VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP  NULL,
    deleted_at TIMESTAMP  NULL,
    CONSTRAINT products_pk PRIMARY KEY (id),
    FOREIGN KEY (user_company_id)
        REFERENCES user_companies (id)
        ON DELETE CASCADE
);

CREATE OR REPLACE TRIGGER tg_products BEFORE UPDATE ON products FOR EACH ROW EXECUTE PROCEDURE update_column_timestamp();
CREATE INDEX IF NOT EXISTS products_idx on products (user_company_id DESC,sku DESC,name DESC,type DESC,status_alias DESC,created_at DESC,updated_at DESC,deleted_at DESC);
CREATE UNIQUE INDEX cols_unique on products (user_company_id DESC, sku DESC);
CREATE UNIQUE INDEX col_unique_key on products (slug DESC);

-- Table: product_images
CREATE TABLE IF NOT EXISTS product_images (
    product_id UUID NOT NULL,
    path_src VARCHAR(500) NOT NULL,
    PRIMARY KEY (product_id, path_src),
    FOREIGN KEY (product_id)
        REFERENCES products (id)
        ON DELETE CASCADE
);

-- Table: product_prices
CREATE TABLE IF NOT EXISTS product_prices (
    id UUID NOT NULL DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL,
    amount DECIMAL  NULL DEFAULT 0,
    rent_billing_mode VARCHAR(255) NOT NULL,
    CONSTRAINT product_prices_pk PRIMARY KEY (id),
    FOREIGN KEY (product_id)
        REFERENCES products (id)
        ON DELETE CASCADE
);

CREATE UNIQUE INDEX product_prices_cols_unique on product_prices (product_id DESC,rent_billing_mode DESC);

-- Table: product_extra_informations
CREATE TABLE IF NOT EXISTS product_extra_informations (
    id UUID NOT NULL DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL,
    key VARCHAR(255)  NOT NULL,
    value TEXT NOT NULL,
    CONSTRAINT product_extra_informations_pk PRIMARY KEY (id),
    FOREIGN KEY (product_id)
        REFERENCES products (id)
        ON DELETE CASCADE
);

CREATE UNIQUE INDEX product_extra_informations_cols_unique on product_extra_informations (product_id DESC,key DESC,value DESC);

-- Table: orders
CREATE TABLE IF NOT EXISTS orders (
    id UUID NOT NULL DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL,
    product_price_id UUID NOT NULL,
    product_raw JSONB NOT NULL,
    session_cart VARCHAR(255) NOT NULL,
    payment_mode VARCHAR(255)  NOT NULL,
    amount_paid DECIMAL NOT NULL,
    status_alias VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP  NULL,
    deleted_at TIMESTAMP  NULL,
    CONSTRAINT orders_pk PRIMARY KEY (id)
);

CREATE OR REPLACE TRIGGER tg_orders BEFORE UPDATE ON orders FOR EACH ROW EXECUTE PROCEDURE update_column_timestamp();
CREATE INDEX IF NOT EXISTS orders_idx on orders (product_id DESC,product_price_id DESC,payment_mode DESC,status_alias DESC,created_at DESC,updated_at DESC,deleted_at DESC);
CREATE UNIQUE INDEX orders_cols_unique on orders (session_cart DESC);