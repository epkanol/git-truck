import type { HierarchyRectangularNode } from "d3-hierarchy"
import { compare, valid, clean } from "semver"
import type { HydratedGitObject, HydratedGitTreeObject, HydratedGitBlobObject } from "./analyzer/model"

export function diagonal(d: HierarchyRectangularNode<unknown>) {
  const dx = d.x1 - d.x0
  const dy = d.y1 - d.y0

  return Math.sqrt(dx ** 2 + dy ** 2)
}

export function dateFormatLong(epochTime?: number) {
  if (!epochTime) return "Invalid date"
  return new Date(epochTime * 1000).toLocaleString("en-gb", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export function dateFormatShort(epochTime: number) {
  return new Date(epochTime).toLocaleString("da-dk", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  })
}

export function dateTimeFormatShort(epochTime: number) {
  return new Date(epochTime).toLocaleString("da-dk", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "short",
    year: "2-digit",
  })
}

export function dateFormatRelative(epochTime: number) {
  const now = Date.now()
  const hourMillis = 60 * 60 * 1000
  const dayMillis = 24 * hourMillis
  const difference = now - epochTime * 1000
  if (difference < 0) return "Unknown time ago"
  if (difference > dayMillis) {
    const days = Math.floor(difference / dayMillis)
    return `${days} day${days > 1 ? "s" : ""} ago`
  }
  const hours = Math.floor(difference / hourMillis)
  if (hours > 1) return `${hours} hours ago`
  if (hours === 1) return "1 hour ago"
  return "<1 hour ago"
}

export const last = <T>(arr: T[]) => arr[arr.length - 1]

export const allExceptLast = <T>(arr: T[]) => {
  if (arr.length <= 1) return []
  return arr.slice(0, arr.length - 1)
}

export const allExceptFirst = <T>(arr: T[]) => {
  if (arr.length <= 1) return []
  return arr.slice(1)
}

export function getSeparator(path: string) {
  if (path.includes("\\")) return "\\"
  return "/"
}

export const getPathFromRepoAndHead = (repo: string, branch: string) => [repo, encodeURIComponent(branch)].join("/")

export const branchCompare = (a: string, b: string): number => {
  const defaultBranchNames = ["main", "master"]

  if (defaultBranchNames.includes(a)) return -1
  if (defaultBranchNames.includes(b)) return 1

  return a.toLowerCase().localeCompare(b.toLowerCase())
}

export const semverCompare = (a: string, b: string): number => {
  const validA = valid(clean(a))
  const validB = valid(clean(b))

  if (!validA || !validB) {
    if (validA) return 1
    if (validB) return -1
    return a.toLowerCase().localeCompare(b.toLowerCase())
  }

  return compare(validA, validB)
}

const brightnessCalculationCache = new Map<`#${string}`, `#${string}`>()

function weightedDistanceIn3D(hex: `#${string}`) {
  const rgb = hexToRgb(hex)
  return Math.sqrt(Math.pow(rgb[0], 2) * 0.241 + Math.pow(rgb[1], 2) * 0.691 + Math.pow(rgb[2], 2) * 0.068)
}

function hexToRgb(hexString: `#${string}`) {
  const hex = hexString.replace("#", "")
  const c = hex.length === 3 ? hex.split("").map((x) => x + x) : hex.split("")
  const r = parseInt(c[0] + c[1], 16)
  const g = parseInt(c[2] + c[3], 16)
  const b = parseInt(c[4] + c[5], 16)
  return [r, g, b]
}

export const getTextColorFromBackground = (color: `#${string}`) => {
  // Verify that the color is a hex color
  if (!/^#([0-9A-F]{3}){1,2}$/i.test(color)) {
    return "#000000"
  }
  const cachedColor = brightnessCalculationCache.get(color)
  if (cachedColor) {
    return cachedColor
  }

  const brightness = weightedDistanceIn3D(color)
  const foreground = brightness > 186 ? "#000000" : "#ffffff"
  brightnessCalculationCache.set(color, foreground)

  return foreground
}

const colorCache = new Map<string, `#${string}`>()

export function hslToHex(h: number, s: number, ll: number): `#${string}` {
  const key = `${h},${s},${ll}`
  const cachedColor = colorCache.get(key)
  if (cachedColor) return cachedColor
  const l = ll / 100
  const a = (s * Math.min(l, 1 - l)) / 100
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0") // convert to Hex and prefix "0" if needed
  }

  const color = `#${f(0)}${f(8)}${f(4)}` as const
  colorCache.set(key, color)
  return color
}

export function getLightness(hex: `#${string}`): number {
  return weightedDistanceIn3D(hex) / 255
}

export const isTree = (d: HydratedGitObject | null = null): d is HydratedGitTreeObject => d?.type === "tree"
export const isBlob = (d: HydratedGitObject | null = null): d is HydratedGitBlobObject => d?.type === "blob"
