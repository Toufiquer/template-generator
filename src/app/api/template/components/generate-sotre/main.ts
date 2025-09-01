import writeInFile from '../create-and-write'
import generateStoreFile from './generate-store'
import generateStoreConstant from './generate-store-constant'
import generateStoreTypeFile from './generate-store-type'

const generateStore = async (data: string) => {
    //  !  create api

    let folderName = 'example'

    // console.log('Data : ', data)
    const { namingConvention } = JSON.parse(data) || {}
    if (namingConvention.users_2_000___) {
        folderName = namingConvention.users_2_000___
    }

    const storeTemplate = generateStoreFile(data)
    const storeConstantTemplate = generateStoreConstant(data)
    const storeTypeTemplate = generateStoreTypeFile(data)
    writeInFile(
        storeTemplate,
        `src/app/generate/${folderName}/all/store/store.ts`
    )
    writeInFile(
        storeConstantTemplate,
        `src/app/generate/${folderName}/all/store/store-constant.ts`
    )
    writeInFile(
        storeTypeTemplate,
        `src/app/generate/${folderName}/all/store/store-type.ts`
    )
}
export default generateStore
