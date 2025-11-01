
# Server (Express + MySQL)

## Setup
1. Install dependencies:
   ```
   cd server
   npm install
   ```
2. Create database & table:
   - Option A: Run the SQL script with MySQL client:
     ```
     mysql -u root -p < init_db.sql
     ```
   - Option B: Manually create `weatherdb` and `searches` table (see init_db.sql).

3. Copy `.env.example` to `.env` and fill values:
   ```
   cp .env.example .env
   ```

4. Start the server:
   ```
   npm run dev
   ```
   or
   ```
   npm start
   ```

The server listens on `http://localhost:5000` by default.
