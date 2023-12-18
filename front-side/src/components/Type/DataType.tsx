


export interface requestType {
    Investigated_requests: {}[];
    caso: { num_caso_lab: string, num_sei: string, id: string };
    create_at: string;
    created_by: string;
    history: string;
    id: string;
    id_case: string;
    num_request: string;
    user: { name: string }
};

export interface reportType {
    analyst?: { id: string, name: string };
    case_id: string;
    create_at: string;
    review_id:string;
    created_by: string;
    user?: { name: string, id?: string }
    file: string;
    id: string;
    num_report: string;
    status: number;
    step_dates:{date:string,type:number}[];
    type: number;
    analyst_id?: string
};

export interface caseType {
    create_at: string;
    created_by: string;
    demandant_unit?: string;
    end_date?: string;
    expiredDate?: string;
    id: string;
    ip_number: string;
    num_caso_lab: string;
    num_sei: string;
    object?: string;
    operation_name: string;
    step_dates: string[];
    updated_at: string;
    Report: reportType[]
    Requests: requestType[]
    CaseMovement: {
        id: string,
        case_id: string,
        label: string,
        date: string,
        expire_date: string,
        observation: string,
        created_by: string,
        edited_at: string,
    }[]
};

export interface analystType {
    id: string,
    name: string,
    cpf: string,
    email: string,
    whatsapp: string,
    status: number,
    pending_vacation_days: number,
    created_by: string,
    user:{name:string},
    create_at: string,
    Report:reportType[]
};

export interface departureType {
    created_by: string,
    created_at: string
    date_end: string,
    alterpendentdays: boolean,
    date_ini: string,
    date_sche_end: string,
    date_sche_ini: string,
    id: string,
    type: string,
    analyst: analystType
}

export interface investigatedType {
    Investigated_requests: { id: string, id_investigated: string, id_request: string },
    name: string,
    cpf: string,
    id: string
}
