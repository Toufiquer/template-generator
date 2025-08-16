import writeInFile from '../../create-and-write'
import { generateViewRichTextEditorClientComponent } from './generate-v-r-t-e-component'

const generateViewRichTextEditorMain = async (data: string) => {
    //  !  create api

    let folderName = 'example'

    // console.log('Data : ', data)
    const { namingConvention } = JSON.parse(data) || {}
    if (namingConvention.users_2_000___) {
        folderName = namingConvention.users_2_000___
    }

    const richTextEditorMenuBarTemplate =
        generateViewRichTextEditorClientComponent(data)

    writeInFile(
        richTextEditorMenuBarTemplate,
        `src/app/generate/${folderName}/all/components/view-rich-text/ClientComponent.tsx`
    )
}
export default generateViewRichTextEditorMain
