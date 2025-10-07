
import { DateRange } from 'react-day-picker'
import { StringArrayData } from '../../components/others-field-type/types'

export interface ITesta {
    "title": string;
    "students": StringArrayData[];
    createdAt: Date;
    updatedAt: Date;
    _id?: string;
}

export const defaultTesta = {
    "title": '',
    "students": [],
    createdAt: new Date(),
    updatedAt: new Date(),
    _id: '',
}
