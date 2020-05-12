import { ChatServer } from './ChatServer';
import { DbContext } from './db/DbContext';

let db = new DbContext();
db.seed_db();
db.get_users();

let app = new ChatServer().app;
export { app };