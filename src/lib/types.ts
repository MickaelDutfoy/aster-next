export type Family = {

}

export type Animal = {
    id: number;
    name: string;
    species: string;
    sex?: string;
    color?: string;
    birthDate: Date;
    isNeutered: boolean;
    status: string;
    lastVax?: Date;
    isPrimoVax?: boolean;
    lastDeworm?: Date;
    isFirstDeworm?: boolean;
    information?: string;
    family?: Family;
    organizationId: number;
}

export type Organization = {
    id: number;
    name: string;
    role?: string;
    status?: string;
    animals: Animal[];
};

export type Member = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    organizations: Organization[];
};