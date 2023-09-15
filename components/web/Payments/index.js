import { Card, Text, Loading } from "@nextui-org/react";
import { WEB_URL } from "../../../util/keys";
import useSWR from 'swr'
import PaymentsCarousel from "./PaymentsCarousel";
import Muney from '../../../public/images/muney.png'
import Image from "next/image";
import Modal from "../Modal";
import AddCustomBill from "./AddCustomBill";
import AddDebit from "./AddDebit";
import Loader from "../../Loader";
import { useState } from "react";
import { useRouter } from 'next/router';

export default function Payments({ session, balMutate }) {
    const router = new useRouter()
    if (session.user.privilege == "SUB"){
        router.push('/dashboard?tab=home')
    }
    const [paymentView, setPaymentView] = useState(1)
    const fetcher = (url) => fetch(url).then((res) => res.json());
    const { data: payments, error, isLoading, mutate: paymentMutate } = useSWR(`${WEB_URL}/api/planetscale/user/getPayments?id=${session?.user.id}`, fetcher);
    if (!payments || isLoading)
        return <Loader/>
        
    const addBillPaymentId = "addBill";
    const addDebitPaymentId = "addDebit";
    return (
        <>
            <Modal modalId={addBillPaymentId} title={"Add Bill"}>
                <div className='flex flex-col items-center justify-center gap-10'>
                    <AddCustomBill modalId={addBillPaymentId} session={session} paymentMutate={paymentMutate}></AddCustomBill>
                </div>
            </Modal>
            <Modal modalId={addDebitPaymentId} title={"Add Debit"}>
                <div className='flex flex-col items-center justify-center gap-10'>
                    <AddDebit modalId={addDebitPaymentId} session={session} paymentMutate={paymentMutate}></AddDebit>
                </div>
            </Modal>
            <div className='flex flex-col w-full h-screen gap-3 p-5 xl:gap-5 xl:px-10 xl:py-12 2xl:px-24 2xl:gap-10 4xl:p-5 5xl:py-16 5xl:px-44 bg-neutral'>
                <div className='flex flex-col w-full items-center justify-center bg-accent rounded-xl h-[55%]'>
                    <h1 className='w-full m-0 font-bold lg:p-2 4xl:p-5 lg:text-2xl 2xl:text-3xl 4xl:text-4xl text-neutral '>Payments {paymentView == 1 ? "for Bills" : "for Debits"}</h1>
                    <PaymentsCarousel paymentMutate={paymentMutate} payments={payments} paymentView={paymentView} userId={session.user.id} username={session.user.username} balMutate={balMutate} />
                </div>
                <div className="flex w-full ">
                    <div className='flex lg:w-full 3xl:w-auto bg-info rounded-xl'>
                        <div className='w-full p-3 m-0 font-bold text-neutral '>
                            <h1 className='m-0 font-bold lg:text-2xl 2xl:text-3xl 4xl:text-4xl text-neutral'>Debits & Bills</h1>
                            <p className='font-semibold 4xl:text-xl'>Effortlessly Manage Your Family's Banking Needs</p>
                            <div className='flex flex-col gap-5 p-5 4xl:gap-6 5xl:gap-10 5xl:p-10'>
                                <label htmlFor={addDebitPaymentId} className='p-3 pl-3 m-0 text-xl text-center align-middle cursor-pointer 4xl:p-5 bg-neutral text-info hover:bg-opacity-70 rounded-2xl'>
                                    Add Debits
                                </label>
                                <button
                                    disabled={payments.debits.length === 0 || paymentView == 2}
                                    onClick={() => setPaymentView(2)}
                                    className='p-3 text-xl align-middle 4xl:p-5 bg-neutral text-info hover:bg-opacity-70 rounded-2xl disabled:opacity-60 disabled:pointer-events-none'
                                >Manage Debits</button>
                            </div>
                        </div>
                        <div className='w-full p-3 m-0 text-3xl font-bold text-neutral '>
                            <h1 className='invisible m-0 font-bold lg:text-2xl 2xl:text-3xl 4xl:text-4xl text-neutral'>Bills</h1>
                            <p className='invisible font-semibold lg: 4xl:text-xl'>Effortlessly Manage Your Family's Banking Needs</p>
                            <div className='flex flex-col gap-5 p-5 4xl:gap-6 5xl:gap-10 5xl:p-10'>
                                <label htmlFor={addBillPaymentId} className='p-3 pl-3 m-0 text-xl text-center align-middle cursor-pointer 4xl:p-5 bg-neutral text-info hover:bg-opacity-70 rounded-2xl'>
                                    Add Bills
                                </label>
                                <button
                                    disabled={payments.debits.length === 0 || paymentView == 1}
                                    onClick={() => setPaymentView(1)}
                                    className='p-3 text-xl align-middle 4xl:p-5 bg-neutral text-info hover:bg-opacity-70 rounded-2xl disabled:opacity-60 disabled:pointer-events-none'
                                >Manage Bills</button>
                            </div>
                        </div>
                    </div>
                    <Image className="sm:hidden 3xl:inline-flex 3xl:ml-8 3xl:h-[300px] 4xl:h-[330px] 4xl:w-[500px] 5xl:w-auto 5xl:h-auto " alt={"Money"} src={Muney}></Image>

                </div>
            </div >
        </>

    )
}
