// @ts-check

import eslint from '@eslint/js';
import ts from 'typescript';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier'


export default tseslint.config({
  languageOptions : {
    parserOptions : {
      project : true , 
      tsconfigRootDir : import.meta.dirname
    }
  },
  files : ["**/*.ts"],
  extends : [
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    eslintConfigPrettier
  ],
  rules : {
    // "no-console" : "error",
    "no-useless-catch" : 0,
    quotes : ["error","single",{allowTemplateLiterals : true}]
  }
})

