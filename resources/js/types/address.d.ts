export interface Province {
    id?: number;
    psgcCode?: string;
    provDesc?: string;
    regCode?: string;
    provCode?: string;
    active?: number;

}


export interface City {
    id?: number;
    psgcCode?: string;
    citymunDesc?: string;
    regDesc?: string;
    provCode?: string;
    citymunCode?: string;
    zipcode?: string;
    active?: number;

}


export interface Barangay {
    id?: number;
    brgyCode?: string;
    brgyRef?: string;
    brgyDesc?: string;
    regCode?: string;
    provCode?: string;
    citymunCode?: string;
    active?: number;
}
