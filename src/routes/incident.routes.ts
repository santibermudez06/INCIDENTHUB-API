import { Router } from 'express';
import { IncidentController } from '../controllers/incident.controller';
import { validateId } from '../middlewares/validate-id.middleware';
import { validateIncident } from '../middlewares/validate-incident.middleware';
import { validatePriority } from '../middlewares/validate-priority.middleware';
import { validateTime } from '../middlewares/validate-time.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';
import { adminMiddleware } from '../middlewares/admin.middleware';

const router = Router();
const controller = new IncidentController();

// Endpoints de métricas y filtros
router.get('/critical', controller.getCritical);
router.get('/pending', controller.getPending);
router.get('/stats', controller.getStats);

// Endpoints CRUD
router.get('/', controller.getAll);
router.get('/:id', validateId, controller.getById);

router.post(
  '/',
  validateIncident,
  validatePriority,
  validateTime,
  controller.create
);

router.put(
  '/:id',
  validateId,
  validatePriority,
  validateTime,
  controller.update
);

router.patch(
  '/:id/status',
  validateId,
  controller.updateStatus
);

router.delete(
  '/:id',
  validateId,
  authMiddleware,
  adminMiddleware,
  controller.delete
);

export default router;