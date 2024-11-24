import {useCallback} from 'react'

const popupOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
}

const popupContentStyle = {
    backgroundColor: '#242424',
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

export const PopupButton = ({setIsVisible, data, setData, text}) => {
    const openPopup = useCallback(() => {
        setData(data)
        setIsVisible(true)
    }, [data, setData, setIsVisible])
    return <button onClick={openPopup}>{text}</button>
}

export default Popup
