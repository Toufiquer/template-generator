import writeInFile from '../create-and-write'
import { generateIDHomeButton } from './generate-[id]-home-button'
import { generateCustomButton } from './generate-custom-button'
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
    const custombuttonTemplate = generateCustomButton(data)
    const idHomeButtonTemplate = generateIDHomeButton(data)
    writeInFile(
        mainPageTemplate,
        `src/app/generate/${folderName}/ssr-view/page.tsx`
    )
    writeInFile(
        custombuttonTemplate,
        `src/app/generate/${folderName}/ssr-view/CustomButton.tsx`
    )
    writeInFile(
        idHomeButtonTemplate,
        `src/app/generate/${folderName}/ssr-view/details/[id]/HomeButton.tsx`
    )
}
export default generateSSRView
