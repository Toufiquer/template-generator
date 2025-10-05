import writeInFile from '../create-and-write'
import { generateMainPageFile } from './generate-main-page'

const generateMainPage = async (data: string) => {
    //  !  create api

    let folderName = 'example'
    const { namingConvention } = JSON.parse(data) || {}
    if (namingConvention.users_2_000___) {
        folderName = namingConvention.users_2_000___
    }

    const mainPageTemplate = generateMainPageFile(data)
    writeInFile(mainPageTemplate, `src/app/generate/${folderName}/all/page.tsx`)
}
export default generateMainPage
