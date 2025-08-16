import writeInFile from '../create-and-write'
import { generateMainPage } from './generate-main-page'

const generateSSRView = async (data: string) => {
    //  !  create api

    let folderName = 'example'

    // console.log('Data : ', data)
    const { namingConvention } = JSON.parse(data) || {}
    if (namingConvention.users_2_000___) {
        folderName = namingConvention.users_2_000___
    }

    const mainPageTemplate = generateMainPage(data)
    writeInFile(
        mainPageTemplate,
        `src/app/generate/${folderName}/ssr-view/page.tsx`
    )
}
export default generateSSRView
