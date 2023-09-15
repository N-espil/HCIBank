import { useLayoutEffect, useEffect, useState, useRef } from 'react'
import { IonIcon, IonBackButton, IonButtons, IonToolbar, IonHeader, IonApp, IonContent, IonFooter, IonTitle, } from '@ionic/react';
import { caretBack, arrowUpCircle } from 'ionicons/icons';
import TextBubble from './TextBubble';
import Transactions from '../../components/native/Transactions';
import Wallet from './Wallet';
import Payments from './Payments';
import Family from './Family';
import Fin from '../../public/images/down.svg';
import Image from 'next/image';

export default function Chatbot({ payments, session, bal, balMutate }) {

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
	const [contentHeight, setContentHeight] = useState(window.innerHeight);
	const chatContainerRef = useRef(null);
	const [help, setHelp] = useState(false);

	// console.log('ss', session)

	const options = [
		{
			keyword: 'Save my money',
			action: {
				type: 'reply',
			},
			value: `Your balance is: AED ${bal.toFixed(2)}, and your expenses are: <br>
                     1- AED ${internet} for Internet<br>
                     2- AED ${water} for Water<br>
                     3- AED ${electricity} for Electricity<br>`
				+ valueCustomBills
				+ valueDebits
				+ `With a salary of AED ${session.user.salary}, 
				the amount safe to spend in this month is: 
				<strong> AED ${(bal + session.user.salary - internet - water - electricity - totalDebits - totalCustomBills).toFixed(2)}</strong>`
			,
			color: "chat-bubble-secondary"
		},
		{
			keyword: 'View my transactions',
			ref: useRef(null),
			action: {
				type: 'navigate',
				Link: <Transactions session={session} bal={bal} balMutate={balMutate} />,
			},
			value: 'Redirecting to Transactions page...',
			color: "chat-bubble-warning"

		},
		{
			keyword: 'View my Wallet',
			ref: useRef(null),
			action: {
				type: 'navigate',
				Link: <Wallet session={session} bal={bal} balMutate={balMutate} />,
			},
			value: 'Redirecting to your Wallet...',
			color: "chat-bubble-info"
		},
		{
			keyword: 'View my Payments',
			ref: useRef(null),
			action: {
				type: 'navigate',
				Link: <Payments session={session} bal={bal} balMutate={balMutate} ></Payments>,
			},
			value: 'Redirecting to Payments page...',
			color: "chat-bubble-warning"

		},
		{
			keyword: 'View my Family',
			ref: useRef(),
			action: {
				type: 'navigate',
				Link: <Family session={session} bal={bal} balMutate={balMutate} ></Family>,
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
			// if(input.length < 3)
			// 	return false;
			const key = option.keyword.toLowerCase();
			return key.includes(input.toLowerCase()) || Number(input) === index + 1;
		});
		console.log(selectedOption)
		if(selectedOption?.action?.type === 'navigate'){
			setTimeout(() => {
				selectedOption.ref.current.click();
			}, 2000);
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
				Link: option.action.Link,
				ref: option.ref
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
		const handleResize = () => {
			setContentHeight(window.innerHeight);
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	useEffect(() => {
		const chatContainer = chatContainerRef.current;
		chatContainer.scrollToBottom();
	}, [messages]);

	return (
		<IonApp className='bg-neutral'>
			<IonHeader >
				<IonToolbar color="medium" className='border-none' style={{ border: "none !important" }}>
					<IonButtons slot="start" >
						<IonBackButton defaultHref='/' icon={caretBack} text={"Back"} className="custom-back-button"></IonBackButton>
					</IonButtons>
				</IonToolbar>
				<div className='flex flex-col items-center justify-center gap-2 p-2 pt-0 mt-0'>
					<Image src={Fin} className='w-16 h-16 mx-auto' />
					<p className='text-2xl text-center text-white'>Feen The Chat Bot</p>
					{/* <div className='border-b-[0.5px] w-[90%] opacity-50 border-base-100'></div> */}
				</div>
			</IonHeader>
			<IonContent className='ion-padding' color="medium" scrollY scrollEvents={true} ref={chatContainerRef} style={{ height: contentHeight - 150 }}>
				{messages.map((message, index) => {
					const { pos, msg, color, onClick, option, type, Link, ref } = message
					return (
						<TextBubble ref={ref} key={index} pos={pos} msg={msg} color={color} onClick={onClick} option={option} type={type} Link={Link} ></TextBubble>
					)
				})}
			</IonContent>
			<IonFooter color="medium">
				<IonToolbar color="medium" className='px-3 mb-3'>
					<div className='flex items-center p-2 pl-3 m-0 bg-white rounded-full border-neutral'>
						<input
							autoComplete='off'
							id="input"
							className='w-full text-lg bg-transparent outline-none placeholder:text-neutral placeholder:text-lg text-neutral'
							placeholder="Type a message..."
							onKeyPress={(e) => {
								if (e.key === 'Enter') {
									setInput(e.target.value);
									e.target.value = '';
								}
							}}
							 />

						<IonIcon icon={arrowUpCircle} className=' text-4xl text-[#ADC172] -m-1 p-0' onClick={() => {
							let i = document.getElementById('input')
							setInput(i.value);
							i.value = '';

						}} />
					</div>
				</IonToolbar>
			</IonFooter>
		</IonApp>
	);
}