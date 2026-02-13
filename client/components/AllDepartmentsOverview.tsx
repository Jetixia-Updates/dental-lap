import { useLabContext } from "@/contexts/LabContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Inbox, Monitor, Cog, Palette, Package, Smile,
  ArrowRight, Users, Clock, TrendingUp
} from "lucide-react";

const DEPARTMENT_CONFIG: Record<string, { name: string; icon: any; color: string; path: string }> = {
  "reception": { 
    name: "الاستقبال", 
    icon: Inbox, 
    color: "bg-blue-100 text-blue-800",
    path: "/departments/reception"
  },
  "digital": { 
    name: "الديجيتال", 
    icon: Monitor, 
    color: "bg-indigo-100 text-indigo-800",
    path: "/departments/cad-design"
  },
  "porcelain": { 
    name: "البورسلين", 
    icon: Palette, 
    color: "bg-pink-100 text-pink-800",
    path: "/departments/finishing"
  },
  "removable": { 
    name: "المتحركة", 
    icon: Package, 
    color: "bg-teal-100 text-teal-800",
    path: "/departments/cam-production"
  },
  "orthodontics": { 
    name: "التقويم", 
    icon: Smile, 
    color: "bg-purple-100 text-purple-800",
    path: "/departments"
  },
  "management": { 
    name: "الإدارة", 
    icon: Users, 
    color: "bg-amber-100 text-amber-800",
    path: "/departments"
  }
};

export default function AllDepartmentsOverview() {
  const { cases, staff } = useLabContext();
  const navigate = useNavigate();

  // Calculate department stats from cases using current workflow stage department
  const departmentStats = Object.entries(DEPARTMENT_CONFIG).map(([key, config]) => {
    const deptCases = cases.filter(c => {
      const currentStep = c.workflow[c.currentStageIndex];
      return currentStep?.department === key && !c.isPaused && c.finalStatus !== "delivery";
    });
    const deptStaff = staff.filter(s => s.department === key);

    return {
      key,
      ...config,
      activeCases: deptCases.length,
      staffCount: deptStaff.length,
    };
  });

  const totalCases = cases.length;
  const totalStaff = staff.length;
  const activeCases = cases.filter(c => !c.isPaused && c.finalStatus !== "delivery").length;
  const pausedCases = cases.filter(c => c.isPaused).length;

  return (
    <div className="space-y-6">
      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 text-blue-600">
            <Inbox className="w-5 h-5" />
            <span className="text-sm text-muted-foreground">إجمالي الحالات</span>
          </div>
          <p className="text-2xl font-bold mt-2">{totalCases}</p>
          <p className="text-xs text-muted-foreground mt-1">عبر جميع الأقسام</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 text-green-600">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm text-muted-foreground">نشطة</span>
          </div>
          <p className="text-2xl font-bold mt-2">{activeCases}</p>
          <p className="text-xs text-muted-foreground mt-1">قيد العمل</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 text-amber-600">
            <Clock className="w-5 h-5" />
            <span className="text-sm text-muted-foreground">متوقفة</span>
          </div>
          <p className="text-2xl font-bold mt-2">{pausedCases}</p>
          <p className="text-xs text-muted-foreground mt-1">بانتظار العودة</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 text-purple-600">
            <Users className="w-5 h-5" />
            <span className="text-sm text-muted-foreground">الموظفين</span>
          </div>
          <p className="text-2xl font-bold mt-2">{totalStaff}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {staff.filter(s => s.status === "active").length} نشط
          </p>
        </Card>
      </div>

      {/* Department Cards */}
      <div>
        <h2 className="text-xl font-bold mb-4">جميع الأقسام</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departmentStats.map((dept) => {
            const Icon = dept.icon;
            
            return (
              <Card 
                key={dept.key}
                className="p-5 hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => navigate(dept.path)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${dept.color.replace('text-', 'bg-').replace('-800', '-50')}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>

                <h3 className="font-semibold text-lg mb-3">{dept.name}</h3>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">الحالات النشطة</span>
                    <span className="font-bold text-primary">{dept.activeCases}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">الفريق</span>
                    <span className="font-semibold">{dept.staffCount} موظف</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full group-hover:bg-primary group-hover:text-white transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(dept.path);
                    }}
                  >
                    فتح القسم
                    <ArrowRight className="w-4 h-4 mr-2" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
