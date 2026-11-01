import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cohort } from "@/lib/cohort"

const ink = "oklch(0.42 0.05 168)"
const clay = "oklch(0.58 0.14 38)"
const grid = "oklch(0.88 0.02 85)"
const tick = "oklch(0.48 0.025 165)"

function HiddenTable({
  caption,
  columns,
  rows,
}: {
  caption: string
  columns: string[]
  rows: string[][]
}) {
  return (
    <table className="sr-only">
      <caption>{caption}</caption>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column} scope="col">
              {column}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.join("-")}>
            {row.map((cell, index) => (
              <td key={`${columns[index]}-${cell}`}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function ColumnChart({
  data,
  category,
  value,
  color,
  label,
}: {
  data: readonly { [key: string]: string | number }[]
  category: string
  value: string
  color: string
  label: string
}) {
  const width = 560
  const height = 248
  const pad = { top: 28, right: 12, bottom: 32, left: 36 }
  const numbers = data.map((row) => Number(row[value]))
  const max = Math.max(...numbers, 1)
  const innerW = width - pad.left - pad.right
  const innerH = height - pad.top - pad.bottom
  const slot = innerW / data.length
  const barW = Math.min(34, slot * 0.58)
  const ticks = [0, Math.round(max / 2), max]

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-64 w-full"
      role="img"
      aria-label={label}
    >
      {ticks.map((mark) => {
        const y = pad.top + innerH - (mark / max) * innerH
        return (
          <g key={mark}>
            <line
              x1={pad.left}
              x2={width - pad.right}
              y1={y}
              y2={y}
              stroke={grid}
            />
            <text
              x={pad.left - 8}
              y={y + 4}
              textAnchor="end"
              fontSize="12"
              fill={tick}
            >
              {mark}
            </text>
          </g>
        )
      })}
      {data.map((row, index) => {
        const amount = Number(row[value])
        const barH = (amount / max) * innerH
        const x = pad.left + index * slot + (slot - barW) / 2
        const y = pad.top + innerH - barH
        const name = String(row[category])
        return (
          <g key={name}>
            <rect x={x} y={y} width={barW} height={barH} rx="5" fill={color}>
              <title>{`${name}: ${amount}`}</title>
            </rect>
            <text
              x={x + barW / 2}
              y={y - 6}
              textAnchor="middle"
              fontSize="11"
              fill={tick}
            >
              {amount}
            </text>
            <text
              x={x + barW / 2}
              y={height - 10}
              textAnchor="middle"
              fontSize="12"
              fill={tick}
            >
              {name}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

function LabChart() {
  const width = 560
  const height = 248
  const pad = { top: 8, right: 48, bottom: 28, left: 78 }
  const innerW = width - pad.left - pad.right
  const rowH = (height - pad.top - pad.bottom) / cohort.labs.length

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-64 w-full"
      role="img"
      aria-label="Percent of encounters with a lab result"
    >
      {[0, 50, 100].map((mark) => {
        const x = pad.left + (mark / 100) * innerW
        return (
          <g key={mark}>
            <line
              x1={x}
              x2={x}
              y1={pad.top}
              y2={height - pad.bottom}
              stroke={grid}
            />
            <text
              x={x}
              y={height - 8}
              textAnchor="middle"
              fontSize="12"
              fill={tick}
            >
              {mark}%
            </text>
          </g>
        )
      })}
      {cohort.labs.map((row, index) => {
        const y = pad.top + index * rowH + rowH * 0.22
        const barH = rowH * 0.52
        const barW = (row.present / 100) * innerW
        return (
          <g key={row.panel}>
            <text
              x={pad.left - 10}
              y={y + barH * 0.72}
              textAnchor="end"
              fontSize="12"
              fill={tick}
            >
              {row.panel}
            </text>
            <rect
              x={pad.left}
              y={y}
              width={barW}
              height={barH}
              rx="4"
              fill={ink}
            >
              <title>{`${row.panel}: ${row.present}%`}</title>
            </rect>
            <text
              x={pad.left + barW + 6}
              y={y + barH * 0.72}
              fontSize="12"
              fill={tick}
            >
              {row.present}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

function VitalsChart() {
  const width = 560
  const height = 248
  const pad = { top: 16, right: 42, bottom: 48, left: 36 }
  const innerW = width - pad.left - pad.right
  const innerH = height - pad.top - pad.bottom
  const hrDomain = [70, 120] as const
  const spo2Domain = [90, 100] as const

  const xAt = (index: number) =>
    pad.left + (index / (cohort.vitals.length - 1)) * innerW
  const yAt = (value: number, domain: readonly [number, number]) => {
    const span = domain[1] - domain[0]
    return pad.top + innerH - ((value - domain[0]) / span) * innerH
  }
  const line = (
    key: "heartRate" | "spo2",
    domain: readonly [number, number]
  ) =>
    cohort.vitals
      .map((row, index) => `${xAt(index)},${yAt(row[key], domain)}`)
      .join(" ")

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-64 w-full"
      role="img"
      aria-label="Heart rate and oxygen saturation for sample stay S-1042"
    >
      {[70, 95, 120].map((mark) => {
        const y = yAt(mark, hrDomain)
        return (
          <g key={mark}>
            <line
              x1={pad.left}
              x2={width - pad.right}
              y1={y}
              y2={y}
              stroke={grid}
            />
            <text x={pad.left - 8} y={y + 4} textAnchor="end" fontSize="12" fill={tick}>
              {mark}
            </text>
          </g>
        )
      })}
      {[90, 100].map((mark) => (
        <text
          key={mark}
          x={width - pad.right + 8}
          y={yAt(mark, spo2Domain) + 4}
          fontSize="12"
          fill={clay}
        >
          {mark}
        </text>
      ))}
      <polyline
        fill="none"
        stroke={ink}
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        points={line("heartRate", hrDomain)}
      />
      <polyline
        fill="none"
        stroke={clay}
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        points={line("spo2", spo2Domain)}
      />
      {cohort.vitals.map((row, index) => (
        <g key={row.hour}>
          <circle cx={xAt(index)} cy={yAt(row.heartRate, hrDomain)} r="3.5" fill={ink}>
            <title>{`${row.hour}: heart rate ${row.heartRate} bpm, SpO2 ${row.spo2}%`}</title>
          </circle>
          <circle cx={xAt(index)} cy={yAt(row.spo2, spo2Domain)} r="3.5" fill={clay} />
          <text
            x={xAt(index)}
            y={height - 28}
            textAnchor="middle"
            fontSize="12"
            fill={tick}
          >
            {row.hour}
          </text>
        </g>
      ))}
      <line x1={pad.left} x2={pad.left + 18} y1={height - 10} y2={height - 10} stroke={ink} strokeWidth="2.5" />
      <text x={pad.left + 24} y={height - 6} fontSize="12" fill={tick}>
        Heart rate (bpm)
      </text>
      <line x1={210} x2={228} y1={height - 10} y2={height - 10} stroke={clay} strokeWidth="2.5" />
      <text x={234} y={height - 6} fontSize="12" fill={tick}>
        SpO2 (%)
      </text>
    </svg>
  )
}

export function CohortCharts() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Admissions by weekday</CardTitle>
          <CardDescription>
            How the {cohort.encounters} sample encounters fall across the week.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ColumnChart
            data={cohort.admissions}
            category="day"
            value="admissions"
            color={ink}
            label="Sample admissions by weekday"
          />
          <p className="mt-3 text-xs leading-5 text-muted-foreground">
            Thursday is the busiest day in the sample. Sunday is the quiet one.
          </p>
          <HiddenTable
            caption="Sample admissions by weekday"
            columns={["Day", "Admissions"]}
            rows={cohort.admissions.map((row) => [row.day, String(row.admissions)])}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Length of stay</CardTitle>
          <CardDescription>
            Stays grouped in days. The median sits in the 2–3 day group.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ColumnChart
            data={cohort.lengthOfStay}
            category="bucket"
            value="stays"
            color={clay}
            label="Sample length of stay in days"
          />
          <p className="mt-3 text-xs leading-5 text-muted-foreground">
            Axis units are days. Ten stays run past a week.
          </p>
          <HiddenTable
            caption="Sample length of stay in days"
            columns={["Days", "Stays"]}
            rows={cohort.lengthOfStay.map((row) => [row.bucket, String(row.stays)])}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>One overnight stay</CardTitle>
          <CardDescription>
            Heart rate and oxygen saturation for sample stay S-1042. Separate axes, on purpose.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VitalsChart />
          <p className="mt-3 text-xs leading-5 text-muted-foreground">
            SpO2 keeps its own axis so a reading of 94% is not drawn on the same scale as heart rate.
          </p>
          <HiddenTable
            caption="Sample vitals for stay S-1042"
            columns={["Hour", "Heart rate (bpm)", "SpO2 (%)"]}
            rows={cohort.vitals.map((row) => [
              row.hour,
              String(row.heartRate),
              String(row.spo2),
            ])}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Labs with a result</CardTitle>
          <CardDescription>
            Share of encounters where the panel has a value. Lactate matches the {cohort.missingLactate} blanks above.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LabChart />
          <p className="mt-3 text-xs leading-5 text-muted-foreground">
            A culture is missing more often than a blood count. That is a property of the sample, not a target to impute away.
          </p>
          <HiddenTable
            caption="Percent of sample encounters with a lab result"
            columns={["Panel", "Percent with a result"]}
            rows={cohort.labs.map((row) => [row.panel, `${row.present}%`])}
          />
        </CardContent>
      </Card>
    </div>
  )
}
