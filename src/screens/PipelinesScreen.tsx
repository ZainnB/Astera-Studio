import { Link } from 'react-router'
import PageHeader from '../components/PageHeader'

export default function PipelinesScreen() {
  return (
    <>
      <PageHeader title="Pipelines" subtitle="The data flows that feed your charts." />
      <p className="muted">
        Pipeline list comes in chunk 5. For now: <Link to="/pipelines/sales">open the sales pipeline</Link>.
      </p>
    </>
  )
}
