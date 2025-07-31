import express from 'express';
import DashboardController from '../../controllers/DashboardController';


export const dashboardRoute = express.Router();

dashboardRoute.get("/dashboard", (req, res, next) => DashboardController.getStats(req, res, next));
