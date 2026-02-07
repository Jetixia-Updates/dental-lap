import { useState } from "react";
import { useTranslation } from "react-i18next";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Send,
  MessageSquare,
  Phone,
  Mail,
  Plus,
  Search,
  Clock,
  CheckCircle,
  AlertCircle,
  Reply,
  X,
  UserPlus,
  Edit,
  Trash2,
} from "lucide-react";

interface Doctor {
  id: string;
  name: string;
  clinic: string;
  email: string;
  phone: string;
  activeCases: number;
  status: "active" | "inactive";
}

interface CommunicationLog {
  id: string;
  doctorId: string;
  caseId: string;
  type: "feedback" | "issue" | "update" | "approval";
  date: string;
  subject: string;
  message: string;
  read: boolean;
  priority: "low" | "medium" | "high";
  replies: MessageReply[];
}

interface MessageReply {
  id: string;
  author: string;
  date: string;
  message: string;
}

const initialDoctors: Doctor[] = [
  {
    id: "1",
    name: "Dr. John Smith",
    clinic: "Smile Dental Center",
    email: "john.smith@smiledentalcenter.com",
    phone: "+1 (555) 123-4567",
    activeCases: 12,
    status: "active",
  },
  {
    id: "2",
    name: "Dr. Sarah Johnson",
    clinic: "Professional Dental Group",
    email: "sarah.johnson@prodentalgroup.com",
    phone: "+1 (555) 234-5678",
    activeCases: 8,
    status: "active",
  },
  {
    id: "3",
    name: "Dr. James Wilson",
    clinic: "Advanced Dental Solutions",
    email: "james.wilson@advdentalso.com",
    phone: "+1 (555) 345-6789",
    activeCases: 15,
    status: "active",
  },
  {
    id: "4",
    name: "Dr. Patricia Lee",
    clinic: "Excellence in Dentistry",
    email: "patricia.lee@excellencedentalcare.com",
    phone: "+1 (555) 456-7890",
    activeCases: 6,
    status: "active",
  },
];

const initialLogs: CommunicationLog[] = [
  {
    id: "1",
    doctorId: "3",
    caseId: "CASE-2024-003",
    type: "update",
    date: "2024-02-10",
    subject: "Case CASE-2024-003 Status Update",
    message:
      "Your implant crown case has passed QC verification and is ready for delivery. Please schedule pickup at your earliest convenience.",
    read: true,
    priority: "low",
    replies: [],
  },
  {
    id: "2",
    doctorId: "1",
    caseId: "CASE-2024-001",
    type: "issue",
    date: "2024-02-10",
    subject: "Clinical Feedback - Shade Adjustment Recommended",
    message:
      "We noticed the crown shade may be slightly lighter than the adjacent tooth. We recommend a shade adjustment for optimal clinical results. Please confirm if you'd like us to proceed with refinement.",
    read: false,
    priority: "high",
    replies: [],
  },
  {
    id: "3",
    doctorId: "2",
    caseId: "CASE-2024-002",
    type: "approval",
    date: "2024-02-09",
    subject: "Digital Smile Design Approval Needed",
    message:
      "We've completed the digital design for the veneers. Please review the attached design and confirm approval to proceed with production.",
    read: false,
    priority: "medium",
    replies: [],
  },
  {
    id: "4",
    doctorId: "4",
    caseId: "CASE-2024-004",
    type: "feedback",
    date: "2024-02-08",
    subject: "Prescription Data Complete",
    message:
      "We've received your complete prescription for the crown. All clinical data is on file. Case intake processing begins immediately.",
    read: true,
    priority: "low",
    replies: [
      {
        id: "r1",
        author: "Dr. Patricia Lee",
        date: "2024-02-08",
        message: "Thank you for the quick confirmation. Looking forward to the results.",
      },
    ],
  },
  {
    id: "5",
    doctorId: "1",
    caseId: "CASE-2024-005",
    type: "update",
    date: "2024-02-07",
    subject: "In Production Update",
    message:
      "Case progressing well. Currently in CAM milling phase. Expected completion within 2 business days.",
    read: true,
    priority: "low",
    replies: [],
  },
];

const priorityConfig = {
  low: { label: "Low", color: "bg-green-100 text-green-800" },
  medium: { label: "Medium", color: "bg-amber-100 text-amber-800" },
  high: { label: "High", color: "bg-red-100 text-red-800" },
};

const typeConfig = {
  feedback: { label: "Feedback", icon: MessageSquare, color: "text-blue-600" },
  issue: { label: "Issue", icon: AlertCircle, color: "text-red-600" },
  update: { label: "Update", icon: Clock, color: "text-amber-600" },
  approval: { label: "Approval", icon: CheckCircle, color: "text-green-600" },
};

export default function Communication() {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors);
  const [logs, setLogs] = useState<CommunicationLog[]>(initialLogs);
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [selectedLog, setSelectedLog] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCompose, setShowCompose] = useState(false);
  const [showAddDoctor, setShowAddDoctor] = useState(false);
  const [replyText, setReplyText] = useState("");

  // Compose form state
  const [composeData, setComposeData] = useState({
    type: "update" as CommunicationLog["type"],
    caseId: "",
    subject: "",
    message: "",
    priority: "medium" as CommunicationLog["priority"],
  });

  // Add doctor form state
  const [newDoctor, setNewDoctor] = useState({
    name: "",
    clinic: "",
    email: "",
    phone: "",
  });

  const unreadIds = logs.filter((l) => !l.read).map((l) => l.id);
  const unreadCount = unreadIds.length;

  const filteredDoctors = doctors.filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.clinic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedDoctorData = doctors.find((d) => d.id === selectedDoctor);
  const selectedLogData = logs.find((l) => l.id === selectedLog);

  const doctorLogs = logs
    .filter((log) => log.doctorId === selectedDoctor)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleMarkRead = (logId: string) => {
    setLogs(logs.map((l) => (l.id === logId ? { ...l, read: true } : l)));
  };

  const handleSendMessage = () => {
    if (!selectedDoctor || !composeData.subject.trim() || !composeData.message.trim()) return;

    const newLog: CommunicationLog = {
      id: Date.now().toString(),
      doctorId: selectedDoctor,
      caseId: composeData.caseId || "General",
      type: composeData.type,
      date: new Date().toISOString().split("T")[0],
      subject: composeData.subject,
      message: composeData.message,
      read: true,
      priority: composeData.priority,
      replies: [],
    };

    setLogs([newLog, ...logs]);
    setComposeData({ type: "update", caseId: "", subject: "", message: "", priority: "medium" });
    setShowCompose(false);
    setSelectedLog(newLog.id);
  };

  const handleReply = () => {
    if (!selectedLog || !replyText.trim()) return;

    const reply: MessageReply = {
      id: Date.now().toString(),
      author: "Lab Team",
      date: new Date().toISOString().split("T")[0],
      message: replyText,
    };

    setLogs(
      logs.map((l) =>
        l.id === selectedLog
          ? { ...l, replies: [...l.replies, reply] }
          : l
      )
    );
    setReplyText("");
  };

  const handleAddDoctor = () => {
    if (!newDoctor.name.trim() || !newDoctor.clinic.trim()) return;
    const doc: Doctor = {
      id: Date.now().toString(),
      name: newDoctor.name,
      clinic: newDoctor.clinic,
      email: newDoctor.email,
      phone: newDoctor.phone,
      activeCases: 0,
      status: "active",
    };
    setDoctors([...doctors, doc]);
    setNewDoctor({ name: "", clinic: "", email: "", phone: "" });
    setShowAddDoctor(false);
  };

  const handleDeleteLog = (logId: string) => {
    setLogs(logs.filter((l) => l.id !== logId));
    if (selectedLog === logId) setSelectedLog(null);
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {t("communication.title")}
        </h1>
        <p className="text-muted-foreground">
          {t("communication.subtitle")}
        </p>
      </div>

      {/* Unread Banner */}
      {unreadCount > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <p className="text-sm text-blue-800">
            {t("communication.unreadBanner", { count: unreadCount })}
          </p>
          <Button
            size="sm"
            variant="outline"
            className="ml-auto"
            onClick={() => setLogs(logs.map((l) => ({ ...l, read: true })))}
          >
            {t("communication.markAsRead")}
          </Button>
        </div>
      )}

      <div className={`grid grid-cols-1 ${isMobile ? '' : 'lg:grid-cols-4'} gap-6`}>
        {/* Doctors List */}
        <div className={`${isMobile ? (selectedDoctorData ? 'hidden' : '') : 'lg:col-span-1'}`}>
          <div className="bg-card border rounded-lg p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground">{t("communication.doctors")}</h2>
              <Button size="sm" variant="outline" onClick={() => setShowAddDoctor(true)}>
                <UserPlus className="w-4 h-4" />
              </Button>
            </div>

            <div className="mb-4 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={t("cases.searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-md border border-border bg-background text-foreground placeholder-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className={`space-y-2 ${isMobile ? 'max-h-none' : 'max-h-[500px] overflow-y-auto'}`}>
              {filteredDoctors.map((doc) => {
                const docUnread = logs.filter((l) => l.doctorId === doc.id && !l.read).length;
                return (
                  <button
                    key={doc.id}
                    onClick={() => {
                      setSelectedDoctor(doc.id);
                      setSelectedLog(null);
                      setShowCompose(false);
                    }}
                    className={`w-full text-left p-3 rounded-md border transition-all ${
                      selectedDoctor === doc.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50 hover:bg-secondary/50"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <p className="font-semibold text-sm text-foreground">{doc.name}</p>
                      {docUnread > 0 && (
                        <span className="w-5 h-5 bg-blue-600 text-white rounded-full text-xs flex items-center justify-center flex-shrink-0">
                          {docUnread}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{doc.clinic}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        {doc.activeCases} {t("common.active")}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className={`${isMobile ? (selectedDoctorData ? '' : 'hidden') : 'lg:col-span-3'}`}>
          {isMobile && selectedDoctorData && (
            <Button 
              variant="outline" 
              onClick={() => setSelectedDoctor(null)}
              className="mb-4 w-full sm:w-auto"
            >
              ← {t("common.back")}
            </Button>
          )}
          {selectedDoctorData ? (
            <div className="space-y-6">
              {/* Doctor Details Card */}
              <div className="bg-card border rounded-lg p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">{selectedDoctorData.name}</h2>
                    <p className="text-sm text-muted-foreground">{selectedDoctorData.clinic}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={() => window.open(`tel:${selectedDoctorData.phone}`)}>
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => window.open(`mailto:${selectedDoctorData.email}`)}>
                      <Mail className="w-4 h-4" />
                    </Button>
                    <Button size="sm" onClick={() => setShowCompose(true)} className="flex-1 sm:flex-none">
                      <Send className="w-4 h-4 mr-2" />
                      {t("communication.newMessage")}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-border text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">{t("communication.emailLabel")}</p>
                    <p className="font-medium text-foreground truncate">{selectedDoctorData.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{t("communication.phoneLabel")}</p>
                    <p className="font-medium text-foreground">{selectedDoctorData.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{t("communication.activeCasesLabel")}</p>
                    <p className="font-medium text-primary">{selectedDoctorData.activeCases}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{t("communication.messagesLabel")}</p>
                    <p className="font-medium text-foreground">{doctorLogs.length}</p>
                  </div>
                </div>
              </div>

              {/* Compose Message Form */}
              {showCompose && (
                <div className="bg-card border rounded-lg p-6 border-primary/50">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-foreground">{t("communication.newMessage")}</h3>
                    <button
                      onClick={() => setShowCompose(false)}
                      className="p-1 hover:bg-secondary rounded-md"
                    >
                      <X className="w-5 h-5 text-muted-foreground" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">{t("communication.typeLabel")}</label>
                        <select
                          value={composeData.type}
                          onChange={(e) => setComposeData({ ...composeData, type: e.target.value as CommunicationLog["type"] })}
                          className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="update">{t("communication.updateType")}</option>
                          <option value="feedback">{t("communication.feedbackType")}</option>
                          <option value="issue">{t("communication.issueType")}</option>
                          <option value="approval">{t("communication.approvalType")}</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">{t("communication.caseIdLabel")}</label>
                        <input
                          type="text"
                          value={composeData.caseId}
                          onChange={(e) => setComposeData({ ...composeData, caseId: e.target.value })}
                          placeholder="CASE-2024-001"
                          className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">{t("common.priority")}</label>
                        <select
                          value={composeData.priority}
                          onChange={(e) => setComposeData({ ...composeData, priority: e.target.value as CommunicationLog["priority"] })}
                          className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="low">{t("cases.low")}</option>
                          <option value="medium">{t("cases.medium")}</option>
                          <option value="high">{t("cases.high")}</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">{t("communication.subject")}</label>
                      <input
                        type="text"
                        value={composeData.subject}
                        onChange={(e) => setComposeData({ ...composeData, subject: e.target.value })}
                        placeholder={t("communication.enterSubject")}
                        className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">{t("communication.message")}</label>
                      <textarea
                        value={composeData.message}
                        onChange={(e) => setComposeData({ ...composeData, message: e.target.value })}
                        placeholder={t("communication.typeMessage")}
                        rows={4}
                        className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" onClick={() => setShowCompose(false)}>
                        {t("common.cancel")}
                      </Button>
                      <Button
                        onClick={handleSendMessage}
                        disabled={!composeData.subject.trim() || !composeData.message.trim()}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        {t("communication.sendMessage")}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Communication Logs */}
              <div className="bg-card border rounded-lg p-6">
                <h3 className="text-lg font-bold text-foreground mb-4">{t("communication.communicationHistory")}</h3>

                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {doctorLogs.length > 0 ? (
                    doctorLogs.map((log) => {
                      const TypeIcon = typeConfig[log.type].icon;
                      const isUnread = !log.read;

                      return (
                        <button
                          key={log.id}
                          onClick={() => {
                            setSelectedLog(log.id);
                            handleMarkRead(log.id);
                          }}
                          className={`w-full text-left p-3 rounded-md border transition-all ${
                            selectedLog === log.id
                              ? "border-primary bg-primary/5"
                              : isUnread
                              ? "border-blue-200 bg-blue-50 hover:bg-blue-100"
                              : "border-border hover:border-primary/50 hover:bg-secondary/50"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <TypeIcon
                              className={`w-5 h-5 flex-shrink-0 mt-0.5 ${typeConfig[log.type].color}`}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-semibold text-sm text-foreground truncate">
                                  {log.subject}
                                </p>
                                {isUnread && (
                                  <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground mb-1">
                                {new Date(log.date).toLocaleDateString()} &bull; {log.caseId}
                                {log.replies.length > 0 && ` &bull; ${log.replies.length} repl${log.replies.length === 1 ? "y" : "ies"}`}
                              </p>
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {log.message}
                              </p>
                            </div>
                            <span
                              className={`text-xs px-2 py-1 rounded whitespace-nowrap flex-shrink-0 ${
                                priorityConfig[log.priority].color
                              }`}
                            >
                              {priorityConfig[log.priority].label}
                            </span>
                          </div>
                        </button>
                      );
                    })
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      {t("communication.noHistory")}
                    </p>
                  )}
                </div>
              </div>

              {/* Message Detail with Replies */}
              {selectedLogData && (
                <div className="bg-card border rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4 pb-4 border-b border-border">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs px-2 py-1 rounded ${
                          { feedback: "bg-blue-100 text-blue-800", issue: "bg-red-100 text-red-800", update: "bg-amber-100 text-amber-800", approval: "bg-green-100 text-green-800" }[selectedLogData.type]
                        }`}>
                          {typeConfig[selectedLogData.type].label}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${priorityConfig[selectedLogData.priority].color}`}>
                          {priorityConfig[selectedLogData.priority].label}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-1">{selectedLogData.subject}</h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedLogData.caseId} &bull; {new Date(selectedLogData.date).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteLog(selectedLogData.id)}
                      className="p-1 hover:bg-secondary rounded-md"
                    >
                      <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                    </button>
                  </div>

                  <div className="mb-6">
                    <p className="text-foreground">{selectedLogData.message}</p>
                  </div>

                  {/* Replies */}
                  {selectedLogData.replies.length > 0 && (
                    <div className="mb-6 space-y-3">
                      <h4 className="text-sm font-semibold text-foreground">{t("communication.repliesLabel")}</h4>
                      {selectedLogData.replies.map((reply) => (
                        <div key={reply.id} className="p-3 bg-secondary/50 rounded-md border border-border">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-semibold text-foreground">{reply.author}</p>
                            <p className="text-xs text-muted-foreground">{new Date(reply.date).toLocaleDateString()}</p>
                          </div>
                          <p className="text-sm text-foreground">{reply.message}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply Form */}
                  <div className="pt-4 border-t border-border">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder={t("communication.typeReply")}
                      rows={3}
                      className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none mb-3"
                    />
                    <div className="flex gap-2 justify-end">
                      <Button
                        onClick={handleReply}
                        disabled={!replyText.trim()}
                      >
                        <Reply className="w-4 h-4 mr-2" />
                        {t("common.reply")}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-card border rounded-lg h-64 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">{t("communication.selectDoctor")}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Doctor Dialog */}
      {showAddDoctor && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg border border-border shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-bold text-foreground">{t("communication.addDoctor")}</h2>
              <button onClick={() => setShowAddDoctor(false)} className="p-1 hover:bg-secondary rounded-md">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">{t("communication.doctorName")}</label>
                <input
                  type="text"
                  value={newDoctor.name}
                  onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
                  placeholder="Dr. Jane Smith"
                  className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">{t("communication.clinic")}</label>
                <input
                  type="text"
                  value={newDoctor.clinic}
                  onChange={(e) => setNewDoctor({ ...newDoctor, clinic: e.target.value })}
                  placeholder="Dental Center Name"
                  className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Email</label>
                <input
                  type="email"
                  value={newDoctor.email}
                  onChange={(e) => setNewDoctor({ ...newDoctor, email: e.target.value })}
                  placeholder="doctor@clinic.com"
                  className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Phone</label>
                <input
                  type="tel"
                  value={newDoctor.phone}
                  onChange={(e) => setNewDoctor({ ...newDoctor, phone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                  className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-border justify-end">
              <Button variant="outline" onClick={() => setShowAddDoctor(false)}>{t("common.cancel")}</Button>
              <Button onClick={handleAddDoctor} disabled={!newDoctor.name.trim() || !newDoctor.clinic.trim()}>
                <UserPlus className="w-4 h-4 mr-2" />
                {t("communication.addDoctor")}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Communication Standards */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            {t("communication.professionalTone")}
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-accent" /> {t("communication.clearRespectful")}</li>
            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-accent" /> {t("communication.clinicalLanguage")}</li>
            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-accent" /> {t("communication.suggestImprovements")}</li>
            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-accent" /> {t("communication.visualFeedback")}</li>
          </ul>
        </div>
        <div className="bg-card border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-accent" />
            {t("communication.responseTime")}
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-accent" /> {t("communication.highPriority")}</li>
            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-accent" /> {t("communication.mediumPriority")}</li>
            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-accent" /> {t("communication.lowPriority")}</li>
            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-accent" /> {t("communication.allLogged")}</li>
          </ul>
        </div>
        <div className="bg-card border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            {t("communication.documentation")}
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-accent" /> {t("communication.auditTrail")}</li>
            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-accent" /> {t("communication.archived")}</li>
            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-accent" /> {t("communication.complianceVerified")}</li>
            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-accent" /> {t("communication.dataProtected")}</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}
