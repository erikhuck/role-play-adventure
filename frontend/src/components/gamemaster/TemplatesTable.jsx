import _ from 'lodash'
import {sortByName} from '../../lib.js'

const TemplatesTable = ({
                            templates,
                            deleteTemplate
                        }) => {
    const templateKeys = templates && templates.length > 0 ? Object.keys(templates[0]) : undefined
    return (
        <>
            {
                templateKeys ? (
                    <table className="table-w-deletes">
                        <thead>
                        <tr>
                            <th className="no-style"></th>
                            {templateKeys.map(key => <th key={key}>{_.startCase(key)}</th>)}
                        </tr>
                        </thead>
                        <tbody>
                        {
                            sortByName(templates).map(template => (
                                <TableRow key={template.name} template={template} templateKeys={templateKeys}
                                          deleteTemplate={deleteTemplate}/>)
                            )
                        }
                        </tbody>
                    </table>
                ) : (
                    <p>No templates yet</p>
                )
            }
        </>
    )
}

const TableRow = ({
                      template,
                      templateKeys,
                      deleteTemplate
                  }) => {
    return (
        <tr>
            <td>
                <button onClick={async () => await deleteTemplate(template.name)}>DELETE</button>
            </td>
            {
                templateKeys.map(key => {
                        const value = template[key]
                        return (
                            <td key={key}>
                                {
                                    typeof value === 'object' ? (
                                        Object.entries(value).map(([key, value]) => (
                                                <span key={key}>
                                                    <strong>{_.startCase(key)}</strong>: {value};&nbsp;
                                                </span>
                                            )
                                        )
                                    ) : (<p>{value}</p>)
                                }
                            </td>
                        )
                    }
                )
            }
        </tr>
    )
}

export default TemplatesTable
