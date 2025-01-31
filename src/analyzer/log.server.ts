export enum LOG_LEVEL {
  SILENT,
  ERROR,
  WARN,
  INFO,
  DEBUG,
}
export enum LOG_LEVEL_LABEL {
  SILENT = "",
  ERROR = "ERR",
  WARN = "WRN",
  INFO = "NFO",
  DEBUG = "DBG",
}

const stringToLevelMap: Record<string, LOG_LEVEL> = {
  SILENT: LOG_LEVEL.SILENT,
  ERROR: LOG_LEVEL.ERROR,
  WARN: LOG_LEVEL.WARN,
  INFO: LOG_LEVEL.INFO,
  DEBUG: LOG_LEVEL.DEBUG,
}

const { ERROR, WARN, INFO, DEBUG } = LOG_LEVEL_LABEL

function setIntialLogLevel() {
  if (typeof process.env.LOG_LEVEL === "string") return stringToLevelMap[process.env.LOG_LEVEL.toUpperCase()]
  if (typeof process.env.LOG_LEVEL === "number") return process.env.LOG_LEVEL
  return null
}

let logLevel = setIntialLogLevel()

export const getLogLevel = () => logLevel

export function setLogLevel(level: string) {
  const newLevel = stringToLevelMap[level.trim().toUpperCase()]
  if (typeof newLevel === "undefined") {
    throw new Error(`Invalid log level: ${level}`)
  }
  logLevel = newLevel
}

export function error(message: Error | unknown) {
  if (logLevel === null) return
  if (logLevel >= LOG_LEVEL.ERROR) {
    const messageString =
      message instanceof Error ? `${prefix(ERROR)}${message.message}\n${message.stack}` : `${prefix(ERROR)}${message}`
    console.error(messageString)
  }
}

export function warn(message: unknown) {
  if (logLevel === null) return
  if (logLevel >= LOG_LEVEL.WARN) {
    const messageString = `${prefix(WARN)}${message}`
    console.warn(messageString)
  }
}

export function info(message: unknown) {
  if (logLevel === null) return
  if (logLevel >= LOG_LEVEL.INFO) {
    const messageString = `${prefix(INFO)}${message}`
    console.info(messageString)
  }
}

export function debug(message: unknown) {
  if (logLevel === null) return
  if (logLevel >= LOG_LEVEL.DEBUG) {
    const messageString = `${prefix(DEBUG)}${message}`
    console.debug(messageString)
  }
}

export function raw(message: unknown) {
  if (logLevel === null) return
  if (logLevel >= LOG_LEVEL.INFO) {
    console.info(message)
  }
}

function prefix(label: LOG_LEVEL_LABEL): string {
  return `[${label}] `
}

export const log = {
  error,
  warn,
  info,
  debug,
  raw,
}
