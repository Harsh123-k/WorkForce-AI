import { Router } from 'express';
import * as auth from '../controllers/AuthController';
import * as hr from '../controllers/HRController';
import * as ops from '../controllers/OperationsController';
import { protect, authorizeRoles } from '../middleware/auth';
import { handleAiQuery } from '../services/ai';

const router = Router();

// =========================================================================
// 1. Auth Routing
// =========================================================================
router.post('/auth/register', auth.register);
router.post('/auth/login', auth.login);
router.post('/auth/refresh', auth.refreshToken);
router.post('/auth/logout', auth.logout);

// =========================================================================
// 2. HR & Employee Directory Routing
// =========================================================================
router.get('/hr/employees', protect, hr.getEmployees);
router.post('/hr/employees', protect, authorizeRoles('Super Admin', 'HR Manager'), hr.createEmployee);
router.put('/hr/employees/:id', protect, authorizeRoles('Super Admin', 'HR Manager'), hr.updateEmployee);
router.delete('/hr/employees/:id', protect, authorizeRoles('Super Admin'), hr.deleteEmployee);

router.get('/hr/departments', protect, hr.getDepartments);
router.post('/hr/departments', protect, authorizeRoles('Super Admin', 'HR Manager'), hr.createDepartment);

router.get('/hr/candidates', protect, hr.getCandidates);
router.post('/hr/candidates', protect, authorizeRoles('Super Admin', 'HR Manager'), hr.createCandidate);

// =========================================================================
// 3. Operational Routing (Attendance, Leaves, Payroll, Projects, IT Assets)
// =========================================================================
router.get('/ops/attendance', protect, ops.getAttendance);
router.post('/ops/clockin', protect, ops.clockIn);
router.put('/ops/clockout/:id', protect, ops.clockOut);

router.get('/ops/leaves', protect, ops.getLeaves);
router.post('/ops/leaves', protect, ops.applyLeave);
router.put('/ops/leaves/:id/review', protect, authorizeRoles('Super Admin', 'HR Manager', 'Manager'), ops.reviewLeave);

router.get('/ops/payroll', protect, ops.getPayroll);
router.post('/ops/payroll/run', protect, authorizeRoles('Super Admin', 'Finance'), ops.runPayroll);

router.get('/ops/projects', protect, ops.getProjects);
router.post('/ops/projects', protect, authorizeRoles('Super Admin', 'Manager', 'Team Lead'), ops.createProject);

router.get('/ops/tasks', protect, ops.getTasks);
router.post('/ops/tasks', protect, authorizeRoles('Super Admin', 'Manager', 'Team Lead'), ops.createTask);
router.put('/ops/tasks/:id/complete', protect, ops.completeTask);

router.get('/ops/assets', protect, ops.getAssets);
router.post('/ops/assets', protect, authorizeRoles('Super Admin', 'IT Administrator'), ops.createAsset);
router.put('/ops/assets/:id/assign', protect, authorizeRoles('Super Admin', 'IT Administrator'), ops.assignAsset);
router.put('/ops/assets/:id/unassign', protect, authorizeRoles('Super Admin', 'IT Administrator'), ops.unassignAsset);

router.get('/ops/tickets', protect, ops.getTickets);
router.post('/ops/tickets', protect, ops.createTicket);
router.put('/ops/tickets/:id/resolve', protect, authorizeRoles('Super Admin', 'IT Administrator'), ops.resolveTicket);

router.get('/ops/documents', protect, ops.getDocuments);
router.post('/ops/documents', protect, ops.uploadDocument);

// =========================================================================
// 4. AI Operations Routing
// =========================================================================
router.post('/ai/query', protect, async (req: any, res: any, next: any) => {
    try {
        const { query } = req.body;
        const response = await handleAiQuery(req.user.id, query);
        res.status(200).json({ status: 'success', data: response });
    } catch (error) {
        next(error);
    }
});

export default router;
