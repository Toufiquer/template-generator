import writeInFile from '../../create-and-write'
import { generateRichTextEditorIndex } from './generate-rich-text-editor-index'

const generateRichTextEditorMain = async (data: string) => {
    //  !  create api

    let folderName = 'example'

    // console.log('Data : ', data)
    const { namingConvention } = JSON.parse(data) || {}
    if (namingConvention.users_2_000___) {
        folderName = namingConvention.users_2_000___
    }

    const richTextEditorIndexTemplate = generateRichTextEditorIndex(data)
    writeInFile(
        richTextEditorIndexTemplate,
        `src/app/generate/${folderName}/all/components/rich-text-editor/index.tsx`
    )
}
export default generateRichTextEditorMain
