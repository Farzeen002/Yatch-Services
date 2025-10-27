"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/navigation";
import Footer from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Users, 
  UserCheck, 
  UserX, 
  Plus,
  Eye,
  Edit,
  Trash2,
  Filter,
  Calendar,
  Mail,
  Phone,
  Award,
  DollarSign,
  Clock,
  Anchor,
  ChefHat,
  Wrench,
  Ship
} from "lucide-react";

type StaffRole = "captain" | "crew" | "chef" | "steward" | "engineer" | "deckhand";
type StaffStatus = "active" | "inactive" | "on_leave";
type AssignmentStatus = "scheduled" | "in_progress" | "completed" | "cancelled";

interface Staff {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: StaffRole;
  status: StaffStatus;
  hireDate: string;
  dateOfBirth?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  certifications: string[];
  hourlyRate?: number;
  notes?: string;
}

interface StaffAssignment {
  id: string;
  staffId: string;
  staffName: string;
  yachtName: string;
  assignmentDate: string;
  startTime: string;
  endTime: string;
  status: AssignmentStatus;
  notes?: string;
}

const Staff = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState("name-asc");
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

  // Mock data
  const staff: Staff[] = [
    {
      id: "1",
      employeeId: "EMP-001",
      firstName: "Captain",
      lastName: "James Morrison",
      email: "james@marina.com",
      phone: "+1 (555) 123-4567",
      role: "captain",
      status: "active",
      hireDate: "2020-03-15",
      dateOfBirth: "1985-06-20",
      emergencyContactName: "Sarah Morrison",
      emergencyContactPhone: "+1 (555) 123-4568",
      certifications: ["Master License", "STCW 95", "MCA Safety"],
      hourlyRate: 85,
      notes: "15 years of experience. Specializes in luxury yacht operations."
    },
    {
      id: "2",
      employeeId: "EMP-002",
      firstName: "Maria",
      lastName: "Rodriguez",
      email: "maria@marina.com",
      phone: "+1 (555) 234-5678",
      role: "chef",
      status: "active",
      hireDate: "2021-06-01",
      certifications: ["Culinary Degree", "Food Safety", "Wine Sommelier"],
      hourlyRate: 65,
      notes: "Michelin-trained chef with maritime catering experience."
    },
    {
      id: "3",
      employeeId: "EMP-003",
      firstName: "Alex",
      lastName: "Chen",
      email: "alex@marina.com",
      phone: "+1 (555) 345-6789",
      role: "engineer",
      status: "active",
      hireDate: "2019-09-10",
      certifications: ["Marine Engineering", "Diesel Mechanics", "Electrical Systems"],
      hourlyRate: 75,
      notes: "Expert in yacht systems and maintenance."
    },
    {
      id: "4",
      employeeId: "EMP-004",
      firstName: "Sophie",
      lastName: "Williams",
      email: "sophie@marina.com",
      phone: "+1 (555) 456-7890",
      role: "steward",
      status: "active",
      hireDate: "2022-01-15",
      certifications: ["Guest Services", "STCW Basic"],
      hourlyRate: 45,
      notes: "Exceptional guest service skills."
    },
    {
      id: "5",
      employeeId: "EMP-005",
      firstName: "Michael",
      lastName: "Brown",
      email: "michael@marina.com",
      phone: "+1 (555) 567-8901",
      role: "deckhand",
      status: "on_leave",
      hireDate: "2021-11-20",
      certifications: ["STCW Basic", "First Aid"],
      hourlyRate: 35,
      notes: "On medical leave until next month."
    },
    {
      id: "6",
      employeeId: "EMP-006",
      firstName: "David",
      lastName: "Taylor",
      email: "david@marina.com",
      phone: "+1 (555) 678-9012",
      role: "crew",
      status: "active",
      hireDate: "2023-02-01",
      certifications: ["STCW Basic", "Marine Operations"],
      hourlyRate: 40
    }
  ];

  const assignments: StaffAssignment[] = [
    {
      id: "1",
      staffId: "1",
      staffName: "Captain James Morrison",
      yachtName: "Ocean Majesty",
      assignmentDate: "2024-02-25",
      startTime: "08:00",
      endTime: "18:00",
      status: "scheduled",
      notes: "Full day charter - Corporate event"
    },
    {
      id: "2",
      staffId: "2",
      staffName: "Maria Rodriguez",
      yachtName: "Ocean Majesty",
      assignmentDate: "2024-02-25",
      startTime: "07:00",
      endTime: "19:00",
      status: "scheduled",
      notes: "Prepare 5-course meal for 12 guests"
    },
    {
      id: "3",
      staffId: "3",
      staffName: "Alex Chen",
      yachtName: "Sea Breeze",
      assignmentDate: "2024-02-24",
      startTime: "09:00",
      endTime: "17:00",
      status: "in_progress",
      notes: "Engine maintenance and systems check"
    },
    {
      id: "4",
      staffId: "4",
      staffName: "Sophie Williams",
      yachtName: "Sunset Dream",
      assignmentDate: "2024-02-23",
      startTime: "10:00",
      endTime: "22:00",
      status: "completed",
      notes: "Evening charter service"
    }
  ];

  const filteredAndSortedStaff = useMemo(() => {
    let filtered = staff.filter((member) => {
      const matchesSearch =
        member.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.employeeId.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole = roleFilter === "all" || member.role === roleFilter;
      const matchesStatus = statusFilter === "all" || member.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
        case "name-desc":
          return `${b.firstName} ${b.lastName}`.localeCompare(`${a.firstName} ${a.lastName}`);
        case "rate-desc":
          return (b.hourlyRate || 0) - (a.hourlyRate || 0);
        case "rate-asc":
          return (a.hourlyRate || 0) - (b.hourlyRate || 0);
        case "hire-desc":
          return new Date(b.hireDate).getTime() - new Date(a.hireDate).getTime();
        case "hire-asc":
          return new Date(a.hireDate).getTime() - new Date(b.hireDate).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [staff, searchQuery, roleFilter, statusFilter, sortBy]);

  const stats = useMemo(() => {
    const totalStaff = staff.length;
    const activeStaff = staff.filter(s => s.status === "active").length;
    const onLeave = staff.filter(s => s.status === "on_leave").length;
    const scheduledToday = assignments.filter(a => 
      a.assignmentDate === new Date().toISOString().split('T')[0] &&
      (a.status === "scheduled" || a.status === "in_progress")
    ).length;

    return { totalStaff, activeStaff, onLeave, scheduledToday };
  }, [staff, assignments]);

  const getRoleIcon = (role: StaffRole) => {
    const icons = {
      captain: Anchor,
      crew: Ship,
      chef: ChefHat,
      steward: Users,
      engineer: Wrench,
      deckhand: Ship
    };
    return icons[role] || Users;
  };

  const getRoleColor = (role: StaffRole) => {
    const colors = {
      captain: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
      crew: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
      chef: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
      steward: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
      engineer: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
      deckhand: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400"
    };
    return colors[role] || "bg-muted text-muted-foreground";
  };

  const getStatusColor = (status: StaffStatus) => {
    const colors = {
      active: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      inactive: "bg-muted text-muted-foreground",
      on_leave: "bg-amber-500/10 text-amber-600 dark:text-amber-400"
    };
    return colors[status];
  };

  const getAssignmentStatusColor = (status: AssignmentStatus) => {
    const colors = {
      scheduled: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
      in_progress: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      completed: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      cancelled: "bg-muted text-muted-foreground"
    };
    return colors[status];
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

  const handleViewDetails = (member: Staff) => {
    setSelectedStaff(member);
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
                  Staff Management
                </h1>
                <p className="text-muted-foreground">Manage crew members, assignments, and schedules</p>
              </div>
              <div className="flex gap-2">
                <Dialog open={showAssignModal} onOpenChange={setShowAssignModal}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Calendar className="w-4 h-4 mr-2" />
                      Assign Staff
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-xl">
                    <DialogHeader>
                      <DialogTitle>Create Staff Assignment</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Staff Member</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select staff member" />
                          </SelectTrigger>
                          <SelectContent>
                            {staff.filter(s => s.status === "active").map(s => (
                              <SelectItem key={s.id} value={s.id}>
                                {s.firstName} {s.lastName} - {s.role}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Yacht Name</Label>
                        <Input placeholder="Ocean Majesty" />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Date</Label>
                          <Input type="date" />
                        </div>
                        <div className="space-y-2">
                          <Label>Start Time</Label>
                          <Input type="time" />
                        </div>
                        <div className="space-y-2">
                          <Label>End Time</Label>
                          <Input type="time" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Notes</Label>
                        <Textarea placeholder="Assignment details..." rows={3} />
                      </div>
                      <Button className="w-full gradient-ocean">Create Assignment</Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                  <DialogTrigger asChild>
                    <Button className="gradient-ocean shadow-luxury">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Staff
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add New Staff Member</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>First Name</Label>
                          <Input placeholder="John" />
                        </div>
                        <div className="space-y-2">
                          <Label>Last Name</Label>
                          <Input placeholder="Doe" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Email</Label>
                          <Input type="email" placeholder="john@marina.com" />
                        </div>
                        <div className="space-y-2">
                          <Label>Phone</Label>
                          <Input type="tel" placeholder="+1 (555) 123-4567" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Role</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="captain">Captain</SelectItem>
                              <SelectItem value="crew">Crew</SelectItem>
                              <SelectItem value="chef">Chef</SelectItem>
                              <SelectItem value="steward">Steward</SelectItem>
                              <SelectItem value="engineer">Engineer</SelectItem>
                              <SelectItem value="deckhand">Deckhand</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Hourly Rate</Label>
                          <Input type="number" placeholder="50.00" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Hire Date</Label>
                          <Input type="date" />
                        </div>
                        <div className="space-y-2">
                          <Label>Date of Birth</Label>
                          <Input type="date" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Certifications (comma-separated)</Label>
                        <Input placeholder="STCW Basic, First Aid" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Emergency Contact Name</Label>
                          <Input placeholder="Jane Doe" />
                        </div>
                        <div className="space-y-2">
                          <Label>Emergency Contact Phone</Label>
                          <Input type="tel" placeholder="+1 (555) 123-4568" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Notes</Label>
                        <Textarea placeholder="Additional information..." rows={3} />
                      </div>
                      <Button className="w-full gradient-ocean">Add Staff Member</Button>
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
                      <p className="text-sm text-muted-foreground">Total Staff</p>
                      <p className="text-2xl font-bold">{stats.totalStaff}</p>
                    </div>
                    <div className="w-12 h-12 gradient-ocean rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-primary-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 hover:shadow-luxury transition-all">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Active</p>
                      <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        {stats.activeStaff}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                      <UserCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 hover:shadow-luxury transition-all">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">On Leave</p>
                      <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                        {stats.onLeave}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center">
                      <UserX className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 hover:shadow-luxury transition-all">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Scheduled Today</p>
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {stats.scheduledToday}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                      <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Tabs */}
          <Tabs defaultValue="staff" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="staff">Staff Members</TabsTrigger>
              <TabsTrigger value="assignments">Assignments</TabsTrigger>
            </TabsList>

            <TabsContent value="staff" className="space-y-6">
              {/* Filters */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div className="relative md:col-span-2">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder="Search staff..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>

                      <Select value={roleFilter} onValueChange={setRoleFilter}>
                        <SelectTrigger>
                          <Filter className="w-4 h-4 mr-2" />
                          <SelectValue placeholder="Filter by role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Roles</SelectItem>
                          <SelectItem value="captain">Captain</SelectItem>
                          <SelectItem value="crew">Crew</SelectItem>
                          <SelectItem value="chef">Chef</SelectItem>
                          <SelectItem value="steward">Steward</SelectItem>
                          <SelectItem value="engineer">Engineer</SelectItem>
                          <SelectItem value="deckhand">Deckhand</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="on_leave">On Leave</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                          <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                          <SelectItem value="rate-desc">Rate (High to Low)</SelectItem>
                          <SelectItem value="rate-asc">Rate (Low to High)</SelectItem>
                          <SelectItem value="hire-desc">Hire Date (Newest)</SelectItem>
                          <SelectItem value="hire-asc">Hire Date (Oldest)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Staff Grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredAndSortedStaff.map((member, index) => {
                  const RoleIcon = getRoleIcon(member.role);
                  return (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="border-2 hover:shadow-luxury transition-all hover:border-primary/50 h-full">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getRoleColor(member.role)}`}>
                                <RoleIcon className="w-6 h-6" />
                              </div>
                              <div>
                                <h3 className="font-bold">{member.firstName} {member.lastName}</h3>
                                <p className="text-sm text-muted-foreground">{member.employeeId}</p>
                              </div>
                            </div>
                            <Badge className={getStatusColor(member.status)}>
                              {member.status.replace("_", " ").toUpperCase()}
                            </Badge>
                          </div>

                          <div className="space-y-3 mb-4">
                            <div className="flex items-center gap-2 text-sm">
                              <Badge className={getRoleColor(member.role)}>
                                {member.role.toUpperCase()}
                              </Badge>
                            </div>

                            <div className="space-y-2 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                <span className="truncate">{member.email}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4" />
                                <span>{member.phone}</span>
                              </div>
                              {member.hourlyRate && (
                                <div className="flex items-center gap-2">
                                  <DollarSign className="w-4 h-4" />
                                  <span className="font-medium text-foreground">
                                    {formatCurrency(member.hourlyRate)}/hr
                                  </span>
                                </div>
                              )}
                            </div>

                            {member.certifications.length > 0 && (
                              <div className="flex items-start gap-2 text-sm">
                                <Award className="w-4 h-4 text-muted-foreground mt-0.5" />
                                <div className="flex-1">
                                  <p className="text-xs text-muted-foreground mb-1">Certifications:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {member.certifications.slice(0, 2).map((cert, i) => (
                                      <Badge key={i} variant="outline" className="text-xs">
                                        {cert}
                                      </Badge>
                                    ))}
                                    {member.certifications.length > 2 && (
                                      <Badge variant="outline" className="text-xs">
                                        +{member.certifications.length - 2}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="flex gap-2 pt-4 border-t">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              onClick={() => handleViewDetails(member)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1">
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </Button>
                            <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </motion.div>
            </TabsContent>

            <TabsContent value="assignments" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {assignments.map((assignment, index) => (
                  <motion.div
                    key={assignment.id}
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
                                  <h3 className="text-lg font-bold">{assignment.staffName}</h3>
                                  <Badge className={getAssignmentStatusColor(assignment.status)}>
                                    {assignment.status.replace("_", " ").toUpperCase()}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground flex items-center gap-2">
                                  <Anchor className="w-4 h-4" />
                                  {assignment.yachtName}
                                </p>
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <p className="text-muted-foreground mb-1">Date</p>
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4" />
                                  <p className="font-medium">{formatDate(assignment.assignmentDate)}</p>
                                </div>
                              </div>
                              <div>
                                <p className="text-muted-foreground mb-1">Start Time</p>
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4" />
                                  <p className="font-medium">{assignment.startTime}</p>
                                </div>
                              </div>
                              <div>
                                <p className="text-muted-foreground mb-1">End Time</p>
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4" />
                                  <p className="font-medium">{assignment.endTime}</p>
                                </div>
                              </div>
                            </div>

                            {assignment.notes && (
                              <p className="text-sm text-muted-foreground italic">
                                "{assignment.notes}"
                              </p>
                            )}
                          </div>

                          <div className="flex lg:flex-col gap-2">
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
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Staff Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Staff Member Details</DialogTitle>
          </DialogHeader>
          {selectedStaff && (
            <div className="space-y-6 py-4">
              <div className="flex items-center gap-4 pb-4 border-b">
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${getRoleColor(selectedStaff.role)}`}>
                  {(() => {
                    const RoleIcon = getRoleIcon(selectedStaff.role);
                    return <RoleIcon className="w-8 h-8" />;
                  })()}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-1">
                    {selectedStaff.firstName} {selectedStaff.lastName}
                  </h2>
                  <div className="flex items-center gap-2">
                    <Badge className={getRoleColor(selectedStaff.role)}>
                      {selectedStaff.role.toUpperCase()}
                    </Badge>
                    <Badge className={getStatusColor(selectedStaff.status)}>
                      {selectedStaff.status.replace("_", " ").toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Contact Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span>{selectedStaff.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{selectedStaff.phone}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Employment Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Employee ID:</span>
                      <span className="font-medium">{selectedStaff.employeeId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Hire Date:</span>
                      <span className="font-medium">{formatDate(selectedStaff.hireDate)}</span>
                    </div>
                    {selectedStaff.hourlyRate && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Hourly Rate:</span>
                        <span className="font-medium">{formatCurrency(selectedStaff.hourlyRate)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {selectedStaff.certifications.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Certifications
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedStaff.certifications.map((cert, i) => (
                      <Badge key={i} variant="outline" className="text-sm">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {(selectedStaff.emergencyContactName || selectedStaff.emergencyContactPhone) && (
                <div>
                  <h3 className="font-semibold mb-3">Emergency Contact</h3>
                  <div className="space-y-2 text-sm bg-muted/50 p-4 rounded-lg">
                    {selectedStaff.emergencyContactName && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Name:</span>
                        <span className="font-medium">{selectedStaff.emergencyContactName}</span>
                      </div>
                    )}
                    {selectedStaff.emergencyContactPhone && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Phone:</span>
                        <span className="font-medium">{selectedStaff.emergencyContactPhone}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selectedStaff.notes && (
                <div>
                  <h3 className="font-semibold mb-2">Notes</h3>
                  <p className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg">
                    {selectedStaff.notes}
                  </p>
                </div>
              )}

              <div>
                <h3 className="font-semibold mb-3">Recent Assignments</h3>
                <div className="space-y-2">
                  {assignments
                    .filter(a => a.staffId === selectedStaff.id)
                    .slice(0, 3)
                    .map(assignment => (
                      <div key={assignment.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg text-sm">
                        <div>
                          <p className="font-medium">{assignment.yachtName}</p>
                          <p className="text-muted-foreground">
                            {formatDate(assignment.assignmentDate)} • {assignment.startTime} - {assignment.endTime}
                          </p>
                        </div>
                        <Badge className={getAssignmentStatusColor(assignment.status)}>
                          {assignment.status.replace("_", " ")}
                        </Badge>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Staff;