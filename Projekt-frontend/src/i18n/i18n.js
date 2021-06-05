import en from "./en.json";
import sl from "./sl.json";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
    resources: {
        "en": {
            translation: en,
        },
        "sl": {
            translation: sl,
        },
    },
    lng: "sl",
    supportedLngs: ["en", "sl"],
    fallbackLng: "en",
});

export default i18n;
