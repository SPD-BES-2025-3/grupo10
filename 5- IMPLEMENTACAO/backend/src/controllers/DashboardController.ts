import { Request, Response, NextFunction } from 'express';
import DashboardRepository from '../repositories/DashboardRepository';

class DashboardController {
    async getStats(req: Request, res: Response, next: NextFunction) {
        try {
            const stats = await DashboardRepository.getDashboardStats();
            res.status(200).json(stats);
        } catch (error) {
            next(error);
        }
    }
}

export default new DashboardController();
