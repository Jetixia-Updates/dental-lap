import { useLabContext } from "@/contexts/LabContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Check, Clock, ArrowRight, AlertCircle, 
  Inbox, Monitor, Cog, Palette, 
  Award, Truck, SkipForward, Pause
} from "lucide-react";
import { DentalCase } from "@shared/api";

interface WorkflowTrackerProps {
  caseData: DentalCase;
  onAdvance?: () => void;
}

export default function WorkflowTracker({ caseData, onAdvance }: WorkflowTrackerProps) {
  const { advanceStage } = useLabContext();

  const handleAdvance = () => {
    advanceStage(caseData.id);
    if (onAdvance) onAdvance();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-300";
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "skipped":
        return "bg-gray-100 text-gray-400 border-gray-200";
      case "paused":
        return "bg-amber-100 text-amber-800 border-amber-300";
      default:
        return "bg-gray-100 text-gray-600 border-gray-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <Check className="w-4 h-4 text-green-600" />;
      case "in_progress":
        return <Clock className="w-4 h-4 text-blue-600 animate-pulse" />;
      case "skipped":
        return <SkipForward className="w-4 h-4 text-gray-400" />;
      case "paused":
        return <Pause className="w-4 h-4 text-amber-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed": return "مكتمل";
      case "in_progress": return "قيد العمل";
      case "skipped": return "تم التخطي";
      case "paused": return "متوقف";
      default: return "معلق";
    }
  };

  const currentStep = caseData.workflow[caseData.currentStageIndex];
  const canAdvance = currentStep?.status === "in_progress" && !caseData.isPaused;

  return (
    <div className="space-y-6">
      {/* Case Header */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">{caseData.id}</h3>
            <p className="text-sm text-muted-foreground">
              {caseData.patientName} - {caseData.toothNumbers}
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

      {/* Paused banner */}
      {caseData.isPaused && (
        <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm">
          <Pause className="w-4 h-4 text-amber-600 mt-0.5" />
          <p className="font-medium text-amber-800">الحالة متوقفة مؤقتاً - لا يسمح بأي عمل</p>
        </div>
      )}

      {/* Workflow Steps */}
      <div className="space-y-3">
        {caseData.workflow.map((step, index) => {
          const isActive = step.status === "in_progress";
          const isCompleted = step.status === "completed";
          
          return (
            <div key={step.id}>
              <div className={`border rounded-lg p-4 transition-all ${
                isActive ? "border-primary bg-primary/5 shadow-md" :
                isCompleted ? "border-green-300 bg-green-50/50" :
                step.status === "skipped" ? "border-gray-200 bg-gray-50/30 opacity-60" :
                "border-gray-200 bg-gray-50/50"
              }`}>
                <div className="flex items-center gap-4">
                  {/* Step Number */}
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    isCompleted ? "bg-green-500 border-green-600" :
                    isActive ? "bg-primary border-primary" :
                    "bg-gray-200 border-gray-300"
                  }`}>
                    {isCompleted ? (
                      <Check className="w-5 h-5 text-white" />
                    ) : (
                      <span className={`text-sm font-bold ${isActive ? "text-white" : "text-gray-500"}`}>
                        {index + 1}
                      </span>
                    )}
                  </div>

                  {/* Step Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className={`font-semibold ${step.status === "skipped" ? "line-through text-gray-400" : ""}`}>
                        {step.stage}
                      </h4>
                      <Badge variant="outline" className={getStatusColor(step.status)}>
                        {getStatusLabel(step.status)}
                      </Badge>
                    </div>
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
      {canAdvance && (
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button 
            onClick={handleAdvance}
            className="bg-gradient-to-r from-primary to-accent"
          >
            <Check className="w-4 h-4 mr-2" />
            إنهاء المرحلة والانتقال للتالية
          </Button>
        </div>
      )}
    </div>
  );
}
