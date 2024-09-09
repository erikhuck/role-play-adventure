import TemplatesTable from './TemplatesTable.jsx'
import TemplateForm from './TemplateForm.jsx'
import CollapsibleComponent from '../general/CollapsibleComponent.jsx'
import {pluralize} from '../../lib.js'

const TemplateComponent = ({
                               children,
                               templates,
                               deleteTemplate,
                               handleNewTemplate,
                               templateType
                           }) => {
    return (
        <CollapsibleComponent label={pluralize(templateType)}>
            <h2>{templateType} Templates</h2>
            <h3>Current {templateType} Templates</h3>
            <TemplatesTable templates={templates} deleteTemplate={deleteTemplate}/>
            <h3>Create New {templateType} Template</h3>
            <TemplateForm handleNewTemplate={handleNewTemplate}>
                {children}
            </TemplateForm>
        </CollapsibleComponent>
    )
}

export default TemplateComponent
