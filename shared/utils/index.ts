export function capitalizeLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function generateTradeNo() {
  return (
    Date.now().toString() +
    Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, '0')
  )
}
