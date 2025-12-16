/**
 * Stylelint 通用配置（CSS / SCSS / Vue）
 */
module.exports = {
  /**
   * 继承标准 SCSS 规则集
   */
  extends: ['stylelint-config-standard-scss'],

  /**
   * 默认使用 SCSS 解析器
   */
  customSyntax: 'postcss-scss',

  /**
   * 针对不同文件的解析处理
   */
  overrides: [
    {
      files: ['**/*.vue'],
      customSyntax: 'postcss-html',
    },
  ],

  /**
   * 忽略的文件
   */
  ignoreFiles: [
    '**/node_modules/**',
    '**/dist/**',
    '**/build/**',
    '**/coverage/**',
  ],

  /**
   * 规则配置
   */
  rules: {
    /* =========================
     * 基础风格
     * ========================= */

    indentation: 2,
    'string-quotes': 'single',
    'color-hex-case': 'lower',
    'number-leading-zero': 'always',
    'font-family-name-quotes': 'always-where-recommended',

    /* =========================
     * SCSS 相关
     * ========================= */

    // 使用 scss 规则替代 css 原生规则
    'at-rule-no-unknown': null,
    'scss/at-rule-no-unknown': true,

    // SCSS 变量命名规范
    'scss/dollar-variable-pattern': [
      '^[_a-z]+[a-z0-9-]*$',
      {
        message: 'SCSS 变量名请使用 kebab-case',
      },
    ],

    // 禁止不安全的 @extend
    'scss/at-extend-no-missing-placeholder': true,

    /* =========================
     * 选择器 / 可读性
     * ========================= */

    // 限制嵌套层级
    'max-nesting-depth': 4,

    // 禁止空块
    'block-no-empty': true,

    // 允许 Vue 深度选择器
    'selector-pseudo-element-no-unknown': [
      true,
      {
        ignorePseudoElements: ['v-deep', 'deep'],
      },
    ],

    // class 命名（可选 BEM，默认不强制）
    // 'selector-class-pattern': '^[a-z]([a-z0-9-]+)?(__[a-z0-9-]+)?(--[a-z0-9-]+)?$',

    /* =========================
     * 工程实践
     * ========================= */

    // 允许 !important（如需严格可改 true）
    'declaration-no-important': null,

    // 允许 calc 中的运算
    'function-calc-no-unspaced-operator': null,

    // 关闭兼容性限制（现代项目）
    'property-no-vendor-prefix': null,
    'value-no-vendor-prefix': null,
    'selector-no-vendor-prefix': null,
    'media-feature-name-no-vendor-prefix': null,
  },
}
