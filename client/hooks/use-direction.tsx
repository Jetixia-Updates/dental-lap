import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export function useDirection() {
  const { i18n } = useTranslation();

  useEffect(() => {
    // Set initial direction and language attributes
    const setDirectionAndLang = () => {
      const dir = i18n.language === "ar" ? "rtl" : "ltr";
      document.documentElement.setAttribute("dir", dir);
      document.documentElement.setAttribute("lang", i18n.language);
      
      // Add a class to body for easier CSS targeting
      document.body.classList.toggle("rtl", i18n.language === "ar");
      document.body.classList.toggle("ltr", i18n.language !== "ar");
    };

    // Set initial direction
    setDirectionAndLang();

    // Listen for language changes
    i18n.on("languageChanged", setDirectionAndLang);

    // Cleanup
    return () => {
      i18n.off("languageChanged", setDirectionAndLang);
    };
  }, [i18n]);

  return {
    isRTL: i18n.language === "ar",
    direction: i18n.language === "ar" ? "rtl" : "ltr",
    language: i18n.language
  };
}