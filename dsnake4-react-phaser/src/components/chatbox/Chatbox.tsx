import React, { Component, createRef } from 'react';
import Language from "../../language/Language";
import { ChatMessageModel, ChatboxProps, ChatboxState, ChatMessageComponentModel } from './Models';
import { ChatContext } from "./ChatContext";
import SingleInputForm from '../global/SingleInputForm';
import HelperFunctions from "../global/HelperFunctions";
import { SocketService } from "src/components/chatbox/SocketService";
import ChatService from './ChatService';

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

    private readonly botMessage: ChatMessageModel = {
        uuid: HelperFunctions.generateRandomId(),
        user_id: -1,
        nickname: 'Bot',
        time: new Date(),
        message: 'Welcome! Type a message and press [Enter] to chat with other players.',
    };

    constructor(props: ChatboxProps) {
        super(props);
        this.sendMessage = this.sendMessage.bind(this);
        this.scrollToBottom = this.scrollToBottom.bind(this);

        this.state = {
            messages: [],
        };
    }

    componentDidMount() {
        ChatService.getChatHistory().then(result => {
            result.forEach(message => {
                this.state.messages.push(message);
            });
            this.state.messages.push(this.botMessage);
            this.setState({ messages: this.state.messages });

            // connect to socket from our context
            this.context.init();

            // retrieve observable
            const observable = this.context.onMessage();

            // subscribe to observable
            observable.subscribe((m: ChatMessageModel) => {
                // add incoming message to state
                let messages = this.state.messages;
                messages.push(m);

                this.setState({ messages });
            });
        });
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    componentWillUnmount() {
        this.context.disconnect();
    }

    sendMessage(message: string) {
        const chatMessage: ChatMessageModel = {
            uuid: HelperFunctions.generateRandomId(),
            nickname: this.props.player.nickname,
            user_id: this.props.player.user_id,
            time: new Date(),
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
                <h2 className="chatbox-title">
                    {Language.getTranslation('title', 'chatbox')}, {this.props.player.nickname}
                    <span className="ml-1 fa fa-xs fa-pencil text-teal-dark cursor-pointer" onClick={this.props.changePlayerName} />
                </h2>
                <div className="chatbox flex-grow-1 overflow-auto">
                    {this.state.messages.length > 0
                        ? this.state.messages.map((message: ChatMessageModel) =>
                            <ChatMessage {...message} player_id={this.props.player.user_id} key={message.uuid} />)
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
    const position = props.user_id === props.player_id ? 'right' : 'left';
    const dateAdded = new Date(props.time).toLocaleTimeString();

    return (
        <div className={'speech-bubble ' + position}>
            <strong>{props.nickname}</strong> <small className="text-uppercase text-teal-xlight">{dateAdded}</small><br />
            {props.message}
        </div>
    );
};