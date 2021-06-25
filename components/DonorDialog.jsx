import CloseIcon from '../assets/close.svg'

export default function DonorDialog({ data, close }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'rgba(0, 0, 0, 0.2)',
      }}
    >
      <dialog
        open
        style={{ width: '500px', display: 'flex', flexDirection: 'column' }}
      >
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <span
            style={{ marginLeft: 'auto', cursor: 'pointer' }}
            onClick={close}
          >
            <CloseIcon />
          </span>
        </div>
        {Object.entries(data).map(([key, value]) => (
          <div
            key={key}
            style={{
              display: 'flex',
              flexDirection: 'row',
              padding: '10px 5px',
            }}
          >
            <div style={{ flexBasis: '30%', flexShrink: 0, color: '#666' }}>
              {key}
            </div>
            <div style={{ flexGrow: 1 }}>{value ? value : '---'}</div>
          </div>
        ))}
      </dialog>
    </div>
  )
}
