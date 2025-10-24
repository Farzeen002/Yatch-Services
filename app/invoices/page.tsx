"use client";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/navigation";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Search, 
  FileText, 
  DollarSign, 
  TrendingUp, 
  Download, 
  Plus,
  Eye,
  Edit,
  Trash2,
  Filter,
  Calendar,
  Mail,
  User,
  CreditCard,
  AlertCircle
} from "lucide-react";

type InvoiceStatus = "draft" | "pending" | "paid" | "overdue" | "cancelled";

interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  taxAmount: number;
  totalAmount: number;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  bookingId?: string;
  notes?: string;
}

interface Transaction {
  id: string;
  transactionNumber: string;
  invoiceId: string;
  amount: number;
  type: "payment" | "refund" | "adjustment";
  paymentMethod: string;
  status: "pending" | "completed" | "failed" | "cancelled";
  transactionDate: string;
  referenceNumber?: string;
}

const Invoices = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Mock data
  const invoices: Invoice[] = [
    {
      id: "1",
      invoiceNumber: "INV-2024-001",
      customerName: "John Anderson",
      customerEmail: "john@example.com",
      amount: 5000,
      taxAmount: 750,
      totalAmount: 5750,
      status: "paid",
      issueDate: "2024-01-15",
      dueDate: "2024-02-15",
      paidDate: "2024-01-20",
      bookingId: "BK-001",
      notes: "Full day yacht rental - Marina Bay"
    },
    {
      id: "2",
      invoiceNumber: "INV-2024-002",
      customerName: "Sarah Williams",
      customerEmail: "sarah@example.com",
      amount: 8500,
      taxAmount: 1275,
      totalAmount: 9775,
      status: "pending",
      issueDate: "2024-02-01",
      dueDate: "2024-03-01",
      bookingId: "BK-002",
      notes: "Weekend package with catering"
    },
    {
      id: "3",
      invoiceNumber: "INV-2024-003",
      customerName: "Michael Chen",
      customerEmail: "michael@example.com",
      amount: 12000,
      taxAmount: 1800,
      totalAmount: 13800,
      status: "overdue",
      issueDate: "2024-01-10",
      dueDate: "2024-02-10",
      bookingId: "BK-003",
      notes: "Corporate event - 2 days"
    },
    {
      id: "4",
      invoiceNumber: "INV-2024-004",
      customerName: "Emily Rodriguez",
      customerEmail: "emily@example.com",
      amount: 6500,
      taxAmount: 975,
      totalAmount: 7475,
      status: "draft",
      issueDate: "2024-02-20",
      dueDate: "2024-03-20",
      bookingId: "BK-004"
    }
  ];

  const transactions: Transaction[] = [
    {
      id: "1",
      transactionNumber: "TXN-2024-001",
      invoiceId: "1",
      amount: 5750,
      type: "payment",
      paymentMethod: "card",
      status: "completed",
      transactionDate: "2024-01-20",
      referenceNumber: "REF-12345"
    },
    {
      id: "2",
      transactionNumber: "TXN-2024-002",
      invoiceId: "2",
      amount: 4000,
      type: "payment",
      paymentMethod: "bank_transfer",
      status: "completed",
      transactionDate: "2024-02-05",
      referenceNumber: "REF-12346"
    }
  ];

  const filteredAndSortedInvoices = useMemo(() => {
    let filtered = invoices.filter((invoice) => {
      const matchesSearch =
        invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime();
        case "date-asc":
          return new Date(a.issueDate).getTime() - new Date(b.issueDate).getTime();
        case "amount-desc":
          return b.totalAmount - a.totalAmount;
        case "amount-asc":
          return a.totalAmount - b.totalAmount;
        default:
          return 0;
      }
    });

    return filtered;
  }, [invoices, searchQuery, statusFilter, sortBy]);

  const stats = useMemo(() => {
    const total = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
    const paid = invoices.filter(inv => inv.status === "paid").reduce((sum, inv) => sum + inv.totalAmount, 0);
    const pending = invoices.filter(inv => inv.status === "pending").reduce((sum, inv) => sum + inv.totalAmount, 0);
    const overdue = invoices.filter(inv => inv.status === "overdue").reduce((sum, inv) => sum + inv.totalAmount, 0);

    return { total, paid, pending, overdue, count: invoices.length };
  }, [invoices]);

  const getStatusColor = (status: InvoiceStatus) => {
    const colors = {
      draft: "bg-muted text-muted-foreground",
      pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      paid: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      overdue: "bg-destructive/10 text-destructive",
      cancelled: "bg-muted text-muted-foreground"
    };
    return colors[status] || colors.draft;
  };

  const getStatusIcon = (status: InvoiceStatus) => {
    switch (status) {
      case "paid":
        return "✓";
      case "overdue":
        return "!";
      case "pending":
        return "⏱";
      default:
        return "";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const handleViewDetails = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowDetailsModal(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  Invoices & Finance
                </h1>
                <p className="text-muted-foreground">Manage invoices, payments, and financial records</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                  <DialogTrigger asChild>
                    <Button className="gradient-ocean shadow-luxury">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Invoice
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Create New Invoice</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Customer Name</Label>
                          <Input placeholder="John Doe" />
                        </div>
                        <div className="space-y-2">
                          <Label>Customer Email</Label>
                          <Input type="email" placeholder="john@example.com" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Amount</Label>
                          <Input type="number" placeholder="0.00" />
                        </div>
                        <div className="space-y-2">
                          <Label>Tax Amount</Label>
                          <Input type="number" placeholder="0.00" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Issue Date</Label>
                          <Input type="date" />
                        </div>
                        <div className="space-y-2">
                          <Label>Due Date</Label>
                          <Input type="date" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Booking ID (Optional)</Label>
                        <Input placeholder="BK-001" />
                      </div>
                      <div className="space-y-2">
                        <Label>Notes</Label>
                        <Textarea placeholder="Additional notes..." rows={3} />
                      </div>
                      <Button className="w-full gradient-ocean">Create Invoice</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="border-2 hover:shadow-luxury transition-all">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Revenue</p>
                      <p className="text-2xl font-bold">{formatCurrency(stats.total)}</p>
                    </div>
                    <div className="w-12 h-12 gradient-ocean rounded-xl flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-primary-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 hover:shadow-luxury transition-all">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Paid</p>
                      <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(stats.paid)}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 hover:shadow-luxury transition-all">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Pending</p>
                      <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                        {formatCurrency(stats.pending)}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 hover:shadow-luxury transition-all">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Overdue</p>
                      <p className="text-2xl font-bold text-destructive">
                        {formatCurrency(stats.overdue)}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-destructive/10 rounded-xl flex items-center justify-center">
                      <AlertCircle className="w-6 h-6 text-destructive" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search invoices..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date-desc">Date (Newest)</SelectItem>
                      <SelectItem value="date-asc">Date (Oldest)</SelectItem>
                      <SelectItem value="amount-desc">Amount (High to Low)</SelectItem>
                      <SelectItem value="amount-asc">Amount (Low to High)</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex items-center text-sm text-muted-foreground">
                    <FileText className="w-4 h-4 mr-2" />
                    {filteredAndSortedInvoices.length} invoice{filteredAndSortedInvoices.length !== 1 ? "s" : ""}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Invoices List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            {filteredAndSortedInvoices.map((invoice, index) => (
              <motion.div
                key={invoice.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="border-2 hover:shadow-luxury transition-all hover:border-primary/50">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-bold">{invoice.invoiceNumber}</h3>
                              <Badge className={getStatusColor(invoice.status)}>
                                {getStatusIcon(invoice.status)} {invoice.status.toUpperCase()}
                              </Badge>
                            </div>
                            <div className="space-y-1 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                <span className="font-medium text-foreground">{invoice.customerName}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                <span>{invoice.customerEmail}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground mb-1">Issue Date</p>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <p className="font-medium">{formatDate(invoice.issueDate)}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-1">Due Date</p>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <p className="font-medium">{formatDate(invoice.dueDate)}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-1">Amount</p>
                            <p className="font-medium">{formatCurrency(invoice.amount)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-1">Total</p>
                            <p className="font-bold text-lg">{formatCurrency(invoice.totalAmount)}</p>
                          </div>
                        </div>

                        {invoice.notes && (
                          <p className="text-sm text-muted-foreground italic">
                            "{invoice.notes}"
                          </p>
                        )}
                      </div>

                      <div className="flex lg:flex-col gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(invoice)}
                          className="flex-1 lg:flex-none"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 lg:flex-none">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 lg:flex-none text-destructive hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>

      {/* Invoice Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Invoice Details</DialogTitle>
          </DialogHeader>
          {selectedInvoice && (
            <div className="space-y-6 py-4">
              <div className="flex items-center justify-between pb-4 border-b">
                <div>
                  <h2 className="text-2xl font-bold mb-1">{selectedInvoice.invoiceNumber}</h2>
                  <Badge className={getStatusColor(selectedInvoice.status)}>
                    {selectedInvoice.status.toUpperCase()}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="text-3xl font-bold">{formatCurrency(selectedInvoice.totalAmount)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Customer Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span>{selectedInvoice.customerName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span>{selectedInvoice.customerEmail}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Invoice Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Issue Date:</span>
                      <span className="font-medium">{formatDate(selectedInvoice.issueDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Due Date:</span>
                      <span className="font-medium">{formatDate(selectedInvoice.dueDate)}</span>
                    </div>
                    {selectedInvoice.paidDate && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Paid Date:</span>
                        <span className="font-medium text-emerald-600">{formatDate(selectedInvoice.paidDate)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Amount Breakdown</h3>
                <div className="space-y-2 bg-muted/50 p-4 rounded-lg">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium">{formatCurrency(selectedInvoice.amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span className="font-medium">{formatCurrency(selectedInvoice.taxAmount)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t text-lg font-bold">
                    <span>Total</span>
                    <span>{formatCurrency(selectedInvoice.totalAmount)}</span>
                  </div>
                </div>
              </div>

              {selectedInvoice.notes && (
                <div>
                  <h3 className="font-semibold mb-2">Notes</h3>
                  <p className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg">
                    {selectedInvoice.notes}
                  </p>
                </div>
              )}

              <div>
                <h3 className="font-semibold mb-3">Related Transactions</h3>
                <div className="space-y-2">
                  {transactions
                    .filter(txn => txn.invoiceId === selectedInvoice.id)
                    .map(txn => (
                      <div key={txn.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{txn.transactionNumber}</p>
                            <p className="text-sm text-muted-foreground">
                              {txn.paymentMethod} • {formatDate(txn.transactionDate)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{formatCurrency(txn.amount)}</p>
                          <Badge variant="outline" className="text-xs">
                            {txn.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Button className="flex-1 gradient-ocean">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
                <Button variant="outline" className="flex-1">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Invoices;