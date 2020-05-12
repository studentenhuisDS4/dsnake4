// The SingleInputForm component props and/or state models
export default interface SingleInputFormProps {
    centerContent: boolean,
    inputPlaceholder: string,
    submitValue: (msg: string) => void,
}
export interface SingleInputFormState {
    value: string,
}