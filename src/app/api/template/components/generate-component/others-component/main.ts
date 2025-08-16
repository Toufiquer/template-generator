import writeInFile from '../../create-and-write'
import { generateAddComponentFile } from './generate-add'
import { generateBulkDeleteComponentFile } from './generate-bulk-delete'
import { generateBulkDynamicUpdateComponentFile } from './generate-bulk-dynamic-update'
import { generateBulkEditComponentFile } from './generate-bulk-edit'
import { generateBulkUpdateComponentFile } from './generate-bulk-update'
import { generateDataSelectComponentFile } from './generate-data-select'
import { generateDeleteComponentFile } from './generate-delete'

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
    const bulkDynamicUpdateComponentContent =
        generateBulkDynamicUpdateComponentFile(data)

    const bulkEditComponentContent = generateBulkEditComponentFile(data)

    // Generate and print the output
    const bulkUpdateComponentContent = generateBulkUpdateComponentFile(data)

    const dataSelectComponentContent = generateDataSelectComponentFile(data)

    const deleteComponentContent = generateDeleteComponentFile(data)
    writeInFile(
        addComponentTemplate,
        `src/app/generate/${folderName}/all/components/Add.tsx`
    )
    writeInFile(
        bulkDeleteComponentContent,
        `src/app/generate/${folderName}/all/components/BulkDelete.tsx`
    )
    writeInFile(
        bulkDynamicUpdateComponentContent,
        `src/app/generate/${folderName}/all/components/BulkDynamicUpdate.tsx`
    )
    writeInFile(
        bulkEditComponentContent,
        `src/app/generate/${folderName}/all/components/BulkEdit.tsx`
    )
    writeInFile(
        bulkUpdateComponentContent,
        `src/app/generate/${folderName}/all/components/BulkUpdate.tsx`
    )
    writeInFile(
        dataSelectComponentContent,
        `src/app/generate/${folderName}/all/components/DataSelect.tsx`
    )
    writeInFile(
        deleteComponentContent,
        `src/app/generate/${folderName}/all/components/Delete.tsx`
    )
}
export default generateAllOtherComponentsMain
