import { useLabContext } from "@/contexts/LabContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Inbox, Clipboard, Scan, Monitor, Cog, Palette, Award, Truck,
  ArrowRight, Users, Clock, TrendingUp
} from "lucide-react";

const DEPARTMENT_CONFIG = {
  "reception": { 
    name: "الاستقبال", 
    icon: Inbox, 
    color: "bg-blue-100 text-blue-800",
    path: "/departments/reception"
  },
  "case-planning": { 
    name: "التخطيط", 
    icon: Clipboard, 
    color: "bg-purple-100 text-purple-800",
    path: "/departments/case-planning"
  },
  "model-scan": { 
    name: "المسح", 
    icon: Scan, 
    color: "bg-cyan-100 text-cyan-800",
    path: "/departments/model-scan"
  },
  "cad-design": { 
    name: "التصميم", 
    icon: Monitor, 
    color: "bg-indigo-100 text-indigo-800",
    path: "/departments/cad-design"
  },
  "cam-production": { 
    name: "الإنتاج", 
    icon: Cog, 
    color: "bg-orange-100 text-orange-800",
    path: "/departments/cam-production"
  },
  "finishing": { 
    name: "التشطيب", 
    icon: Palette, 
    color: "bg-pink-100 text-pink-800",
    path: "/departments/finishing"
  },
  "quality-control": { 
    name: "الجودة", 
    icon: Award, 
    color: "bg-green-100 text-green-800",
    path: "/quality-control"
  },
  "logistics": { 
    name: "التوصيل", 
    icon: Truck, 
    color: "bg-amber-100 text-amber-800",
    path: "/departments/logistics"
  }
};

export default function AllDepartmentsOverview() {
  const { cases, staff } = useLabContext();
  const navigate = useNavigate();

  // Calculate department stats
  const departmentStats = Object.entries(DEPARTMENT_CONFIG).map(([key, config]) => {
    const deptCases = cases.filter(c => c.currentDepartment === key);
    const deptStaff = staff.filter(s => s.department === key);
    const avgEfficiency = deptStaff.length > 0
      ? Math.round(deptStaff.reduce((sum, s) => sum + s.performance, 0) / deptStaff.length)
      : 0;

    return {
      key,
      ...config,
      activeCases: deptCases.length,
      staff: deptStaff.length,
      efficiency: avgEfficiency
    };
  });

  // Calculate overall stats
  const totalCases = cases.length;
  const totalStaff = staff.length;
  const avgPerformance = staff.length > 0
    ? Math.round(staff.reduce((sum, s) => sum + s.performance, 0) / staff.length)
    : 0;
  const activeStaff = staff.filter(s => s.status === "active").length;

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
            <Users className="w-5 h-5" />
            <span className="text-sm text-muted-foreground">الموظفين</span>
          </div>
          <p className="text-2xl font-bold mt-2">{totalStaff}</p>
          <p className="text-xs text-muted-foreground mt-1">{activeStaff} نشط الآن</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 text-purple-600">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm text-muted-foreground">الأداء العام</span>
          </div>
          <p className="text-2xl font-bold mt-2">{avgPerformance}%</p>
          <p className="text-xs text-green-600 mt-1">↑ 3% عن الأسبوع الماضي</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 text-amber-600">
            <Clock className="w-5 h-5" />
            <span className="text-sm text-muted-foreground">متوسط الوقت</span>
          </div>
          <p className="text-2xl font-bold mt-2">2.8</p>
          <p className="text-xs text-muted-foreground mt-1">يوم لكل حالة</p>
        </Card>
      </div>

      {/* Department Cards */}
      <div>
        <h2 className="text-xl font-bold mb-4">جميع الأقسام</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                    <span className="font-semibold">{dept.staff} موظف</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">الكفاءة</span>
                    <Badge variant="outline" className={
                      dept.efficiency >= 90 ? "bg-green-50 text-green-700 border-green-200" :
                      dept.efficiency >= 75 ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                      "bg-red-50 text-red-700 border-red-200"
                    }>
                      {dept.efficiency}%
                    </Badge>
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

      {/* Cases by Department */}
      <div>
        <h2 className="text-xl font-bold mb-4">توزيع الحالات حسب القسم</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {departmentStats.map((dept) => {
            if (dept.activeCases === 0) return null;
            
            return (
              <div 
                key={dept.key}
                className="flex items-center gap-3 p-3 bg-card border rounded-lg hover:border-primary transition-colors cursor-pointer"
                onClick={() => navigate(dept.path)}
              >
                <div className={`p-2 rounded ${dept.color.replace('text-', 'bg-').replace('-800', '-50')}`}>
                  <dept.icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{dept.name}</p>
                  <p className="text-xs text-muted-foreground">{dept.activeCases} حالة</p>
                </div>
                <Badge>{dept.activeCases}</Badge>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
