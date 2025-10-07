import writeInFile from '../create-and-write'
import { generateStringArrayField } from './generate-string-array-field'
import { generateStringArrayType } from './generate-string-array-type'

const generateOthersFields = async (data: string) => {
    let folderName = 'example'
    let isUseGenerateFolder = false
    const { namingConvention, schema } = JSON.parse(data) || {}

    if (namingConvention.users_2_000___) {
        folderName = namingConvention.users_2_000___
        isUseGenerateFolder = namingConvention.use_generate_folder
    }

    const stringArrayField = generateStringArrayField(data)
    const stringArrayType = generateStringArrayType(data)

    if (isUseGenerateFolder) {
        writeInFile(
            stringArrayField,
            `src/app/generate/${folderName}/all/components/others-field-type/StringArrayField.tsx`
        )
        writeInFile(
            stringArrayType,
            `src/app/generate/${folderName}/all/components/others-field-type/types.ts`
        )
    } else {
        writeInFile(
            stringArrayField,
            `src/app/dashboard/${folderName}/all/components/others-field-type/StringArrayField.tsx`
        )
        writeInFile(
            stringArrayType,
            `src/app/dashboard/${folderName}/all/components/others-field-type/types.ts`
        )
    }
}
export default generateOthersFields
