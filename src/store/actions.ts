export const SET_SERVICE = 'SET_SERVICE';
export const SET_DOCTOR = 'SET_DOCTOR';
export const SET_SLOT = 'SET_SLOT'; // New action type
export const SET_FORM_DATA = 'SET_FORM_DATA';

export const setService = (service: any) => ({
    type: SET_SERVICE,
    payload: { service },
});

export const setDoctor = (doctor: any) => ({
    type: SET_DOCTOR,
    payload: { doctor },
});


export const setSlot = (slot: { year: number; month: number; day: number; slot_order: number, slot_id:number }) => ({
    type: SET_SLOT,
    payload: { slot },
});


export const setForm = (formData: any) => ({
    type: SET_FORM_DATA,
    payload: { formData },
});