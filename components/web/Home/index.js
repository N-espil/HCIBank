import { useState } from 'react'
import CreditCard from '../../CreditCard';
import TransactionList from '../Transactions/TransactionList';
import QuickTransfer from './QuickTransfer';
import { useRouter } from 'next/router';
import Graph from './Graph';
import { WEB_URL } from "../../../util/keys";
import useSWR from 'swr'
import { Loading } from '@nextui-org/react';
import Chatbot from './Chatbot';
import Loader from '../../Loader';

export default function Home({ session, bal }) {
    const router = useRouter();
    let balance = 0
    if (bal)
        balance = +bal.toFixed(2)
    const [showChatbot, setShowChatbot] = useState(false)

    const formattedBalance = balance.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    const fetcher = (url) => fetch(url).then(res => res.json())
    const { data: family, error: error2, isLoading: isLoading2 } = useSWR(`${WEB_URL}/api/planetscale/user/getFamily?id=${session?.user.id}`, fetcher);

    const { data, error, isLoading, mutate: transactionMutate } = useSWR(`${WEB_URL}/api/planetscale/user/getTransactions?id=${session?.user.id}&privilege=${session?.user.privilege}`, fetcher)

    const { data: payments, error: error3, isLoading: isLoading3 } = useSWR(`${WEB_URL}/api/planetscale/user/getPayments?id=${session?.user.id}`, fetcher);


    if (isLoading || !data.Transactions || isLoading2 || isLoading3 || !payments || !family)
        return (
            <Loader></Loader>
        )
    let transactions = data?.Transactions.mainTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
        <div className='flex flex-col w-full h-screen gap-1 p-5 2xl:gap-10 2xl:p-10 2xl:py-5 bg-neutral'>
            {session?.user.privilege == "MAIN" && <Chatbot payments={payments} session={session} balance={bal} showChatbot={showChatbot} setShowChatbot={setShowChatbot}></Chatbot>}
            <div className='flex flex-col h-full lg:gap-7 4xl:py-10 4xl:mr-10 4xl:gap-12 2xl:gap-1'>
                <div className='flex gap-16'>
                    <div className='flex gap-5'>
                        <div className='lg:w-[260px]  2xl:w-[330px] 4xl:w-[380px] 5xl:w-[450px]'>
                            <h1 className='m-0 mb-4 lg:text-2xl 2xl:text-3xl 4xl:mb-6 4xl:text-4xl text-medium text-primary xl:text-2xl'>Credit Card</h1>
                            <div className='flex justify-center w-full 2xl:mb-10 4xl:mb-0'>
                                <CreditCard name={session?.user.name} balance={formattedBalance}></CreditCard>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col w-full '>
                        <TransactionList session={session} period={"Today"} family={family?.subUsers} isLoading={isLoading} data={data}></TransactionList>
                        {transactions.length !== 0 && <h1 onClick={() => router.push('/dashboard/?tab=transactions')}
                            className='relative m-0 mx-auto font-bold cursor-pointer select-none lg:text-sm 2xl:text-xl text-primary'>View More...</h1>}
                    </div>
                </div>
                <div className='flex gap-5'>
                    <div className='flex flex-col w-full'>
                        <h1 className='mb-4 2xl:text-3xl 2xl:mb-6 4xl:text-4xl text-medium text-primary lg:text-2xl'>Your Daily Balance</h1>
                        <Graph transactions={transactions} session={session}></Graph>
                    </div>

                    <QuickTransfer session={session}></QuickTransfer>
                </div>
            </div>
        </div >
    )
}
