import React, { createContext, useContext, useEffect, useState } from "react";

export type Lang = "pt" | "en";

let apiLang: Lang = "pt";
export const getApiLang = () => apiLang;

type LanguageContextType = {
  lang: Lang;
  setLang: (lang: Lang) => void;
};

const LanguageContext = createContext<LanguageContextType>({
  lang: "pt",
  setLang: () => {},
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === "undefined") return "pt";
    const stored = localStorage.getItem("goat_lang");
    return stored === "en" ? "en" : "pt";
  });

  const setLang = (next: Lang) => {
    localStorage.setItem("goat_lang", next);
    setLangState(next);
  };

  useEffect(() => {
    apiLang = lang;
  }, [lang]);

  return <LanguageContext.Provider value={{ lang, setLang }}>{children}</LanguageContext.Provider>;
};
