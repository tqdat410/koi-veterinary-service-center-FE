export interface UserAddress {
    state: string;
    city: string;
    ward: string;
    homeNumber: string;
}

export interface UserData {
    username: string;
    email: string;
    firstname: string;
    lastname: string;
    phone: string;
    address: UserAddress;
}



export interface Medicine {
    medicine_id: number;
    medicine_name: string;
    instruction: string;
}

export interface Prescription {
    prescription_id: number | null;
    instruction: string;
    medicines: { medicine_id: number;medicine_name:string; instruction: string ; quantity: number }[];
}

export interface MedicalReport {
    veterinarian_id: number;
    conclusion: string;
    advise: string;
    prescription_id: number;
}

