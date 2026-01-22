// Address-related type definitions

export type Address = {
    id: string;
    user_id?: string;
    label: string;
    street: string;
    city: string;
    postal_code: string;
    is_default: boolean;
};

export type AddressFormData = {
    label: string;
    street: string;
    city: string;
    postalCode: string;
};
