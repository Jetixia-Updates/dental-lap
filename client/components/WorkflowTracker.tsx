import { useLabContext, Case } from "@/contexts/LabContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Check, Clock, ArrowRight, User, AlertCircle, 
  Inbox, Clipboard, Scan, Monitor, Cog, Palette, 
  Award, Truck 
} from "lucide-react";

interface WorkflowTrackerProps {
  caseData: Case;
  onMoveNext?: () => void;
}

const DEPARTMENT_ICONS: { [key: string]: any } = {
  "reception": Inbox,
  "case-planning": Clipboard,
  "model-scan": Scan,
  "cad-design": Monitor,
  "cam-production": Cog,
  "finishing": Palette,
  "quality-control": Award,
  "logistics": Truck
};

const DEPARTMENT_NAMES: { [key: string]: string } = {
  "reception": "الاستقبال",
  "case-planning": "تخطيط الحالة",
  "model-scan": "المسح والنموذج",
  "cad-design": "التصميم الرقمي",
  "cam-production": "الإنتاج",
  "finishing": "التشطيب",
  "quality-control": "مراقبة الجودة",
  "logistics": "التوصيل"
};

export default function WorkflowTracker({ caseData, onMoveNext }: WorkflowTrackerProps) {
  const { staff, moveToNextDepartment, assignStaffToCase } = useLabContext();

  const handleMoveNext = () => {
    moveToNextDepartment(caseData.id);
    if (onMoveNext) onMoveNext();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-300";
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-300";
      default:
        return "bg-gray-100 text-gray-600 border-gray-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <Check className="w-4 h-4 text-green-600" />;
      case "in-progress":
        return <Clock className="w-4 h-4 text-blue-600 animate-pulse" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const currentStepIndex = caseData.workflow.findIndex(
    step => step.status === "in-progress"
  );

  const canMoveNext = currentStepIndex !== -1 && 
                      currentStepIndex < caseData.workflow.length - 1;

  return (
    <div className="space-y-6">
      {/* Case Header */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">{caseData.id}</h3>
            <p className="text-sm text-muted-foreground">
              {caseData.patient} - {caseData.restorationType} ({caseData.toothNumbers})
            </p>
          </div>
          <Badge className={
            caseData.priority === "emergency" ? "bg-red-500" :
            caseData.priority === "rush" ? "bg-yellow-500" :
            "bg-blue-500"
          }>
            {caseData.priority === "emergency" ? "طارئة" :
             caseData.priority === "rush" ? "عاجلة" : "عادية"}
          </Badge>
        </div>
      </div>

      {/* Workflow Steps */}
      <div className="space-y-3">
        {caseData.workflow.map((step, index) => {
          const Icon = DEPARTMENT_ICONS[step.department] || Inbox;
          const isActive = step.status === "in-progress";
          const isCompleted = step.status === "completed";
          const departmentStaff = staff.filter(s => s.department === step.department);
          
          return (
            <div key={step.department}>
              <div className={`border rounded-lg p-4 transition-all ${
                isActive ? "border-primary bg-primary/5 shadow-md" :
                isCompleted ? "border-green-300 bg-green-50/50" :
                "border-gray-200 bg-gray-50/50"
              }`}>
                <div className="flex items-center gap-4">
                  {/* Step Number & Icon */}
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    isCompleted ? "bg-green-500 border-green-600" :
                    isActive ? "bg-primary border-primary" :
                    "bg-gray-200 border-gray-300"
                  }`}>
                    {isCompleted ? (
                      <Check className="w-5 h-5 text-white" />
                    ) : (
                      <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-500"}`} />
                    )}
                  </div>

                  {/* Department Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{DEPARTMENT_NAMES[step.department]}</h4>
                      <Badge variant="outline" className={getStatusColor(step.status)}>
                        {step.status === "completed" ? "مكتمل" :
                         step.status === "in-progress" ? "قيد العمل" : "معلق"}
                      </Badge>
                    </div>
                    
                    {/* Assigned Staff */}
                    {step.assignedTo && (
                      <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                        <User className="w-3 h-3" />
                        {staff.find(s => s.id === step.assignedTo)?.name || "غير معين"}
                      </div>
                    )}

                    {/* Assign Staff (if active and no assignment) */}
                    {isActive && !step.assignedTo && departmentStaff.length > 0 && (
                      <div className="mt-2">
                        <select
                          onChange={(e) => {
                            if (e.target.value) {
                              assignStaffToCase(caseData.id, step.department, e.target.value);
                            }
                          }}
                          className="text-sm border rounded px-2 py-1"
                          defaultValue=""
                        >
                          <option value="">تعيين موظف...</option>
                          {departmentStaff.map(s => (
                            <option key={s.id} value={s.id}>
                              {s.name} - {s.role}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Completion Time */}
                    {step.completedAt && (
                      <p className="text-xs text-muted-foreground mt-1">
                        اكتمل في: {new Date(step.completedAt).toLocaleString('ar-EG')}
                      </p>
                    )}
                  </div>

                  {/* Status Icon */}
                  <div>
                    {getStatusIcon(step.status)}
                  </div>
                </div>
              </div>

              {/* Arrow between steps */}
              {index < caseData.workflow.length - 1 && (
                <div className="flex justify-center py-2">
                  <ArrowRight className={`w-5 h-5 ${
                    isCompleted ? "text-green-500" : "text-gray-300"
                  }`} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Button */}
      {canMoveNext && (
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button 
            onClick={handleMoveNext}
            className="bg-gradient-to-r from-primary to-accent"
          >
            <Check className="w-4 h-4 mr-2" />
            إنهاء المرحلة والانتقال للتالية
          </Button>
        </div>
      )}

      {/* Warning if no staff assigned */}
      {currentStepIndex !== -1 && !caseData.workflow[currentStepIndex].assignedTo && (
        <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm">
          <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
          <div>
            <p className="font-medium text-yellow-800">لم يتم تعيين موظف لهذه المرحلة</p>
            <p className="text-yellow-700 text-xs mt-1">
              يُنصح بتعيين موظف للمرحلة الحالية لمتابعة العمل بشكل أفضل
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
