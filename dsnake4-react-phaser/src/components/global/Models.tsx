// The SingleInputForm component props and/or state models
export default interface SingleInputFormProps {
    centerContent: boolean,
    hideHelpText?: boolean,
    inputPlaceholder: string,
    submitValue: (msg: string) => void,
}
export interface SingleInputFormState {
    value: string,
}

// The LoadingSpinner component props
export interface LoadingSpinnerProps {
    inline?: boolean,
    loadingMessage?: string | boolean,
    small?: boolean,
}