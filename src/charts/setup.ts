import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js'

// Chart.js is modular: register only the pieces we use, so the bundle stays
// smaller (no pie charts, radar charts, etc.). Imported once by ChartView.
Chart.register(BarController, BarElement, LineController, LineElement, PointElement, CategoryScale, LinearScale, Tooltip)

// Same font as the rest of the app (see --font in tokens.css).
Chart.defaults.font.family = getComputedStyle(document.documentElement).getPropertyValue('--font')
Chart.defaults.font.size = 12
