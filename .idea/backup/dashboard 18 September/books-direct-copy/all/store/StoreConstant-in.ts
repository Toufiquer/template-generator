import { IBooks } from '../api/v1/model'

export const baseIBooksPerPage = 2
export const queryParams = { q: '', page: 1, limit: baseIBooksPerPage }
export const pageLimitArr: number[] = [baseIBooksPerPage, 10, 50, 100, 200]
export const select_5_000___: string = 'select_5_000___'
export const booksSelectorArr = [select_5_000___, 'admin', 'moderator']
export type ISelect_6_000___ = 'select_5_000___' | 'admin' | 'moderator'
export const defaultBooksData: IBooks = {
    _id: '',
    name: '',
    email: '',
    passCode: '',
    alias: '',
    role: select_5_000___,
    createdAt: new Date(),
    updatedAt: new Date(),
}
export const baseIBooks: IBooks = {
    ...defaultBooksData,
}
