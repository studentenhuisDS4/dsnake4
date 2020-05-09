import React, {Component, createRef} from 'react';
import ChatMessageModel from './Models';
import Language from "../../language/Language";
import SingleInputForm from '../global/SingleInputForm';

type ChatboxProps = {
    playerName: string,
};
type ChatboxState = {
    chats: ChatMessageModel[],
};
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
        this.setState({chats});
    }

    componentDidUpdate () {
        this.scrollToBottom();
    }

    scrollToBottom() {
        this.messagesEnd.current!.scrollIntoView({ behavior: "smooth" });
    }

    render () {
        return (
            <div className="d-flex flex-column h-100 bg-seagreen border border-2x border-dashed border-teal">
                <h2 className="chatbox-title">{Language.getTranslation('title', 'chatbox')}, {this.props.playerName}</h2>
                <div className="chatbox flex-grow-1 overflow-auto">
                    {this.state.chats.length > 0
                        ? this.state.chats.map(chat => <ChatMessage {...chat} key={chat.id} />)
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

const ChatMessage: React.FunctionComponent<ChatMessageModel> = props => {
    return (
        <p>
            <strong>{props.playerName}</strong><br />
            <small className="text-uppercase text-teal-xlight">{props.dateAdded.toLocaleTimeString()}</small> {props.message}
        </p>
    );
};