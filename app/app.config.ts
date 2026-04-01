export default defineAppConfig({
  ui: {
    colors: {
      /** JK 区与 Nuxt 官网偏好的翠绿系；默认站仍可用 brand 变量做金色调 */
      primary: 'emerald',
      neutral: 'zinc',
    },
    button: {
      slots: {
        base: 'font-medium',
      },
    },
  },
})
