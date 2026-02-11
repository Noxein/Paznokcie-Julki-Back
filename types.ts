export type Image = {
    id: string;
    public_id: string;
    info: InfoType;
    date: Date;
}

export type InfoType = {
    importance: number,
    should_be_on_front_page: boolean,
    tags: TagType[],
    date: Date
}

export type TagType = "manicure" | "pedicure" | "hybryda" | "zabieg"