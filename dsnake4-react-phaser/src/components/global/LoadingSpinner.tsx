import React from 'react';
import {Spinner} from "react-bootstrap";
import Language from "../../language/Language";
import {LoadingSpinnerProps} from "src/components/global/Models";

const LoadingSpinner: React.FunctionComponent<LoadingSpinnerProps> = props => {
    // Loading message can be left out, disabling the text
    // It can also be true, to use the default translation defined in the global translation file
    // It can also be a string, to use that string as translation key
    const loadingMessage = props.loadingMessage == null
        ? false
        : props.loadingMessage === true
            ? 'global'
            : props.loadingMessage;

    return (
        <div className={(props.inline ? 'd-inline-block' : 'd-flex my-5 justify-content-center')}>
            <Spinner animation="border" size={props.small ? 'sm' : undefined} role="status">
                <span className="sr-only">Loading...</span>
            </Spinner>
            {loadingMessage && <p className={'ml-3 lead text-muted' + (props.inline && ' d-inline-block')}>{Language.getTranslation('loadingMessage', loadingMessage)}</p>}
        </div>
    );
};

export default LoadingSpinner;