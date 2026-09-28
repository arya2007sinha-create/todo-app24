const AnalyticsService = require('../services/analyticsService');

const getOverview = async (req, res, next) => {
    try {
        const overview = await AnalyticsService.getOverview(req.user.id);
        res.status(200).json({ success: true, data: overview });
    } catch (error) {
        next(error);
    }
};

const getCompletionStats = async (req, res, next) => {
    try {
        const stats = await AnalyticsService.getCompletionStats(req.user.id);
        res.status(200).json({ success: true, data: stats });
    } catch (error) {
        next(error);
    }
};

const getProductivity = async (req, res, next) => {
    try {
        const productivity = await AnalyticsService.getProductivity(req.user.id);
        res.status(200).json({ success: true, data: productivity });
    } catch (error) {
        next(error);
    }
};

module.exports = { getOverview, getCompletionStats, getProductivity };
