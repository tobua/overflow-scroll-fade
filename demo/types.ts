declare module '*.png' {
  const value: string
  // biome-ignore lint/style/noDefaultExport: Requires default export.
  // biome-ignore lint/correctness/noUndeclaredVariables: This is a type definition.
  export default value
}
