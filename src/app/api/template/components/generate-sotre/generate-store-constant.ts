const generateStoreConstant = (inputJson: string): string => {
    let result = `
    export const defaultPageNumber = 0;
export const queryParams = { q: '', page: 1, limit: defaultPageNumber };
export const pageLimitArr = [defaultPageNumber, 20, 30, 40, 50];

    `
    return result
}

export default generateStoreConstant
