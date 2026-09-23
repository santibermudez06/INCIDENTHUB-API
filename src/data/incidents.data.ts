import { Incident } from '../models/incident.model';

export const incidents: Incident[] = [
  {
    id: 1,
    title: 'Proyector sin señal',
    description: 'El proyector no reconoce ningún computador conectado.',
    reporter: 'Carlos Díaz',
    location: 'Aula 201',
    priority: 'MEDIUM',
    status: 'OPEN',
    estimatedMinutes: 30,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Equipo sin acceso a Internet',
    description: 'El computador del laboratorio perdió completamente la conexión.',
    reporter: 'Laura Gómez',
    location: 'Laboratorio 304',
    priority: 'HIGH',
    status: 'OPEN',
    estimatedMinutes: 45,
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    title: 'Impresora bloqueada',
    description: 'La impresora del área contable se encuentra atascada y no imprime.',
    reporter: 'Andrés Pérez',
    location: 'Oficina 102',
    priority: 'LOW',
    status: 'IN_PROGRESS',
    estimatedMinutes: 20,
    createdAt: new Date().toISOString()
  },
  {
    id: 4,
    title: 'Servidor web caído',
    description: 'Falla masiva en el servidor interno de aplicaciones.',
    reporter: 'María Rodríguez',
    location: 'Data Center',
    priority: 'CRITICAL',
    status: 'OPEN',
    estimatedMinutes: 50,
    createdAt: new Date().toISOString()
  },
  {
    id: 5,
    title: 'Falla en software de nómina',
    description: 'La aplicación muestra un error al procesar reportes de horas extra.',
    reporter: 'Jorge Martínez',
    location: 'Oficina 205',
    priority: 'HIGH',
    status: 'RESOLVED',
    estimatedMinutes: 60,
    createdAt: new Date().toISOString()
  }
];