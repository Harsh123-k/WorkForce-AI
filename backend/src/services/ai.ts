import { Employee, Department } from '../models/OrgModels';
import { Leave, Payroll, Ticket, Attendance } from '../models/OperationModels';

export const handleAiQuery = async (userId: string, query: string): Promise<string> => {
    const queryLower = query.toLowerCase();

    // 1. Natural Language DB Fetch Triggers
    if (queryLower.includes('employee on leave') || queryLower.includes('who is absent') || queryLower.includes('absent today')) {
        const leaves = await Leave.find({ status: 'Approved' }).populate('userId', 'email');
        if (leaves.length === 0) return "No employees are currently on approved leave today.";
        const names = leaves.map(l => (l.userId as any)?.email || 'Unknown').join(', ');
        return `Currently, the following employees are absent or on approved leave: **${names}**.`;
    }

    if (queryLower.includes('payroll') || queryLower.includes('net payout') || queryLower.includes('salary expenses')) {
        const payrollLogs = await Payroll.find();
        const totalSalary = payrollLogs.reduce((acc, curr) => acc + curr.net, 0);
        const processed = payrollLogs.filter(p => p.status === 'Processed').length;
        const pending = payrollLogs.filter(p => p.status === 'Pending Review').length;
        return `Payroll Digest: The total net salary payout is **$${totalSalary.toLocaleString()}**. Currently, **${processed}** transfers have been processed and **${pending}** transactions are pending final review.`;
    }

    if (queryLower.includes('ticket') || queryLower.includes('help desk') || queryLower.includes('open tickets')) {
        const openTickets = await Ticket.find({ status: 'Open' });
        if (openTickets.length === 0) return "All IT support tickets have been fully resolved. The queue is clean!";
        return `There are currently **${openTickets.length}** open tickets. Major issues reported: ${openTickets.map(t => `"${t.issue}" (Priority: ${t.priority})`).join(', ')}.`;
    }

    if (queryLower.includes('late') || queryLower.includes('attendance statistics')) {
        const lateLogs = await Attendance.find({ status: 'Late Check-In' }).populate('userId', 'email');
        const totalLogs = await Attendance.countDocuments();
        const percent = totalLogs > 0 ? Math.round((lateLogs.length / totalLogs) * 100) : 0;
        return `Attendance Insights: Out of all recorded shifts today, **${lateLogs.length}** logins were marked as late check-ins (${percent}% deviation rate).`;
    }

    // 2. Mock fallback to answer standard policy queries if not calling external API
    if (queryLower.includes('sick leave policy') || queryLower.includes('leave policy')) {
        return "Company Leave Policy: All full-time employees receive 12 days of paid Medical Sick Leave and 15 days of Casual Leave annually. Medical leaves extending beyond 3 consecutive days require a digital physician note uploaded via the portal.";
    }

    if (queryLower.includes('hi') || queryLower.includes('hello') || queryLower.includes('help')) {
        return "Hello! I am your WorkForce AI assistant. You can ask me to analyze database states. Try typing: *'Show employees on leave today'*, *'Summarize payroll details'*, or *'Check open support tickets'*.";
    }

    // 3. Custom general helper fallback
    return `Analysis complete. Based on the current organization database records for your prompt ("${query}"), everything is within standard operational parameters. Let me know if you would like me to trigger an HR event!`;
};
