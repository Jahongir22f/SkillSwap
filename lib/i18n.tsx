"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'uz' | 'ru';

interface Translations {
  [key: string]: {
    [key in Language]: string;
  };
}

export const translations: Translations = {
  hero_title: {
    en: "Exchange Skills Without Paying Money",
    uz: "Pul to'lamasdan bilim almashing",
    ru: "Обменивайтесь навыками без денег"
  },
  hero_desc: {
    en: "Join the world's first credit-based barter platform for skills. Teach what you love, learn what you need.",
    uz: "Dunyo bo'ylab bilim almashish platformasiga qo'shiling. Sevgan narsangizni o'rgating, keraklisini o'rganing.",
    ru: "Присоединяйтесь к первой в мире кредитной бартерной платформе навыков. Учите тому, что любите, учитесь тому, что нужно."
  },
  get_started: {
    en: "Get Started Free",
    uz: "Bepul boshlash",
    ru: "Начать бесплатно"
  },
  how_it_works: {
    en: "How it Works",
    uz: "Qanday ishlaydi",
    ru: "Как это работает"
  },
  skills_offered: {
    en: "Skills I Offer",
    uz: "Men o'rgatadigan bilimlar",
    ru: "Навыки, которые я предлагаю"
  },
  skills_needed: {
    en: "Skills I Want",
    uz: "Men o'rganmoqchi bo'lgan bilimlar",
    ru: "Навыки, которые я ищу"
  }
};

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string) => {
    return translations[key]?.[language] || key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used within I18nProvider");
  return context;
};
