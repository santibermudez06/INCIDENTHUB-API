import { Request, Response, NextFunction } from 'express';
import { incidents } from '../data/incidents.data';
import { Incident } from '../models/incident.model';
import { CreateIncidentDto } from '../dtos/incident.dto';
import { AppError } from '../errors/app-error';

export class IncidentController {
  
  // 7.1 Consultar todos los incidentes
  getAll = (req: Request, res: Response, next: NextFunction): void => {
    try {
      res.status(200).json({
        ok: true,
        total: incidents.length,
        data: incidents
      });
    } catch (error) {
      next(error);
    }
  };

  // 7.2 Consultar incidente por ID
  getById = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const id = Number(req.params.id);
      const incident = incidents.find(i => i.id === id);

      if (!incident) {
        throw new AppError(404, 'Incident not found');
      }

      res.status(200).json({
        ok: true,
        data: incident
      });
    } catch (error) {
      next(error);
    }
  };

  // 7.3 Registrar un incidente
  create = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const dto: CreateIncidentDto = req.body;

      const newIncident: Incident = {
        id: incidents.length > 0 ? Math.max(...incidents.map(i => i.id)) + 1 : 1,
        title: dto.title,
        description: dto.description,
        reporter: dto.reporter,
        location: dto.location,
        priority: dto.priority,
        status: 'OPEN',
        estimatedMinutes: dto.estimatedMinutes,
        createdAt: new Date().toISOString()
      };

      incidents.push(newIncident);

      res.status(201).json({
        ok: true,
        data: newIncident
      });
    } catch (error) {
      next(error);
    }
  };

  // 7.4 Actualizar un incidente
  update = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const id = Number(req.params.id);
      const index = incidents.findIndex(i => i.id === id);

      if (index === -1) {
        throw new AppError(404, 'Incident not found');
      }

      const currentIncident = incidents[index];
      const { title, description, location, priority, estimatedMinutes } = req.body;

      incidents[index] = {
        ...currentIncident,
        title: title ?? currentIncident.title,
        description: description ?? currentIncident.description,
        location: location ?? currentIncident.location,
        priority: priority ?? currentIncident.priority,
        estimatedMinutes: estimatedMinutes ?? currentIncident.estimatedMinutes
      };

      res.status(200).json({
        ok: true,
        data: incidents[index]
      });
    } catch (error) {
      next(error);
    }
  };

  // 7.5 Cambiar estado del incidente (con regla del Reto 5)
  updateStatus = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const id = Number(req.params.id);
      const { status } = req.body;
      const incident = incidents.find(i => i.id === id);

      if (!incident) {
        throw new AppError(404, 'Incident not found');
      }

      // Reto 5: Transiciones no permitidas desde RESOLVED
      if (incident.status === 'RESOLVED' && (status === 'OPEN' || status === 'IN_PROGRESS')) {
        throw new AppError(400, 'Cannot transition from RESOLVED to OPEN or IN_PROGRESS');
      }

      incident.status = status;

      res.status(200).json({
        ok: true,
        data: incident
      });
    } catch (error) {
      next(error);
    }
  };

  // 7.6 Eliminar incidente
  delete = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const id = Number(req.params.id);
      const index = incidents.findIndex(i => i.id === id);

      if (index === -1) {
        throw new AppError(404, 'Incident not found');
      }

      incidents.splice(index, 1);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  // Reto 1: Bandeja de incidentes críticos
  getCritical = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const criticalIncidents = incidents.filter(i => i.priority === 'CRITICAL');
      res.status(200).json({
        ok: true,
        total: criticalIncidents.length,
        data: criticalIncidents
      });
    } catch (error) {
      next(error);
    }
  };

  // Reto 2: Incidentes pendientes
  getPending = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const pendingIncidents = incidents.filter(i => i.status === 'OPEN' || i.status === 'IN_PROGRESS');
      res.status(200).json({
        ok: true,
        total: pendingIncidents.length,
        data: pendingIncidents
      });
    } catch (error) {
      next(error);
    }
  };

  // Reto 3: Resumen operacional (Estadísticas)
  getStats = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const total = incidents.length;
      const open = incidents.filter(i => i.status === 'OPEN').length;
      const inProgress = incidents.filter(i => i.status === 'IN_PROGRESS').length;
      const resolved = incidents.filter(i => i.status === 'RESOLVED').length;
      const critical = incidents.filter(i => i.priority === 'CRITICAL').length;
      
      const sumMinutes = incidents.reduce((acc, curr) => acc + curr.estimatedMinutes, 0);
      const averageEstimatedMinutes = total > 0 ? Math.round(sumMinutes / total) : 0;

      res.status(200).json({
        ok: true,
        data: {
          total,
          open,
          inProgress,
          resolved,
          critical,
          averageEstimatedMinutes
        }
      });
    } catch (error) {
      next(error);
    }
  };
}