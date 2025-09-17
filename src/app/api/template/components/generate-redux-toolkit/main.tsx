import writeInFile from '../create-and-write'
import generateRtkApiFile from './generate-toolkit'

const generateRtk = async (data: string) => {
    //  !  create api

    let folderName = 'example'

    // console.log('Data : ', data)
    const { namingConvention } = JSON.parse(data) || {}
    if (namingConvention.users_2_000___) {
        folderName = namingConvention.users_2_000___
    }

    const rtkApiTemplate = generateRtkApiFile(data)
    writeInFile(
        rtkApiTemplate,
        `src/app/generate/${folderName}/all/redux/rtk-api.ts`
    )
}
export default generateRtk
