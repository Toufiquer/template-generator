import writeInFile from '../create-and-write'
import generateRtkApiFile from './generate-toolkit'

const generateRtk = async (data: string) => {
    //  !  create api
    let folderName = 'example'
    let isUseGenerateFolder = false
    const { namingConvention } = JSON.parse(data) || {}
    if (namingConvention.users_2_000___) {
        folderName = namingConvention.users_2_000___
        isUseGenerateFolder = namingConvention.use_generate_folder
    }

    const rtkApiTemplate = generateRtkApiFile(data)

    if (isUseGenerateFolder) {
        writeInFile(
            rtkApiTemplate,
            `src/app/generate/${folderName}/all/redux/rtk-api.ts`
        )
    } else {
        writeInFile(
            rtkApiTemplate,
            `src/app/dashboard/${folderName}/all/redux/rtk-api.ts`
        )
    }
}
export default generateRtk
