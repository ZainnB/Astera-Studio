import { HashRouter, Navigate, Route, Routes } from 'react-router'
import AppShell from './components/AppShell'
import ChatScreen from './screens/ChatScreen'
import DashboardScreen from './screens/DashboardScreen'
import PipelineDetailScreen from './screens/PipelineDetailScreen'
import PipelinesScreen from './screens/PipelinesScreen'
import AppProvider from './state/AppProvider'

// HashRouter keeps the route after a "#" (…/index.html#/dashboard).
// The browser never sends the hash to a server, so:
//   - file:// (the zip build) works: there's no server at all
//   - GitHub Pages works: it can't be configured to send every URL to index.html,
//     but with a hash it only ever serves index.html anyway
export default function App() {
  return (
    // AppProvider sits above the router, so every screen shares one state
    // (a chart pinned in Chat is still there when you open Dashboard).
    <AppProvider>
      <HashRouter>
        <Routes>
          {/* Layout route: AppShell wraps every screen and renders it in <Outlet />. */}
          <Route element={<AppShell />}>
            {/* Studio is chat-first, so the app opens on Chat. */}
            <Route index element={<Navigate to="/chat" replace />} />
            <Route path="chat" element={<ChatScreen />} />
            <Route path="dashboard" element={<DashboardScreen />} />
            <Route path="pipelines" element={<PipelinesScreen />} />
            <Route path="pipelines/:pipelineId" element={<PipelineDetailScreen />} />
            {/* Unknown URL → back to start instead of a blank page. */}
            <Route path="*" element={<Navigate to="/chat" replace />} />
          </Route>
        </Routes>
      </HashRouter>
    </AppProvider>
  )
}
