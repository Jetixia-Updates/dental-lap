import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useLabContext } from "@/contexts/LabContext";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  Plus,
  AlertCircle,
  CheckCircle,
  Upload,
} from "lucide-react";
import {
  CaseCategory,
  ImpressionType,
  CaseClassification,
  ImplantType,
  FixedMaterial,
  RemovableSubType,
  NightGuardType,
  OrthodonticsType,
  FIXED_MATERIAL_NAMES,
  REMOVABLE_SUBTYPE_NAMES,
  ORTHODONTICS_TYPE_NAMES,
  IMPLANT_TYPE_NAMES,
} from "@shared/api";

export default function NewCase() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { addCase, addAttachment } = useLabContext();

  // Basic fields
  const [doctorName, setDoctorName] = useState("");
  const [patientName, setPatientName] = useState("");
  const [toothNumbers, setToothNumbers] = useState("");
  const [shade, setShade] = useState("");
  const [priority, setPriority] = useState<"normal" | "rush" | "emergency">("normal");
  const [dueDate, setDueDate] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");

  // Category
  const [category, setCategory] = useState<CaseCategory>("fixed");

  // Fixed fields
  const [impressionType, setImpressionType] = useState<ImpressionType>("physical_impression");
  const [classification, setClassification] = useState<CaseClassification>("normal");
  const [implantType, setImplantType] = useState<ImplantType>("open_tray");
  const [fixedMaterial, setFixedMaterial] = useState<FixedMaterial>("zirconia_monolithic");

  // Removable fields
  const [removableSubType, setRemovableSubType] = useState<RemovableSubType>("full_denture");
  const [nightGuardType, setNightGuardType] = useState<NightGuardType>("soft");
  const [nightGuardSize, setNightGuardSize] = useState<number>(3);
  const [addToothCount, setAddToothCount] = useState<number>(1);

  // Orthodontics fields
  const [orthodonticsType, setOrthodonticsType] = useState<OrthodonticsType>("twin_block");

  // Custom product
  const [isCustomProduct, setIsCustomProduct] = useState(false);
  const [customProductName, setCustomProductName] = useState("");
  const [customSteps, setCustomSteps] = useState<string[]>([""]);

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  // File upload state
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; url: string }[]>([]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!doctorName.trim()) newErrors.doctorName = t("newCase.doctorRequired");
    if (!patientName.trim()) newErrors.patientName = t("newCase.patientRequired");
    if (!dueDate) newErrors.dueDate = t("newCase.dueDateRequired");

    if (category === "fixed") {
      if (!toothNumbers.trim()) newErrors.toothNumbers = t("newCase.toothRequired");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      const newCase = await addCase({
        doctorName,
        patientName,
        toothNumbers,
        shade,
        priority,
        dueDate,
        specialInstructions,
        category,
        impressionType: category === "fixed" ? impressionType : undefined,
        classification: category === "fixed" ? classification : undefined,
        implantType: category === "fixed" && classification === "implant" ? implantType : undefined,
        fixedMaterial: category === "fixed" ? fixedMaterial : undefined,
        removableSubType: category === "removable" ? removableSubType : undefined,
        nightGuardType: category === "removable" && removableSubType === "night_guard" ? nightGuardType : undefined,
        nightGuardSize: category === "removable" && removableSubType === "night_guard" ? nightGuardSize : undefined,
        addToothCount: category === "removable" && removableSubType === "add_tooth" ? addToothCount : undefined,
        orthodonticsType: category === "orthodontics" ? orthodonticsType : undefined,
        isCustomProduct,
        customProductName: isCustomProduct ? customProductName : undefined,
        customProductSteps: isCustomProduct ? customSteps.filter((s) => s.trim()) : undefined,
      });

      // Add uploaded files as attachments
      uploadedFiles.forEach((file) => {
        addAttachment(newCase.id, {
          name: file.name,
          url: file.url,
          type: "image",
          uploadedAt: new Date().toISOString(),
          uploadedBy: "current_user",
        });
      });

      navigate(`/cases/${newCase.id}`);
    } catch (err) {
      console.error("Failed to create case:", err);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newFiles = Array.from(files).map((f) => ({
      name: f.name,
      url: URL.createObjectURL(f),
    }));
    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const addCustomStep = () => setCustomSteps((prev) => [...prev, ""]);
  const removeCustomStep = (idx: number) =>
    setCustomSteps((prev) => prev.filter((_, i) => i !== idx));
  const updateCustomStep = (idx: number, value: string) =>
    setCustomSteps((prev) => prev.map((s, i) => (i === idx ? value : s)));

  return (
    <Layout>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-secondary rounded-md transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("newCase.title")}</h1>
          <p className="text-muted-foreground text-sm">{t("newCase.subtitle")}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Category Selection */}
        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">{t("newCase.categoryTitle")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(
              [
                { value: "fixed", label: t("newCase.fixed"), desc: t("newCase.fixedDesc") },
                { value: "removable", label: t("newCase.removable"), desc: t("newCase.removableDesc") },
                { value: "orthodontics", label: t("newCase.orthodontics"), desc: t("newCase.orthodonticsDesc") },
              ] as const
            ).map((cat) => (
              <button
                key={cat.value}
                onClick={() => {
                  setCategory(cat.value);
                  setIsCustomProduct(false);
                }}
                className={`p-4 rounded-lg border-2 text-right transition-all ${
                  category === cat.value
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <p className="font-semibold text-foreground">{cat.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{cat.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Product Toggle */}
        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <input
              type="checkbox"
              id="customProduct"
              checked={isCustomProduct}
              onChange={(e) => setIsCustomProduct(e.target.checked)}
              className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
            />
            <label htmlFor="customProduct" className="font-semibold text-foreground">
              {t("newCase.customProduct")}
            </label>
          </div>

          {isCustomProduct && (
            <div className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  {t("newCase.customProductName")}
                </label>
                <input
                  type="text"
                  value={customProductName}
                  onChange={(e) => setCustomProductName(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t("newCase.customSteps")}
                </label>
                {customSteps.map((step, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <span className="flex items-center justify-center w-8 h-10 text-sm font-bold text-muted-foreground">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={step}
                      onChange={(e) => updateCustomStep(idx, e.target.value)}
                      placeholder={t("newCase.stepPlaceholder")}
                      className="flex-1 px-3 py-2 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {customSteps.length > 1 && (
                      <button
                        onClick={() => removeCustomStep(idx)}
                        className="px-2 text-red-500 hover:bg-red-50 rounded"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addCustomStep}>
                  <Plus className="w-4 h-4 mr-1" />
                  {t("newCase.addStep")}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Basic Information */}
        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">{t("newCase.basicInfo")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                {t("newCase.doctorName")} *
              </label>
              <input
                type="text"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                className={`w-full px-3 py-2 rounded-md border ${
                  errors.doctorName ? "border-red-500" : "border-border"
                } bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary`}
              />
              {errors.doctorName && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.doctorName}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                {t("newCase.patientName")} *
              </label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className={`w-full px-3 py-2 rounded-md border ${
                  errors.patientName ? "border-red-500" : "border-border"
                } bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary`}
              />
              {errors.patientName && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.patientName}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                {t("newCase.toothNumbers")}
                {category === "fixed" && " *"}
              </label>
              <input
                type="text"
                value={toothNumbers}
                onChange={(e) => setToothNumbers(e.target.value)}
                placeholder="14, 15"
                className={`w-full px-3 py-2 rounded-md border ${
                  errors.toothNumbers ? "border-red-500" : "border-border"
                } bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary`}
              />
              {errors.toothNumbers && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.toothNumbers}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                {t("newCase.shade")}
              </label>
              <input
                type="text"
                value={shade}
                onChange={(e) => setShade(e.target.value)}
                placeholder="A2"
                className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                {t("newCase.priority")}
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="normal">{t("newCase.priorityNormal")}</option>
                <option value="rush">{t("newCase.priorityRush")}</option>
                <option value="emergency">{t("newCase.priorityEmergency")}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                {t("newCase.dueDate")} *
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={`w-full px-3 py-2 rounded-md border ${
                  errors.dueDate ? "border-red-500" : "border-border"
                } bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary`}
              />
              {errors.dueDate && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.dueDate}
                </p>
              )}
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-foreground mb-1">
              {t("newCase.specialInstructions")}
            </label>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>
        </div>

        {/* Fixed-specific options */}
        {category === "fixed" && !isCustomProduct && (
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-lg font-bold text-foreground mb-4">{t("newCase.fixedOptions")}</h2>

            {/* Impression Type */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-foreground mb-2">
                {t("newCase.impressionType")}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setImpressionType("physical_impression")}
                  className={`p-3 rounded-lg border-2 text-center transition-all ${
                    impressionType === "physical_impression"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <p className="font-medium text-foreground text-sm">
                    {t("newCase.physicalImpression")}
                  </p>
                </button>
                <button
                  onClick={() => setImpressionType("intraoral_scan")}
                  className={`p-3 rounded-lg border-2 text-center transition-all ${
                    impressionType === "intraoral_scan"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <p className="font-medium text-foreground text-sm">
                    {t("newCase.intraoralScan")}
                  </p>
                </button>
              </div>
              {impressionType === "intraoral_scan" && (
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-sm text-blue-700 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    {t("newCase.intraoralScanNote")}
                  </p>
                </div>
              )}
            </div>

            {/* Classification */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-foreground mb-2">
                {t("newCase.classification")}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setClassification("normal")}
                  className={`p-3 rounded-lg border-2 text-center transition-all ${
                    classification === "normal"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <p className="font-medium text-foreground text-sm">
                    {t("newCase.normalCase")}
                  </p>
                </button>
                <button
                  onClick={() => setClassification("implant")}
                  className={`p-3 rounded-lg border-2 text-center transition-all ${
                    classification === "implant"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <p className="font-medium text-foreground text-sm">
                    {t("newCase.implantCase")}
                  </p>
                </button>
              </div>
            </div>

            {/* Implant Type (shown only for implant) */}
            {classification === "implant" && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t("newCase.implantType")}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {(Object.entries(IMPLANT_TYPE_NAMES) as [ImplantType, string][]).map(
                    ([value, label]) => (
                      <button
                        key={value}
                        onClick={() => setImplantType(value)}
                        className={`p-3 rounded-lg border-2 text-center transition-all ${
                          implantType === value
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <p className="font-medium text-foreground text-sm">{label}</p>
                      </button>
                    )
                  )}
                </div>
                <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
                  <p className="text-sm text-amber-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {t("newCase.implantNote")}
                  </p>
                </div>
              </div>
            )}

            {/* Material */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t("newCase.material")}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {(Object.entries(FIXED_MATERIAL_NAMES) as [FixedMaterial, string][]).map(
                  ([value, label]) => (
                    <button
                      key={value}
                      onClick={() => setFixedMaterial(value)}
                      className={`p-3 rounded-lg border-2 text-center transition-all ${
                        fixedMaterial === value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <p className="font-medium text-foreground text-sm">{label}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {getMaterialInfo(value)}
                      </p>
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        )}

        {/* Removable-specific options */}
        {category === "removable" && !isCustomProduct && (
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-lg font-bold text-foreground mb-4">{t("newCase.removableOptions")}</h2>

            {/* Sub-type */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-foreground mb-2">
                {t("newCase.removableType")}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {(Object.entries(REMOVABLE_SUBTYPE_NAMES) as [RemovableSubType, string][]).map(
                  ([value, label]) => (
                    <button
                      key={value}
                      onClick={() => setRemovableSubType(value)}
                      className={`p-3 rounded-lg border-2 text-center transition-all ${
                        removableSubType === value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <p className="font-medium text-foreground text-sm">{label}</p>
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Night Guard options */}
            {removableSubType === "night_guard" && (
              <div className="space-y-4 p-4 bg-secondary/30 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t("newCase.nightGuardType")}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setNightGuardType("soft")}
                      className={`p-3 rounded-lg border-2 text-center transition-all ${
                        nightGuardType === "soft"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <p className="font-medium text-foreground text-sm">Soft</p>
                    </button>
                    <button
                      onClick={() => setNightGuardType("hard")}
                      className={`p-3 rounded-lg border-2 text-center transition-all ${
                        nightGuardType === "hard"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <p className="font-medium text-foreground text-sm">Hard</p>
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    {t("newCase.nightGuardSize")} (mm)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={nightGuardSize}
                    onChange={(e) => setNightGuardSize(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            )}

            {/* Add tooth count */}
            {removableSubType === "add_tooth" && (
              <div className="p-4 bg-secondary/30 rounded-lg">
                <label className="block text-sm font-medium text-foreground mb-1">
                  {t("newCase.addToothCount")}
                </label>
                <input
                  type="number"
                  min={1}
                  max={32}
                  value={addToothCount}
                  onChange={(e) => setAddToothCount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            )}
          </div>
        )}

        {/* Orthodontics-specific options */}
        {category === "orthodontics" && !isCustomProduct && (
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-lg font-bold text-foreground mb-4">{t("newCase.orthodonticsOptions")}</h2>
            <div className="grid grid-cols-2 gap-3">
              {(Object.entries(ORTHODONTICS_TYPE_NAMES) as [OrthodonticsType, string][]).map(
                ([value, label]) => (
                  <button
                    key={value}
                    onClick={() => setOrthodonticsType(value)}
                    className={`p-4 rounded-lg border-2 text-center transition-all ${
                      orthodonticsType === value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <p className="font-medium text-foreground">{label}</p>
                  </button>
                )
              )}
            </div>
          </div>
        )}

        {/* File Upload */}
        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">{t("newCase.attachments")}</h2>
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
            <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground mb-3">{t("newCase.uploadDescription")}</p>
            <label className="cursor-pointer">
              <Button variant="outline" size="sm" asChild>
                <span>{t("newCase.chooseFiles")}</span>
              </Button>
              <input
                type="file"
                multiple
                accept="image/*,.pdf,.stl"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="mt-4 space-y-2">
              {uploadedFiles.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-secondary/30 rounded-md"
                >
                  <span className="text-sm text-foreground">{file.name}</span>
                  <button
                    onClick={() =>
                      setUploadedFiles((prev) => prev.filter((_, i) => i !== idx))
                    }
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    {t("common.delete")}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex gap-3 justify-end pb-8">
          <Button variant="outline" onClick={() => navigate(-1)}>
            {t("common.cancel")}
          </Button>
          <Button onClick={handleSubmit}>
            <Plus className="w-4 h-4 mr-2" />
            {t("newCase.createCase")}
          </Button>
        </div>
      </div>
    </Layout>
  );
}

/** Helper: get short material info */
function getMaterialInfo(material: FixedMaterial): string {
  const needsBuildUp = [
    "zirconia_cutback",
    "zirconia_on_bar",
    "emax_cutback",
    "pfm",
  ].includes(material);

  const noBuildUp = [
    "zirconia_monolithic",
    "zirconia_on_implant",
    "emax_full",
  ].includes(material);

  const noBuildUpNoFiring = ["pmma_temporary", "pmma_milling"].includes(material);

  if (noBuildUpNoFiring) return "بدون حرق وبدون Build Up";
  if (needsBuildUp) return "Build Up إلزامي";
  if (noBuildUp) return "بدون Build Up";
  return "";
}
