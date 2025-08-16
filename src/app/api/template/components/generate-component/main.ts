import generateRichTextEditorMain from './rich-text-editor/main'
import generateViewRichTextEditorMain from './view-rich-text-editor/main'

const generateAllOtherComponents = async (data: string) => {
    generateRichTextEditorMain(data)
    generateViewRichTextEditorMain(data)
}
export default generateAllOtherComponents
