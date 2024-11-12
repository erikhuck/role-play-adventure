import _ from 'lodash'

const ObjectDisplay = ({object}) => {
    return (
        Object.entries(object).map(([key, val]) => (
            <span key={key}>
                <strong>{_.startCase(key)}</strong>: {val};&nbsp;
            </span>
        ))
    )
}

export default ObjectDisplay
