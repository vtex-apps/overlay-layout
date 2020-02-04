declare module '*.css' {
  type CssFiles = Record<string, string | undefined>
  const CssObj: CssFiles
  export default CssObj
}
