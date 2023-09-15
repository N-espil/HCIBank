import { WEB_URL } from "../../../util/keys";
import useSWR from 'swr'
import Loader from "../../Loader";
import { useRef, useState } from "react";
import { IonApp, IonBackButton, IonButtons, IonHeader, IonNavLink, IonToolbar } from "@ionic/react";
import { caretBack } from "ionicons/icons";
import PaymentsCarousel from "./PaymentsCarousel";
import AddCustomBill from "./AddCustomBill";
import AddDebit from "./AddDebit";
export default function Payments({ session }) {

	const [paymentView, setPaymentView] = useState(1)
	const fetcher = (url) => fetch(url).then((res) => res.json());
	const { data: payments, error, isLoading, mutate: paymentMutate } = useSWR(`${WEB_URL}/api/planetscale/user/getPayments?id=${session.user.id}`, fetcher);
	const { data: bal, error: balError, isLoading: balLoading, mutate: balMutate } = useSWR(`${WEB_URL}/api/planetscale/user/getBalance?id=${session.user.id}` , fetcher)

	if (!payments || isLoading || !bal || balLoading)
		return <Loader />

	return (
		<IonApp>
			<IonHeader >
				<IonToolbar color="medium" className='border-none' style={{ border: "none !important" }}>
					<IonButtons slot="start" >
						<IonBackButton defaultHref='/' icon={caretBack} text={"Back"} className="custom-back-button"></IonBackButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			<div className='flex flex-col w-full h-screen gap-8 px-5 py-5 bg-neutral'>
				<div className='flex items-center justify-between w-full' >
					<div className="flex w-full" >
						<div
							type='button'

							onClick={() => setPaymentView(1)}
							className={`${paymentView == 1 ? "bg-accent hover:bg-accent" : "text-neutral bg-neutral hover:bg-accent "} border-accent border-[3px] border-r-0 transition-all duration-200  ease-in-out p-2  px-4 rounded-xl rounded-r-none cursor-pointer w-1/2 `}
						>
							<p className={`${paymentView == 1 ? "text-neutral" : "text-secondary "} text-3xl font-semibold text-center`}>Bills</p>
						</div>
						<div
							type='button'
							onClick={() => setPaymentView(2)}
							className={`${paymentView == 2 ? "bg-accent text-neutral hover:bg-accent" : "text-neutral bg-neutral hover:bg-accent"} border-accent border-[3px]  transition-all duration-200 ease-in-out p-2 px-4 rounded-xl rounded-l-none cursor-pointer w-1/2  `}
						>
							<p className={`${paymentView == 2 ? "text-neutral" : "text-secondary "} text-3xl font-semibold text-center`}>Debits</p>
						</div>
					</div>
				</div>
				<div className='flex flex-col items-center gap-5 pb-5'>
					<div className='flex items-center self-start justify-between w-full'>
						<h1 className='m-0 mb-3 text-3xl text-medium text-primary'>{session.user.username}</h1>
						<div>
							<h1 className='m-0 text-3xl text-medium text-[#FFFBF9]'>AED {bal.balance.toFixed(2)}</h1>
							<h1 className='m-0 -mt-2 text-xl text-medium text-primary'>Total Balance</h1>
						</div>
					</div>
					{paymentView == 1 ?
						<IonNavLink routerDirection="forward" component={() => <AddCustomBill session={session} paymentMutate={paymentMutate}></AddCustomBill>}>

							<button
								className='text-2xl font-bold rounded-lg h-14 text-neutral btn btn-info btn-wide'
							>
								Add Bills
							</button>
						</IonNavLink>
						:
						<IonNavLink routerDirection="forward" component={() => <AddDebit session={session} paymentMutate={paymentMutate}></AddDebit>}>

							<button
								className='text-2xl font-bold rounded-lg h-14 text-neutral btn btn-info btn-wide'
							>
								Add Debits
							</button>
						</IonNavLink>
					}
				</div>
				<PaymentsCarousel paymentMutate={paymentMutate} balMutate={balMutate} payments={payments} paymentView={paymentView} userId={session.user.id} username={session.user.username} />

			</div >
		</IonApp>
	)
}
