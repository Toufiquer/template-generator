import writeInFile from '../../create-and-write'
import { generateRichTextEditorIndex } from './generate-rich-text-editor-index'
import { generateRichTextEditorMenuBar } from './generate-rich-text-editor-menu-bar'

const generateRichTextEditorMain = async (data: string) => {
    //  !  create api

    let folderName = 'example'

    const { namingConvention } = JSON.parse(data) || {}
    if (namingConvention.users_2_000___) {
        folderName = namingConvention.users_2_000___
    }

    const richTextEditorIndexTemplate = generateRichTextEditorIndex()
    const richTextEditorMenuBarTemplate = generateRichTextEditorMenuBar()
    writeInFile(
        richTextEditorIndexTemplate,
        `src/app/generate/${folderName}/all/components/rich-text-editor/index.tsx`
    )
    writeInFile(
        richTextEditorMenuBarTemplate,
        `src/app/generate/${folderName}/all/components/rich-text-editor/menu-bar.tsx`
    )
}
export default generateRichTextEditorMain
