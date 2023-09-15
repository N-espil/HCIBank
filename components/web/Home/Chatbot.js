import { useLayoutEffect, useEffect, useState, useRef } from 'react'
import { IonIcon } from '@ionic/react';
import { arrowUpCircle } from 'ionicons/icons';
import ChatBubble from './ChatBubble';
import { Input } from '@nextui-org/react';
import Scrollbars from 'react-custom-scrollbars-2';
import Image from 'next/image';
import Fin2 from '../../../public/images/fin2.svg';
import { useRouter } from 'next/router'


export default function Chatbot({ payments, session, balance, showChatbot, setShowChatbot }) {
    const router = useRouter()
    const { bills, debits } = payments
    const { electricity, internet, water } = bills?.presetBills
    const customBills = bills?.customBills

    let totalCustomBills = 0
    let totalDebits = 0
    customBills.forEach((b) => { totalCustomBills += b.amount })
    debits.forEach((d) => { totalDebits += d.monthlyAmount })

    const valueCustomBills = totalCustomBills == 0 ? `` : `4- ${totalCustomBills.toFixed(2)} for other bills<br>`
    const valueDebits = totalDebits == 0 ? `` : totalCustomBills == 0 ? `4- AED ${totalDebits.toFixed(2)} for other debits<br>` : `5- AED ${totalDebits.toFixed(2)} for debits<br>`

    const [input, setInput] = useState('');
    const [response, setResponse] = useState({});
    const [messages, setMessages] = useState([{ msg: session ? `Hello ${session.user.name}! How can I help you?` : `Hello! How can I help you?`, pos: 'start' }]);
    const scrollbarsRef = useRef(null);
    const [help, setHelp] = useState(false);

    const options = [
        {
            keyword: 'Save my money',
            id:"save",
            action: {
                type: 'reply',
            },
            value: `Your balance is: AED ${balance.toFixed(2)}, and your expenses are: <br>
                     1- AED ${internet} for Internet<br>
                     2- AED ${water} for Water<br>
                     3- AED ${electricity} for Electricity<br>`
                + valueCustomBills
                + valueDebits
                + `With a salary of AED ${session.user.salary}, the amount safe to spend in this month is: AED ${(balance + session.user.salary - internet - water - electricity - totalDebits - totalCustomBills).toFixed(2)}`
            ,
            color: "chat-bubble-secondary"
        },
        {
            keyword: 'View my transactions',
            id:"money",
            action: {
                type: 'navigate',
                Link: '/dashboard?tab=transactions',
            },
            value: 'Redirecting to Transactions page...',
            color: "chat-bubble-warning"

        },
        {
            keyword: 'View my Payments',
            id:"payments",
            action: {
                type: 'navigate',
                Link: '/dashboard?tab=payments',
            },
            value: 'Redirecting to Payments page...',
            color: "chat-bubble-warning"

        },
        {
            keyword: 'View my Family',
            id:"family",
            action: {
                type: 'navigate',
                Link: '/dashboard?tab=family',
            },
            value: 'Redirecting to Family page...',
            color: "chat-bubble-warning"

        },
        {
            keyword: 'Help',
            id:"help",
            action: {
                type: 'reply',
            },
            value: null,
            color: "chat-bubble-success"
        },
    ];

    const processInput = (input) => {
        const selectedOption = options.find((option, index) => {
            const key = option.keyword.toLowerCase();
            return key.includes(input.toLowerCase()) || Number(input) === index + 1;
        });
        if(selectedOption?.action?.type === 'navigate'){
            setTimeout(() => {
                router.push(selectedOption.action.Link)
            }, 1500);

        }
        if (selectedOption && selectedOption.value === null) {
            setHelp(prev => !prev);
        }
        setResponse(selectedOption ? selectedOption.value : 'I don\'t understand.');
    }

    const getOptionChatBubblesMessages = () => {
        return options.map((option, index) => {

            return {
                msg: `${index + 1}. ${option.keyword}`,
                pos: 'start',
                color: option.color,
                onClick: () => setInput(new String(index + 1)),
                option: true,
                type: option.action.type,
                Link: option.action.Link
            };
        });
    }

    useEffect(() => {
        if (input) {
            setMessages([...messages, { msg: input, pos: 'end' }]);
            setTimeout(() => {
                processInput(input);
            }, 1000);
        }
        setInput('');
    }, [input]);

    useEffect(() => {
        if (response)
            setMessages([...messages, { msg: response, pos: 'start' }]);

        return () => {
            setResponse('')
        }
    }, [response])

    useEffect(() => {
        const optionChatBubblesMessages = getOptionChatBubblesMessages();
        setMessages([...messages, ...optionChatBubblesMessages]);
    }, [help]);



    useLayoutEffect(() => {
        scrollbarsRef.current?.scrollToBottom();
    }, [messages]);


    return (
        <div className={`${showChatbot ? "translate-y-[0px]" : "4xl:translate-y-[405px] translate-y-[355px]"} p-3 duration-500 ease-in-out transition-all fixed w-[250px] h-[350px] 3xl:w-[300px] 3xl:h-[400px] bottom-0 right-8 z-50 bg-info flex flex-col justify-center items-center rounded-t-xl`}>
            <Image className={` scale-50 duration-100 ease-in-out transition-all -right-[31px] 3xl:-right-[37px] absolute -top-[73px] 3xl:-top-[92px] cursor-pointer w-[50%]`} 
            src={Fin2}
                onClick={() => {
                    setShowChatbot(prev => !prev)
                }
                }
            />
            <div className='relative w-full h-full bg-neutral' >
                <Scrollbars
                    ref={scrollbarsRef}
                    autoHide
                    autoHideTimeout={1000}
                    autoHideDuration={200}
                    className='self-end'>
                    <div className='p-3 pb-14'>

                        {messages.map(({ pos, msg, color, onClick, option, type, Link }, index) => {
                            return (
                                <ChatBubble key={index} pos={pos} msg={msg} color={color} onClick={onClick} option={option} type={type} Link={Link} ></ChatBubble>
                            )
                        })}
                    </div>
                </Scrollbars>
                <div className='absolute flex items-center justify-center w-full gap-3 py-4 bg-neutral -bottom-3 '>
                    <Input
                        id='input'
                        width='80%'
                        onKeyPress={(e) => { 
                            if (e.key === 'Enter') { 
                                setInput(e.target.value);
                                e.target.value = ''; 
                            } 
                        }}
                        rounded
                        aria-label='Type your message...'
                        animated={false}
                        contentRightStyling={false}
                        placeholder="Type your message..."
                        css={{
                            "::placeholder": {
                                color: "#242529",
                                fontSize: "0.875rem",
                                fontWeight: "400",
                                lineHeight: "1.25rem",
                            },
                        }}
                        contentRight={
                            <button
                                onClick={() => {
                                    let i = document.getElementById('input')
                                    setInput(i?.value)
                                    i.value = ''
                                }}
                            >
                                <IonIcon icon={arrowUpCircle} className='text-3xl align-middle text-info' />

                            </button>
                        }
                    />
                </div>
            </div>
        </div>


    );
}
