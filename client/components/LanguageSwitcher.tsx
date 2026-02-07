import { useTranslation } from "react-i18next";
import { Languages } from "lucide-react";

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  const isArabic = i18n.language === "ar";

  const toggleLanguage = () => {
    const newLang = isArabic ? "en" : "ar";
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium border border-border bg-background hover:bg-secondary transition-colors"
      title={t("common.language")}
    >
      <Languages className="w-4 h-4" />
      <span>{isArabic ? "EN" : "عربي"}</span>
    </button>
  );
}
