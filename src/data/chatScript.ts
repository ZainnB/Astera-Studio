import { categoryChart, regionMonthlyChart, varianceChart, yearTrendChart } from './selectors'
import type { ChartSpec, ChatMessage } from './types'

// The "AI" is a script: a few canned answers picked by keyword. Charts come
// from the same selectors as the dashboard, so the numbers match everywhere.
// Summaries were written by hand from those numbers.

export const starterQuestions = [
  'Which regions missed their sales target last quarter?',
  'How has revenue trended this year?',
  'Which product categories sell best?',
  'How did South do each month?',
]

type Reply = Omit<ChatMessage, 'id' | 'role'>

interface CannedAnswer {
  match: RegExp
  reply: () => Reply
}

// Checked in order; the first match wins. More specific patterns go first
// ("South … target" should get the South answer, not the all-regions one).
const answers: CannedAnswer[] = [
  {
    match: /south/i,
    reply: () => ({
      text: 'South met or beat its target in April and May, then fell behind from June. The gap widened in Q3: August was the weakest month at $294k against a $330k target.',
      chart: regionMonthlyChart('South'),
    }),
  },
  {
    match: /trend|over time|this year|growth|grow/i,
    reply: () => ({
      text: 'Revenue grew 21.5% from January ($1.44M) to September ($1.75M). It beat target every month from February to June, then fell just short in each Q3 month: $5.15M against $5.19M for the quarter (−0.8%).',
      chart: yearTrendChart(),
    }),
  },
  {
    match: /categor|product|sell|best/i,
    reply: () => ({
      text: 'Electronics led Q3 with $1.75M, about a third of all revenue, driven by East and North. Grocery is the smallest category overall but the biggest in Central (37% of its sales).',
      chart: { ...categoryChart({ range: 'last-quarter', region: 'All' }), title: 'Q3 2026: revenue by category' },
    }),
  },
  {
    match: /miss|target|behind|under|region/i,
    reply: () => ({
      text: 'Two regions missed their Q3 target: South (−9.6%) and West (−9.1%). North, East and Central beat theirs, with East strongest at +4.6%. Overall the company finished 0.8% below target.',
      chart: varianceChart(),
    }),
  },
]

// --- Follow-ups that change the previous chart ("ask the chat to change a chart")

type Change = 'line' | 'bar' | 'hbar' | 'sort'

const changes: { match: RegExp; change: Change }[] = [
  { match: /\bline\b/i, change: 'line' },
  { match: /horizontal/i, change: 'hbar' },
  { match: /\bbars?\b/i, change: 'bar' },
  { match: /sort|rank|highest|largest/i, change: 'sort' },
]

function applyChange(chart: ChartSpec, change: Change): ChartSpec | null {
  if (change === 'sort') {
    if (chart.timeSeries) return null // months have a natural order; sorting them makes no sense
    const order = chart.labels.map((_, i) => i).sort((a, b) => chart.datasets[0].data[b] - chart.datasets[0].data[a])
    return {
      ...chart,
      title: chart.title.endsWith('(sorted)') ? chart.title : `${chart.title} (sorted)`,
      labels: order.map((i) => chart.labels[i]),
      datasets: chart.datasets.map((d) => ({ ...d, data: order.map((i) => d.data[i]) })),
    }
  }
  // A line implies continuity, which only makes sense across time.
  if (change === 'line' && !chart.timeSeries) return null
  if (chart.kind === change) return null
  return { ...chart, kind: change }
}

/** The follow-up chips worth offering for a given chart. */
export function followUpsFor(chart: ChartSpec): string[] {
  if (chart.timeSeries) return [chart.kind === 'line' ? 'Show as bars' : 'Show as a line']
  return [chart.kind === 'hbar' ? 'Show as vertical bars' : 'Show as horizontal bars', 'Sort highest first']
}

/**
 * Decide the assistant's reply to `question`. `lastChart` is the chart in the
 * most recent answer, so "show as a line" knows what to change.
 */
export function replyTo(question: string, lastChart?: ChartSpec): Reply {
  // 1. A follow-up that modifies the previous chart?
  if (lastChart) {
    const found = changes.find((c) => c.match.test(question))
    if (found) {
      const changed = applyChange(lastChart, found.change)
      if (changed) {
        return { text: 'Here is the same data, redrawn.', chart: changed, suggestions: followUpsFor(changed) }
      }
      if (found.change === 'line') {
        return { text: "A line suggests a continuous change, but regions or categories aren't a sequence, so bars stay the honest choice here.", suggestions: followUpsFor(lastChart) }
      }
      if (found.change === 'sort' && lastChart.timeSeries) {
        return { text: 'Months already have a natural order, so I kept them in time order.', suggestions: followUpsFor(lastChart) }
      }
    }
  }

  // 2. One of the canned questions?
  const answer = answers.find((a) => a.match.test(question))
  if (answer) {
    const reply = answer.reply()
    return { ...reply, suggestions: reply.chart ? followUpsFor(reply.chart) : undefined }
  }

  // 3. Fallback: be honest and point to what works.
  return {
    text: "I can't answer that from the data in this demo yet. Here are questions I can answer:",
    suggestions: starterQuestions,
  }
}
