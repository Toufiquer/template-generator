import writeInFile from '../../create-and-write'
import { generateAddComponentFile } from './generate-add'

const generateAllOtherComponentsMain = async (data: string) => {
    //  !  create api

    let folderName = 'example'

    // console.log('Data : ', data)
    const { namingConvention } = JSON.parse(data) || {}
    if (namingConvention.users_2_000___) {
        folderName = namingConvention.users_2_000___
    }

    const addComponentTemplate = generateAddComponentFile(data)

    writeInFile(
        addComponentTemplate,
        `src/app/generate/${folderName}/all/components/Add.tsx`
    )
}
export default generateAllOtherComponentsMain
