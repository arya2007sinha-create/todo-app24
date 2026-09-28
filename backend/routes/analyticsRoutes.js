const express = require('express');
const router = express.Router();
const { getOverview, getCompletionStats, getProductivity } = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/overview', getOverview);
router.get('/completion', getCompletionStats);
router.get('/productivity', getProductivity);

module.exports = router;
