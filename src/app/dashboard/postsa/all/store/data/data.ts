

    import { DateRange } from 'react-day-picker'

export interface IPostsa {
    "title": string;
    "students": string;
    "complexValue": {
        "id": string;
        "title": string;
        "parent": {
            "id": string;
            "title": string;
            "child": {
                "id": string;
                "title": string;
                "child": string;
                "note": string
            };
            "note": string
        };
        "note": string
    };
    createdAt: Date;
    updatedAt: Date;
    _id: string;
}

export const defaultPostsa = {
    "title": '',
    "students": '',
    "complexValue": {
        "id": '',
        "title": '',
        "parent": {
            "id": '',
            "title": '',
            "child": {
                "id": '',
                "title": '',
                "child": '',
                "note": ''
            },
            "note": ''
        },
        "note": ''
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    _id: '',
}
