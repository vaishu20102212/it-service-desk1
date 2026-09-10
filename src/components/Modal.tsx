export function Modal({title,onClose,children}:{title:string,onClose:()=>void,children:React.ReactNode}){
 return <div className="modal-backdrop" role="dialog" aria-modal="true"><div className="modal"><div className="modal-head"><h3>{title}</h3><button onClick={onClose} aria-label="Close">×</button></div>{children}</div></div>
}

export function ConfirmModal({
  title = "Confirm Delete",
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  onConfirm,
  onClose,
}: {
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onClose: () => void
}) {
  return (
    <Modal title={title} onClose={onClose}>
      <p style={{ margin: '15px 0 20px', color: '#4b5563', fontSize: '14px', lineHeight: 1.6 }}>
        {message}
      </p>
      <div className="actions">
        <button type="button" onClick={onClose}>
          {cancelText}
        </button>
        <button
          type="button"
          className="primary"
          style={{ background: '#dc2626', borderColor: '#dc2626' }}
          onClick={onConfirm}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  )
}

