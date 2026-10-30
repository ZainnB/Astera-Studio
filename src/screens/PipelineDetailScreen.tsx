import { useParams } from 'react-router'
import PageHeader from '../components/PageHeader'

export default function PipelineDetailScreen() {
  // Reads the :pipelineId part of the URL, e.g. #/pipelines/sales → "sales".
  const { pipelineId } = useParams()

  return (
    <>
      <PageHeader title="Pipeline detail" subtitle={`id: ${pipelineId}`} />
      <p className="muted">Steps view comes in chunk 5.</p>
    </>
  )
}
