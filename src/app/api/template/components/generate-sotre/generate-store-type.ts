interface Schema {
    [key: string]: string | Schema
}

/**
 * Defines the structure for the naming conventions provided in the JSON.
 */
interface NamingConvention {
    Users_1_000___: string
    users_2_000___: string
    User_3_000___: string
    user_4_000___: string
}

/**
 * Defines the overall structure of the input JSON configuration.
 */
interface InputConfig {
    uid: string
    templateName: string
    schema: Schema
    namingConvention: NamingConvention
}

/**
 * Generates the entire Controller.ts file content as a string based on a JSON configuration.
 *
 * This function parses the JSON to extract naming conventions and a data schema. It then
 * uses a template to build the controller's TypeScript code, dynamically inserting the correct
 * names for models, variables, and functions. It also recursively traverses the schema to
 * build a comprehensive search filter that includes all specified fields, including nested ones.
 *
 * @param {string} inputJsonString - A JSON string containing the schema and naming conventions.
 * @returns {string} The complete, formatted Controller.ts file as a string.
 */
function generateStoreTypeFile(inputJson: string): string {
    const config: InputConfig = JSON.parse(inputJson)
    const { namingConvention } = config

    const folderName = namingConvention.users_2_000___
    // The template for the store-type.ts file with placeholders.
    const template = `import { IUsers_1_000___ } from '@/app/dashboard/${folderName}/all/api/v1/model'

export interface Users_1_000___Store {
    queryPramsLimit: number
    queryPramsPage: number
    queryPramsQ: string
    users_2_000___: IUsers_1_000___[]
    selectedUsers_1_000___: IUsers_1_000___ | null
    newUsers_1_000___: Partial<IUsers_1_000___>
    isAddModalOpen: boolean
    isViewModalOpen: boolean
    isEditModalOpen: boolean
    isDeleteModalOpen: boolean
    setNewUsers_1_000___: React.Dispatch<
        React.SetStateAction<Partial<IUsers_1_000___>>
    >
    isBulkEditModalOpen: boolean
    isBulkUpdateModalOpen: boolean
    isBulkDynamicUpdateModal: boolean
    isBulkDeleteModalOpen: boolean
    bulkData: IUsers_1_000___[]
    setQueryPramsLimit: (payload: number) => void
    setQueryPramsPage: (payload: number) => void
    setQueryPramsQ: (payload: string) => void
    setUsers_1_000___: (users_1_000___: IUsers_1_000___[]) => void
    setSelectedUsers_1_000___: (Users_1_000___: IUsers_1_000___ | null) => void
    toggleAddModal: (isOpen: boolean) => void
    toggleViewModal: (isOpen: boolean) => void
    toggleEditModal: (isOpen: boolean) => void
    toggleDeleteModal: (isOpen: boolean) => void
    toggleBulkEditModal: (Users_1_000___: boolean) => void
    toggleBulkUpdateModal: (Users_1_000___: boolean) => void
    toggleBulkDynamicUpdateModal: (Users_1_000___: boolean) => void
    toggleBulkDeleteModal: (Users_1_000___: boolean) => void
    setBulkData: (bulkData: IUsers_1_000___[]) => void
}
`

    // Perform replacements in a specific order to avoid partial-match errors.
    const result = template
        .replaceAll('IUsers_1_000___', `I${namingConvention.Users_1_000___}`)
        .replaceAll(
            'Users_1_000___Store',
            `${namingConvention.Users_1_000___}Store`
        )
        .replaceAll(
            'setUsers_1_000___',
            `set${namingConvention.Users_1_000___}`
        )
        .replaceAll(
            'setSelectedUsers_1_000___',
            `setSelected${namingConvention.Users_1_000___}`
        )
        .replaceAll(
            'selectedUsers_1_000___',
            `selected${namingConvention.Users_1_000___}`
        )
        .replaceAll(
            'setNewUsers_1_000___',
            `setNew${namingConvention.Users_1_000___}`
        )
        .replaceAll(
            'newUsers_1_000___',
            `new${namingConvention.Users_1_000___}`
        )
        // This replacement handles the lowercase plural form
        .replaceAll('users_2_000___: ', `${namingConvention.users_2_000___}: `)
        // This replacement handles the parameter name 'users_1_000___'
        .replaceAll('users_1_000___: ', `${namingConvention.Users_1_000___}: `)
        // This is the final and most general replacement for the capitalized plural form
        .replaceAll('Users_1_000___', namingConvention.Users_1_000___)

    return result
}

export default generateStoreTypeFile
