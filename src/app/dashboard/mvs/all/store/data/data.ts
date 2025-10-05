

    import { DateRange } from 'react-day-picker'

export interface IMvs {
    "title": string;
    createdAt: Date;
    updatedAt: Date;
    _id: string;
}

export const defaultMvs = {
    "title": '',
    createdAt: new Date(),
    updatedAt: new Date(),
    _id: '',
}
