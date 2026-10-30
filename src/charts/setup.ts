import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  Filler,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js'

// Chart.js is modular: register only the pieces we use, so the bundle stays
// smaller (no pie charts, radar charts, etc.). Imported once by ChartView.
Chart.register(BarController, BarElement, LineController, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Filler)

// Same font as the rest of the app (see --font in tokens.css).
Chart.defaults.font.family = getComputedStyle(document.documentElement).getPropertyValue('--font')
Chart.defaults.font.size = 12

// Canvas text is drawn once; if Geist finishes loading after a chart has
// drawn, redraw every chart so axis labels switch to it as well.
document.fonts?.ready.then(() => {
  Object.values(Chart.instances).forEach((chart) => chart.update('none'))
})
