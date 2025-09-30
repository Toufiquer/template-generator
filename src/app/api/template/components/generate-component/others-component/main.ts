import { generateTooManyRequestComponent } from './../../../../../../../.idea/ai-prompt/components/too-many-request/fixed-return'
import writeInFile from '../../create-and-write'
import { generateAddComponentFile } from './generate-add'
import { generateBulkDeleteComponentFile } from './generate-bulk-delete'
import { generateBulkDynamicUpdateComponentFile } from './generate-bulk-dynamic-update'
import { generateBulkEditComponentFile } from './generate-bulk-edit'
import { generateBulkUpdateComponentFile } from './generate-bulk-update'
import { generateDataSelectComponentFile } from './generate-data-select'
import { generateDeleteComponentFile } from './generate-delete'
import { generateDynamicDataSelectComponentFile } from './generate-dynamic-data-select'
import { generateEditComponentFile } from './generate-edit'
import { generateImagesSelectComponentFile } from './generate-images-select'
import { generateImageDialogComponentFile } from './generate-imge-dialog'
import { generateMultiSelectComponentFile } from './generate-multi-select'
import { generatePaginationComponentFile } from './generate-pagination'
import { generateSearchBoxComponentFile } from './generate-search-box'
import { generateTypeUtils } from './generate-type-utils'
import { generateUtils } from './generate-utils'
import { generateViewComponentFile } from './generate-view'
import { generateViewTableComponentFile } from './generate-table-view'
import { generateFilterDialogFile } from './generate-filter-dialog'
import { generateExportDialogField } from './generate-export-dialog'
import { generateSummaryComponentFile } from './generate-summery'

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

    const dynamicDataSelectComponentContent =
        generateDynamicDataSelectComponentFile(data)

    const editComponentContent = generateEditComponentFile(data)

    const imageDialogComponentContent = generateImageDialogComponentFile(data)

    const imagesSelectComponentContent = generateImagesSelectComponentFile(data)

    const multiSelectComponentContent = generateMultiSelectComponentFile(data)

    const paginationComponentContent = generatePaginationComponentFile(data)

    const searchBoxComponentContent = generateSearchBoxComponentFile(data)

    const generateTooManyRequestContent = generateTooManyRequestComponent(data)
    const generateTypeUtilsContent = generateTypeUtils(data)
    const generateUtilsCentent = generateUtils(data)

    const viewComponentContent = generateViewComponentFile(data)

    const viewTableComponentContent = generateViewTableComponentFile(data)
    const generateFilterDialogContent = generateFilterDialogFile(data)
    const generateExportDialogContent = generateExportDialogField(data)
    const generateSummaryComponentContent = generateSummaryComponentFile(data)

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
    writeInFile(
        dynamicDataSelectComponentContent,
        `src/app/generate/${folderName}/all/components/DynamicDataSelect.tsx`
    )
    writeInFile(
        editComponentContent,
        `src/app/generate/${folderName}/all/components/Edit.tsx`
    )
    writeInFile(
        imageDialogComponentContent,
        `src/app/generate/${folderName}/all/components/ImageDialog.tsx`
    )
    writeInFile(
        imagesSelectComponentContent,
        `src/app/generate/${folderName}/all/components/ImagesSelect.tsx`
    )
    writeInFile(
        multiSelectComponentContent,
        `src/app/generate/${folderName}/all/components/MultiSelect.tsx`
    )
    writeInFile(
        paginationComponentContent,
        `src/app/generate/${folderName}/all/components/Pagination.tsx`
    )
    writeInFile(
        searchBoxComponentContent,
        `src/app/generate/${folderName}/all/components/SearchBox.tsx`
    )
    writeInFile(
        generateTooManyRequestContent,
        `src/app/generate/${folderName}/all/components/TooManyRequest.tsx`
    )
    writeInFile(
        generateTypeUtilsContent,
        `src/app/generate/${folderName}/all/components/TypeUtils.tsx`
    )
    writeInFile(
        generateUtilsCentent,
        `src/app/generate/${folderName}/all/components/utils.tsx`
    )
    writeInFile(
        viewComponentContent,
        `src/app/generate/${folderName}/all/components/View.tsx`
    )
    writeInFile(
        viewTableComponentContent,
        `src/app/generate/${folderName}/all/components/TableView.tsx`
    )
    writeInFile(
        generateFilterDialogContent,
        `src/app/generate/${folderName}/all/components/FilterDialog.tsx`
    )
    writeInFile(
        generateExportDialogContent,
        `src/app/generate/${folderName}/all/components/ExportDialog.tsx`
    )
    writeInFile(
        generateSummaryComponentContent,
        `src/app/generate/${folderName}/all/components/Summary.tsx`
    )
}
export default generateAllOtherComponentsMain
