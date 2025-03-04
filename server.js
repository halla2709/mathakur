const app = require('./server/app.js');
require("./server/services/databaseCreator.js").initDatabase();
app.listen(Number(process.env.PORT || 3000));
