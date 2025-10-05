import writeInFile from '../../create-and-write'
import { generateViewRichTextViewComponent } from './generate-v-r-t'
import { generateViewRichTextEditorClientComponent } from './generate-v-r-t-e-c-component'
import { generateViewRichTextEditorServerComponent } from './generate-v-r-t-e-s-component'

const generateViewRichTextEditorMain = async (data: string) => {
    //  !  create api

    let folderName = 'example'

    const { namingConvention } = JSON.parse(data) || {}
    if (namingConvention.users_2_000___) {
        folderName = namingConvention.users_2_000___
    }

    const richTextEditorClientTemplate =
        generateViewRichTextEditorClientComponent(data)
    const richTextEditorServerTemplate =
        generateViewRichTextEditorServerComponent(data)
    const richTextViewTemplate = generateViewRichTextViewComponent(data)

    writeInFile(
        richTextEditorClientTemplate,
        `src/app/generate/${folderName}/all/components/view-rich-text/ClientComponent.tsx`
    )
    writeInFile(
        richTextEditorServerTemplate,
        `src/app/generate/${folderName}/all/components/view-rich-text/ServerComponent.tsx`
    )
    writeInFile(
        richTextViewTemplate,
        `src/app/generate/${folderName}/all/components/view-rich-text/ViewRichText.tsx`
    )
}
export default generateViewRichTextEditorMain
