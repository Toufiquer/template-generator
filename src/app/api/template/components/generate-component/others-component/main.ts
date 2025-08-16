import writeInFile from '../../create-and-write'
import { generateAddComponentFile } from './generate-add'
import { generateBulkDeleteComponentFile } from './generate-bulk-delete'

const generateAllOtherComponentsMain = async (data: string) => {
    //  !  create api

    let folderName = 'example'

    // console.log('Data : ', data)
    const { namingConvention } = JSON.parse(data) || {}
    if (namingConvention.users_2_000___) {
        folderName = namingConvention.users_2_000___
    }

    const addComponentTemplate = generateAddComponentFile(data)

    const bulkDeleteComponentContent = generateBulkDeleteComponentFile(data)
    writeInFile(
        addComponentTemplate,
        `src/app/generate/${folderName}/all/components/Add.tsx`
    )
    writeInFile(
        bulkDeleteComponentContent,
        `src/app/generate/${folderName}/all/components/BulkDelete.tsx`
    )
}
export default generateAllOtherComponentsMain
