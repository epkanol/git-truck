import { Fragment } from "react"
import { useMetrics } from "~/contexts/MetricContext"
import { useOptions } from "~/contexts/OptionsContext"
import { LegendDot } from "./util"

interface AuthorDistFragProps {
  items: [string, number][]
  show: boolean
}

export function AuthorDistFragment(props: AuthorDistFragProps) {
  const [, authorColors] = useMetrics()
  const { metricType } = useOptions()

  if (!props.show) return null

  return (
    <>
      {props.items.map((legendItem) => {
        const [author, contrib] = legendItem
        const roundedContrib = Math.round(contrib * 100)
        const contribPercentage = roundedContrib === 0 ? "<1" : roundedContrib
        return (
          <Fragment key={author + contrib}>
            <div
              className="flex items-center gap-2 overflow-hidden overflow-ellipsis whitespace-pre text-sm font-semibold"
              title={author}
            >
              {metricType == "TOP_CONTRIBUTOR" ? (
                <LegendDot className="ml-1" dotColor={authorColors.get(author) ?? "white"} />
              ) : null}
              <span className="overflow-hidden overflow-ellipsis whitespace-pre font-bold opacity-70">{author}</span>
            </div>
            <p className="break-all text-right text-sm">{contribPercentage}%</p>
          </Fragment>
        )
      })}
    </>
  )
}
