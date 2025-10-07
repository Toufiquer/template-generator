export const generateStringArrayType = (inputJsonFile: string) => {
    const { namingConvention } = JSON.parse(inputJsonFile) || {}

    const pluralPascalCase = namingConvention.Users_1_000___
    const pluralLowerCase = pluralPascalCase.toLowerCase()
    const singularPascalCase = namingConvention.User_3_000___

    const isUsedGenerateFolder = namingConvention.use_generate_folder

    let reduxPath = ''
    if (isUsedGenerateFolder) {
        reduxPath = `./redux/rtk-api`
    } else {
        reduxPath = `@/redux/features/${pluralLowerCase}/${pluralLowerCase}Slice`
    }
    return `export interface StringArrayData {
    _id?: string
    Name: string
    Class: string
    Roll: number
}

`
}
