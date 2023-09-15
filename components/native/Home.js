import { useState } from 'react'
import CreditCard from './CreditCard';
import TransactionList from './Transactions/TransactionList';
import Transactions from './Transactions';
// import QuickTransfer from './QuickTransfer';
import { WEB_URL } from "../../util/keys";
import useSWR from 'swr'
import Loader from '../Loader';
import { IonApp, IonBackButton, IonButtons, IonHeader, IonNavLink, IonTitle, IonToolbar } from '@ionic/react';
import { caretBack } from 'ionicons/icons';
import QuickTransfer from './QuickTransfer';


export default function Home({ session, bal, balMutate }) {
    let balance = 0
    if (bal)
        balance = +bal.toFixed(2)

    const formattedBalance = balance.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    const fetcher = (url) => fetch(url).then(res => res.json())

    const { data: family, error: error2, isLoading: isLoading2 } = useSWR(`${WEB_URL}/api/planetscale/user/getFamily?id=${session?.user.id}`, fetcher);
    const { data, error, isLoading, mutate: transactionMutate } = useSWR(`${WEB_URL}/api/planetscale/user/getTransactions?id=${session?.user.id}&privilege=${session?.user.privilege}`, fetcher)

    if (isLoading || !data || isLoading2 || !family)
        return <Loader></Loader>


    let transactions = data?.Transactions.mainTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    return (
        <IonApp>
            <IonHeader >
                <IonToolbar color="medium" className='border-none'>
                    <IonButtons slot="start" >
                        <IonBackButton defaultHref='/' icon={caretBack} text={"Back"} className="custom-back-button"></IonBackButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <div className='grid w-full h-screen grid-cols-1 grid-rows-3 gap-5 px-5 bg-neutral'>
                <div>
                    <h1 className='m-0 mt-4 mb-3 text-3xl text-medium text-accent '>Welcome Back! {session.user.name.split(" ")[0]}</h1>
                    <h1 className='m-0 mb-3 text-2xl text-medium text-primary '>Credit Card</h1>
                    <div className='flex justify-center w-full px-4 4xl:mb-0'>
                        <CreditCard name={session?.user.name} balance={formattedBalance}></CreditCard>
                    </div>
                </div>
                <div className='flex flex-col w-full h-auto gap-2 p-1 mt-12 '>
                    <TransactionList session={session} period={"Today"} family={family?.subUsers} isLoading={isLoading} data={data}></TransactionList>
                    {transactions.length !== 0 && <IonNavLink
                        component={() => <Transactions session={session} family={family?.subUsers} transactions={transactions} transactionMutate={transactionMutate} />}
                        routerDirection="forward"
                        className='relative m-0 mx-auto text-sm font-bold cursor-pointer select-none text-primary'>View More...</IonNavLink>}
                </div>
                <QuickTransfer session={session} bal={bal} />

            </div>
        </IonApp>
    )
}
