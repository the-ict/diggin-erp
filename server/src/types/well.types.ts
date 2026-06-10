export interface IWell {
    team: string;
    length: number;
    except_length: number;
    status: IWellStatuses;
    createdAt: Date;
    updatedAt: Date;
}

export type IWellStatuses = "DUGGING" | "FINISHED" | "SUCCESSFUL" | "FAILED";