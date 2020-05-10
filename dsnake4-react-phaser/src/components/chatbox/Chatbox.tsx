import React, { Component, createRef } from 'react';
import {ChatboxProps, ChatboxState, ChatMessageComponentModel} from './Models';
import Language from "../../language/Language";
import SingleInputForm from '../global/SingleInputForm';

export default class Chatbox extends Component<ChatboxProps, ChatboxState> {
    private messagesEnd = createRef<HTMLDivElement>();

    constructor(props: ChatboxProps) {
        super(props);
        this.addChat = this.addChat.bind(this);
        this.scrollToBottom = this.scrollToBottom.bind(this);

        this.state = {
            chats: [],
        };
    }

    addChat(message: string) {
        const chats = this.state.chats;
        chats.push({
            id: Math.random(),
            dateAdded: new Date(),
            message,
            playerName: this.props.playerName,
        });
        this.setState({ chats });
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    scrollToBottom() {
        if (this.messagesEnd.current != null) {
            this.messagesEnd.current!.scrollIntoView({ behavior: "auto" });
        } else {
            throw new Error("The current, last message is null or undefined!");
        }
    }

    render() {
        return (
            <div className="d-flex flex-column h-100 bg-black border border-2x border-dashed border-teal">
                <h2 className="chatbox-title">{Language.getTranslation('title', 'chatbox')}, {this.props.playerName} <span className="ml-1 fa fa-xs fa-pencil text-teal-dark cursor-pointer" onClick={this.props.changePlayerName} /></h2>
                <div className="chatbox flex-grow-1 overflow-auto">
                    {this.state.chats.length > 0
                        ? this.state.chats.map(chat => <ChatMessage {...chat} position="right" key={chat.id} />)
                        : <p className="text-muted">{Language.getTranslation('noChats', 'chatbox')}</p>
                    }
                    <div className="float-left clearfix" ref={this.messagesEnd} />
                </div>
                <div className="chatbox-form">
                    <SingleInputForm centerContent={false} inputPlaceholder="chatbox" submitValue={this.addChat} />
                </div>
            </div>
        );
    }
}

const ChatMessage: React.FunctionComponent<ChatMessageComponentModel> = props => {
    return (
        <div className={'speech-bubble ' + props.position}>
            <strong>{props.playerName}</strong><br />
            <small className="text-uppercase text-teal-xlight">{props.dateAdded.toLocaleTimeString()}</small> {props.message}
        </div>
    );
};