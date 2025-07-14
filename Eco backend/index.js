// index.js
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
const PORT = 3000;

const sequelize = require('./lib/models/index');
require('./lib/models/associations');

app.use(express.json());

const overstockItemRoutes = require('./lib/routes/overstockItem');
const seasonalTrendRoutes = require('./lib/routes/seasonalTrend');
const trendingBuzzwordRoutes = require('./lib/routes/trendingBuzzword');
const ecoScoreRoutes = require('./lib/routes/ecoScore');

app.use('/api/overstock', overstockItemRoutes);
app.use('/api/seasonal', seasonalTrendRoutes);
app.use('/api/trending', trendingBuzzwordRoutes);
app.use('/api/eco-scores', ecoScoreRoutes);

app.get('/', (req, res) => {
  res.send('Hello from Node.js backend!');
});

// Sync Sequelize models and start server
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Connected to MySQL and models synced');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MySQL connection error:', err);
    process.exit(1);
  });
