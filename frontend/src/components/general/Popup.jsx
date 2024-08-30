import {useCallback} from 'react'

const popupOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
}

const popupContentStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: '20px',
    borderRadius: '8px',
    textAlign: 'center'
}

const Popup = ({
                   isVisible,
                   setIsVisible,
                   children
               }) => {
    const onClose = useCallback(() => setIsVisible(false), [setIsVisible])
    return isVisible && (
        <div style={popupOverlayStyle}>
            <div style={popupContentStyle}>
                <div>{children}</div>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    )
}

export default Popup
