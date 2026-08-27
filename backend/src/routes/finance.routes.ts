import { Router, Request, Response } from 'express';
import { verifyToken, requireRole } from '../middleware/auth';
import { Invoice } from '../models/Invoice';
import { Expense } from '../models/Expense';
import mongoose from 'mongoose';

const router = Router();

// Mock seed invoices & expenses if database is empty
const defaultInvoices = [
  {
    invoiceNumber: 'INV-2026-001',
    clientName: 'EduTech J&K Digital Services',
    clientEmail: 'billing@edutechjk.in',
    clientAddress: 'Lal Chowk, Srinagar, J&K',
    issueDate: '2026-08-15',
    dueDate: '2026-09-15',
    currency: 'INR',
    items: [
      { description: 'School Management Cloud Hosting & Maintenance (Term 1)', quantity: 1, unitPrice: 45000, taxRate: 18, amount: 45000 },
      { description: 'Computer Lab Digital Curriculum Licenses', quantity: 12, unitPrice: 1500, taxRate: 18, amount: 18000 },
    ],
    subtotal: 63000,
    taxAmount: 11340,
    discountAmount: 0,
    totalAmount: 74340,
    status: 'paid',
    paymentMethod: 'Stripe / Card',
    paidAt: new Date('2026-08-20'),
    notes: 'Paid via Stripe Checkout. Transaction ID: ch_3P7aBCDeF123',
  },
  {
    invoiceNumber: 'INV-2026-002',
    clientName: 'Kashmir Valley Uniform & Sports Supplies',
    clientEmail: 'accounts@kashmirvalleysports.com',
    clientAddress: 'Mattan Market, Anantnag, J&K',
    issueDate: '2026-08-22',
    dueDate: '2026-09-05',
    currency: 'INR',
    items: [
      { description: 'Annual Athletic Meet Sponsorship & Banner Display', quantity: 1, unitPrice: 25000, taxRate: 0, amount: 25000 },
    ],
    subtotal: 25000,
    taxAmount: 0,
    discountAmount: 2000,
    totalAmount: 23000,
    status: 'sent',
    notes: 'Awaiting bank transfer confirmation.',
  },
  {
    invoiceNumber: 'INV-2026-003',
    clientName: 'Himalayan Book Distributors',
    clientEmail: 'orders@himalayanbooks.co.in',
    clientAddress: 'KP Road, Anantnag, J&K',
    issueDate: '2026-08-01',
    dueDate: '2026-08-20',
    currency: 'INR',
    items: [
      { description: 'Library NCERT Reference Textbook Consignment', quantity: 1, unitPrice: 18500, taxRate: 5, amount: 18500 },
    ],
    subtotal: 18500,
    taxAmount: 925,
    discountAmount: 0,
    totalAmount: 19425,
    status: 'overdue',
    notes: 'Reminder notice dispatched.',
  },
];

const defaultExpenses = [
  {
    title: 'High-Speed Fiber Internet & Networking Subscription',
    category: 'Technology',
    amount: 3200,
    currency: 'INR',
    expenseDate: '2026-08-05',
    vendor: 'J&K BSNL Broadband',
    paymentMethod: 'Bank Transfer',
    taxDeductible: true,
    notes: 'Monthly school internet line.',
  },
  {
    title: 'Classroom Stationery, Register Books & Whiteboard Markers',
    category: 'Supplies',
    amount: 4850,
    currency: 'INR',
    expenseDate: '2026-08-12',
    vendor: 'Awanpora Local Book Depot',
    paymentMethod: 'Cash',
    taxDeductible: true,
    notes: 'Term 1 supplies distribution.',
  },
  {
    title: 'School Drinking Water RO Plant Filter Replacement',
    category: 'Maintenance',
    amount: 6500,
    currency: 'INR',
    expenseDate: '2026-08-18',
    vendor: 'PureFlow Aqua Solutions',
    paymentMethod: 'UPI',
    taxDeductible: true,
    notes: 'Annual filter & membrane renewal.',
  },
  {
    title: 'Electricity & Solar Inverter Maintenance Bill',
    category: 'Utilities',
    amount: 5400,
    currency: 'INR',
    expenseDate: '2026-08-25',
    vendor: 'KPDCL Electric Division Mattan',
    paymentMethod: 'Bank Transfer',
    taxDeductible: true,
  },
];

// GET /api/v1/finance/summary
router.get('/summary', verifyToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const orgId = req.user?.organizationId ? new mongoose.Types.ObjectId(req.user.organizationId) : null;
    let invoices = orgId ? await Invoice.find({ organizationId: orgId }) : [];
    let expenses = orgId ? await Expense.find({ organizationId: orgId }) : [];

    if (invoices.length === 0) invoices = defaultInvoices as any;
    if (expenses.length === 0) expenses = defaultExpenses as any;

    const totalRevenue = invoices.filter((i) => i.status === 'paid').reduce((acc, i) => acc + (i.totalAmount || 0), 0);
    const pendingReceivables = invoices.filter((i) => i.status === 'sent' || i.status === 'overdue').reduce((acc, i) => acc + (i.totalAmount || 0), 0);
    const totalExpenses = expenses.reduce((acc, e) => acc + (e.amount || 0), 0);
    const netProfit = totalRevenue - totalExpenses;
    const profitMargin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : '0.0';

    res.json({
      success: true,
      metrics: {
        totalRevenue,
        pendingReceivables,
        totalExpenses,
        netProfit,
        profitMargin,
        currency: '₹',
        invoicesCount: invoices.length,
        expensesCount: expenses.length,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to compute financial summary.' });
  }
});

// GET /api/v1/finance/invoices
router.get('/invoices', verifyToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const orgId = req.user?.organizationId ? new mongoose.Types.ObjectId(req.user.organizationId) : null;
    let invoices = orgId ? await Invoice.find({ organizationId: orgId }).sort({ createdAt: -1 }) : [];
    if (invoices.length === 0) invoices = defaultInvoices as any;

    res.json({ success: true, invoices });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch invoices.' });
  }
});

// POST /api/v1/finance/invoices
router.post('/invoices', verifyToken, requireRole(['admin', 'teacher']), async (req: Request, res: Response): Promise<void> => {
  try {
    const { clientName, clientEmail, clientAddress, issueDate, dueDate, items, notes, discountAmount = 0 } = req.body;

    if (!clientName || !clientEmail || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ success: false, message: 'Client details and at least one item are required.' });
      return;
    }

    const subtotal = items.reduce((acc: number, item: any) => acc + (Number(item.quantity) * Number(item.unitPrice) || 0), 0);
    const taxAmount = items.reduce((acc: number, item: any) => {
      const lineTotal = Number(item.quantity) * Number(item.unitPrice) || 0;
      return acc + (lineTotal * (Number(item.taxRate || 0) / 100));
    }, 0);
    const totalAmount = Math.max(0, subtotal + taxAmount - Number(discountAmount));

    const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newInvoice = new Invoice({
      organizationId: req.user?.organizationId,
      invoiceNumber,
      clientName,
      clientEmail,
      clientAddress,
      issueDate: issueDate || new Date().toISOString().split('T')[0],
      dueDate: dueDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      currency: 'INR',
      items: items.map((it: any) => ({
        description: it.description,
        quantity: Number(it.quantity) || 1,
        unitPrice: Number(it.unitPrice) || 0,
        taxRate: Number(it.taxRate) || 0,
        amount: (Number(it.quantity) || 1) * (Number(it.unitPrice) || 0),
      })),
      subtotal,
      taxAmount,
      discountAmount: Number(discountAmount),
      totalAmount,
      status: 'sent',
      notes,
    });

    await newInvoice.save();
    res.json({ success: true, message: `Invoice ${invoiceNumber} created successfully.`, invoice: newInvoice });
  } catch (error) {
    console.error('Invoice creation error:', error);
    res.status(500).json({ success: false, message: 'Failed to create invoice.' });
  }
});

// POST /api/v1/finance/checkout (Stripe Payment Integration)
router.post('/checkout', verifyToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { invoiceId, invoiceNumber, amount } = req.body;

    // Simulate Stripe Checkout Session generation
    const sessionId = `cs_test_${Math.random().toString(36).substring(2, 15)}`;
    const checkoutUrl = `https://checkout.stripe.com/c/pay/${sessionId}`;

    res.json({
      success: true,
      sessionId,
      checkoutUrl,
      message: `Stripe Checkout Session initialized for ${invoiceNumber || 'Invoice'}. Amount: ₹${amount}`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Stripe checkout initialization failed.' });
  }
});

// POST /api/v1/finance/webhook (Stripe Webhook & Auto-Reconciliation)
router.post('/webhook', async (req: Request, res: Response): Promise<void> => {
  try {
    const event = req.body;
    // Auto-reconciliation simulation
    res.json({ received: true, status: 'reconciled' });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Webhook processing failed.' });
  }
});

// GET /api/v1/finance/expenses
router.get('/expenses', verifyToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const orgId = req.user?.organizationId ? new mongoose.Types.ObjectId(req.user.organizationId) : null;
    let expenses = orgId ? await Expense.find({ organizationId: orgId }).sort({ expenseDate: -1 }) : [];
    if (expenses.length === 0) expenses = defaultExpenses as any;

    res.json({ success: true, expenses });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch expenses.' });
  }
});

// POST /api/v1/finance/expenses
router.post('/expenses', verifyToken, requireRole(['admin', 'teacher']), async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, category, amount, expenseDate, vendor, paymentMethod, notes, taxDeductible = true } = req.body;

    if (!title || !amount || !vendor) {
      res.status(400).json({ success: false, message: 'Title, amount, and vendor are required.' });
      return;
    }

    const newExpense = new Expense({
      organizationId: req.user?.organizationId,
      title,
      category: category || 'Supplies',
      amount: Number(amount),
      currency: 'INR',
      expenseDate: expenseDate || new Date().toISOString().split('T')[0],
      vendor,
      paymentMethod: paymentMethod || 'Bank Transfer',
      taxDeductible,
      notes,
      recordedBy: req.user?.userId,
    });

    await newExpense.save();
    res.json({ success: true, message: 'Expense record saved successfully.', expense: newExpense });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to save expense record.' });
  }
});

// GET /api/v1/finance/bank-accounts
router.get('/bank-accounts', verifyToken, async (req: Request, res: Response): Promise<void> => {
  res.json({
    success: true,
    accounts: [
      {
        id: 'acc_01',
        bankName: 'J&K Bank Ltd.',
        accountNumber: '•••• •••• •••• 4091',
        accountType: 'Institutional Current Account',
        balance: 384500.0,
        currency: 'INR',
        status: 'Active & Verified',
        lastSynced: 'Just now',
      },
      {
        id: 'acc_02',
        bankName: 'State Bank of India',
        accountNumber: '•••• •••• •••• 8820',
        accountType: 'PM-POSHAN Scheme Treasury Account',
        balance: 142200.0,
        currency: 'INR',
        status: 'Active & Verified',
        lastSynced: '10 mins ago',
      },
    ],
  });
});

export default router;
