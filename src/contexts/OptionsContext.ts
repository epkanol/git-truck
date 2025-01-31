import { createContext, useContext } from "react"
import type { AuthorshipType, MetricType } from "../metrics/metrics"
import { Authorship, Metric } from "../metrics/metrics"

export const Chart = {
  BUBBLE_CHART: "Bubble chart",
  TREE_MAP: "Tree map",
}

export type ChartType = keyof typeof Chart

export type Options = {
  metricType: MetricType
  chartType: ChartType
  authorshipType: AuthorshipType
  transitionsEnabled: boolean
  labelsVisible: boolean
}

export type OptionsContextType = Options & {
  setMetricType: (metricType: MetricType) => void
  setChartType: (chartType: ChartType) => void
  setAuthorshipType: (authorshipType: AuthorshipType) => void
  setTransitionsEnabled: (transitionsEnabled: boolean) => void
  setLabelsVisible: (labelsVisible: boolean) => void
}

export const OptionsContext = createContext<OptionsContextType | undefined>(undefined)

export function useOptions() {
  const context = useContext(OptionsContext)
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider")
  }
  return context
}

const defaultOptions: Options = {
  metricType: Object.keys(Metric)[0] as MetricType,
  chartType: Object.keys(Chart)[0] as ChartType,
  authorshipType: Object.keys(Authorship)[0] as AuthorshipType,
  transitionsEnabled: true,
  labelsVisible: true,
}

export function getDefaultOptionsContextValue(savedOptions: Partial<Options> = {}): OptionsContextType {
  return {
    ...defaultOptions,
    ...savedOptions,
    setChartType: () => {
      throw new Error("No chartTypeSetter provided")
    },
    setMetricType: () => {
      throw new Error("No metricTypeSetter provided")
    },
    setAuthorshipType: () => {
      throw new Error("No AuthorshipTypeSetter provided")
    },
    setTransitionsEnabled: () => {
      throw new Error("No transitionsEnabledSetter provided")
    },
    setLabelsVisible: () => {
      throw new Error("No labelsVisibleSetter provided")
    },
  }
}
