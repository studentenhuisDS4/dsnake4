import React, { Component, createRef } from 'react';
import Language from "../../language/Language";
import ChatMessageModel, {ChatboxProps, ChatboxState, ChatMessageComponentModel} from './Models';
import {ChatContext} from "./ChatContext";
import SingleInputForm from '../global/SingleInputForm';
import HelperFunctions from "../global/HelperFunctions";
import {SocketService} from "src/components/chatbox/SocketService";

export default class ChatboxContainer extends Component<ChatboxProps> {
    private chat = new SocketService();

    render() {
        return (
            <ChatContext.Provider value={this.chat}>
                <Chatbox changePlayerName={this.props.changePlayerName} player={this.props.player} />
            </ChatContext.Provider>
        );
    };
}

export class Chatbox extends Component<ChatboxProps, ChatboxState> {
    private messagesEnd = createRef<HTMLDivElement>();
    static contextType = ChatContext;

    constructor(props: ChatboxProps) {
        super(props);
        this.sendMessage = this.sendMessage.bind(this);
        this.scrollToBottom = this.scrollToBottom.bind(this);

        this.state = {
            messages: [{
                id: HelperFunctions.generateRandomId(),
                author: {
                    id: '0',
                    name: 'Bot',
                },
                dateAdded: new Date().getTime(),
                message: 'Welcome! Type a message and press [Enter] to chat with other players.',
            }],
        };
    }

    componentDidMount() {
        // connect to socket from our context
        this.context.init();

        // retrieve observable
        const observable = this.context.onMessage();

        // subscribe to observable
        observable.subscribe((m: ChatMessageModel) => {
            // add incoming message to state
            let messages = this.state.messages;
            messages.push(m);

            this.setState({messages});
        });
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    componentWillUnmount () {
        this.context.disconnect();
    }

    sendMessage(message: string) {
        const chatMessage = {
            id: HelperFunctions.generateRandomId(),
            author: this.props.player,
            dateAdded: new Date().getTime(),
            message,
        };
        this.context.send(chatMessage);
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
                <h2 className="chatbox-title">{Language.getTranslation('title', 'chatbox')}, {this.props.player.name} <span className="ml-1 fa fa-xs fa-pencil text-teal-dark cursor-pointer" onClick={this.props.changePlayerName} /></h2>
                <div className="chatbox flex-grow-1 overflow-auto">
                    {this.state.messages.length > 0
                        ? this.state.messages.map((message :ChatMessageModel) => <ChatMessage {...message} player={this.props.player} key={message.id} />)
                        : <p className="text-muted">{Language.getTranslation('noChats', 'chatbox')}</p>
                    }
                    <div className="float-left clearfix" ref={this.messagesEnd} />
                </div>
                <div className="chatbox-form">
                    <SingleInputForm centerContent={false} hideHelpText={true} inputPlaceholder="chatbox" submitValue={this.sendMessage} />
                </div>
            </div>
        );
    }
}

const ChatMessage: React.FunctionComponent<ChatMessageComponentModel> = props => {
    const position = props.author.id === props.player.id ? 'right' : 'left';
    const dateAdded = new Date(props.dateAdded).toLocaleTimeString();
    return (
        <div className={'speech-bubble ' + position}>
            <strong>{props.author.name}</strong> <small className="text-uppercase text-teal-xlight">{dateAdded}</small><br />
            {props.message}
        </div>
    );
};