import React, {Component} from 'react';
import Language from "../../language/Language";
import SingleInputFormProps, {SingleInputFormState} from "src/components/global/Models";

export default class SingleInputForm extends Component<SingleInputFormProps, SingleInputFormState> {
    constructor(props: SingleInputFormProps) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.setMessage = this.setMessage.bind(this);

        this.state = {
            value: '',
        };
    }

    handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        this.setMessage(e.target.value);
    }

    handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (this.state.value !== '') {
            this.props.submitValue(this.state.value);
            this.setMessage('');
        }
    }

    setMessage(value: string) {
        this.setState({value});
    }

    render () {
        const centerContent = this.props.centerContent ? ' text-center' : '';
        return <form className="w-100" onSubmit={this.handleSubmit}>
            <p><input className={'single-input-form' + centerContent} type={this.props.inputType ? this.props.inputType : 'text'} value={this.state.value} onChange={this.handleChange} placeholder={Language.getTranslation('inputPlaceholder', this.props.inputPlaceholder)} /></p>
            {!this.props.hideHelpText && <p className="text-center text-muted">{Language.getTranslation('pressEnterToSubmit',)}</p>}
        </form>;
    }
}