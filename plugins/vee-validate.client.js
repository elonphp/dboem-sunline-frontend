import { defineRule } from "vee-validate";
import * as AllRules from "@vee-validate/rules";
Object.keys(AllRules).forEach((rule) => {
  defineRule(rule, AllRules[rule]);
});

import { configure } from "vee-validate";
import { localize, setLocale } from "@vee-validate/i18n";
import zhTW from "@vee-validate/i18n/dist/locale/zh_TW.json";
import en from "@vee-validate/i18n/dist/locale/en.json";

const zh_Hant = zhTW

// 配置訊息
// configure({
//   generateMessage: localize({ zh_TW: zhTW }),
// });
// localize("zh_TW", {
//   messages: {
//     required:"此欄位為必填",
//     email:"電子信箱格式錯誤"
//   },
// });

configure({
  generateMessage: localize({
    zh_Hant: {
      ...zh_Hant,
      messages: {
        ...zh_Hant.messages,
        required: "此欄位為必填",
        email: "電子信箱格式錯誤"
      }
    },
    en: {
      ...en,
      messages: {
        ...en.messages,
        required: "This field is required",
        email: "This is not a valid email"
      }
    }
  }),
});

setLocale("zh_Hant");

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('setValidationLocale', setLocale);
});
