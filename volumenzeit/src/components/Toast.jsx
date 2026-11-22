import { useStore } from '../store'

export default function Toast() {
  const { toast } = useStore()
  if (!toast) return null
  return (
    <div className="toast" role="status" key={toast.id}>
      {toast.text}
    </div>
  )
}
