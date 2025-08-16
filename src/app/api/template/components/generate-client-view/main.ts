import writeInFile from '../create-and-write'
import { generateIDHomeButton } from './generate-[id]-home-button'
import { generateClientDetailPageFile } from './generate-[id]-page'
import { generateCustomButton } from './generate-custom-button'
import { generateClientListPageFile } from './generate-main-page'

const generateClientView = async (data: string) => {
    //  !  create api

    let folderName = 'example'

    // console.log('Data : ', data)
    const { namingConvention } = JSON.parse(data) || {}
    if (namingConvention.users_2_000___) {
        folderName = namingConvention.users_2_000___
    }

    const mainPageTemplate = generateClientListPageFile(data)
    const custombuttonTemplate = generateCustomButton(data)
    const idHomeButtonTemplate = generateIDHomeButton(data)
    const detailPageTemplate = generateClientDetailPageFile(data)
    writeInFile(
        mainPageTemplate,
        `src/app/generate/${folderName}/client-view/page.tsx`
    )
    writeInFile(
        custombuttonTemplate,
        `src/app/generate/${folderName}/client-view/CustomButton.tsx`
    )
    writeInFile(
        idHomeButtonTemplate,
        `src/app/generate/${folderName}/client-view/details/[id]/HomeButton.tsx`
    )
    writeInFile(
        detailPageTemplate,
        `src/app/generate/${folderName}/client-view/details/[id]/page.tsx`
    )
}
export default generateClientView
