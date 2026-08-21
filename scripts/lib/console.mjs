const useColor = process.env.NO_COLOR === undefined && process.env.TERM !== 'dumb'

function wrap(code, text) {
  return useColor ? `\u001b[${code}m${text}\u001b[0m` : text
}

export const color = {
  red: (text) => wrap('31', text),
  green: (text) => wrap('32', text),
  yellow: (text) => wrap('33', text),
  blue: (text) => wrap('34', text),
  magenta: (text) => wrap('35', text),
  cyan: (text) => wrap('36', text),
  gray: (text) => wrap('90', text),
  bold: (text) => wrap('1', text),
}

export const symbol = {
  pass: color.green('PASS'),
  fail: color.red('FAIL'),
  warn: color.yellow('WARN'),
  info: color.blue('INFO'),
}

export function heading(text) {
  console.log('')
  console.log(color.bold(text))
  console.log(color.gray('-'.repeat(text.length)))
}

export function bullet(text) {
  console.log(`  ${color.gray('•')} ${text}`)
}

/**
 * GitHub Actions renders these as inline annotations on the pull request diff,
 * which is how participants see a failure without opening the raw log.
 */
export function annotate(level, { file, line, message }) {
  if (!process.env.GITHUB_ACTIONS) return
  const location = [file ? `file=${file}` : null, line ? `line=${line}` : null]
    .filter(Boolean)
    .join(',')
  console.log(`::${level} ${location}::${message.replace(/\n/g, '%0A')}`)
}
