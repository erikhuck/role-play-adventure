import _ from 'lodash'

const CharacterConditions = ({characterType, conditionData}) => {
    return (
        <>
            <h2>{_.startCase(characterType)} Conditions</h2>
            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Current Value</th>
                </tr>
                </thead>
                <tbody>
                {conditionData.map(({ name, value, max}) => (
                    <tr key={name}>
                        <td>{name}</td>
                        <td>{value} / {max}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </>
    )
}

export default CharacterConditions
