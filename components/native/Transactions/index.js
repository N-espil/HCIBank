
import { IonItem, IonLabel, IonIcon, IonBackButton, IonButtons, IonToolbar, IonTitle, IonHeader, IonApp, IonContent, IonLoading, IonNavLink } from '@ionic/react';
import { arrowUp, arrowDown, caretBack } from 'ionicons/icons';
import TransactionList from './TransactionList';
import useSWR from 'swr'
import { WEB_URL } from '../../../util/keys';
import MakeTransaction from './MakeTransaction';
import Loader from '../../Loader';
export default function Transactions({ session }) {

    const fetcher = (url) => fetch(url).then(res => res.json())

    const { data, error, isLoading, mutate: transactionMutate } = useSWR(`${WEB_URL}/api/planetscale/user/getTransactions?id=${session?.user.id}&privilege=${session?.user.privilege}`, fetcher)
    const { data: family, error: error2, isLoading: isLoading2 } = useSWR(`${WEB_URL}/api/planetscale/user/getFamily?id=${session?.user.id}`, fetcher);
    const { data: beneficiaries, error: error3, isLoading: isLoading3, mutate: benMutate } = useSWR(`${WEB_URL}/api/planetscale/user/getBeneficiaries?id=${session?.user.id}`, fetcher);
    const { data: bal, error: balError, isLoading: balLoading, mutate: balMutate } = useSWR(`${WEB_URL}/api/planetscale/user/getBalance?id=${session?.user.id}` , fetcher)

    if (isLoading || !data ||balLoading ||!bal )
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
            <div className='flex flex-col w-full h-screen gap-5 px-5 py-5 bg-neutral'>
                <div className='flex flex-col items-center gap-5 pb-5'>
                    <div className='flex items-center self-start justify-between w-full'>
                        <h1 className='m-0 mb-3 text-3xl text-medium text-primary'>{session.user.username}</h1>
                        <div>
                            <h1 className='m-0 text-3xl text-medium text-[#FFFBF9]'>AED {bal.balance.toFixed(2)}</h1>
                            <h1 className='m-0 -mt-2 text-xl text-medium text-primary'>Total Balance</h1>
                        </div>
                    </div>
                    <IonNavLink routerDirection="forward" component={() => <MakeTransaction session={session} family={family} transactionMutate={transactionMutate} beneficiaries={beneficiaries} balance={bal} balMutate={balMutate} benMutate={benMutate}></MakeTransaction>}>
                        <button
                            className='text-2xl font-bold rounded-lg h-14 text-neutral btn btn-accent btn-wide'
                        >
                            Transfer Money
                        </button>
                    </IonNavLink>
                </div>
                <div className='flex flex-col h-full gap-4 bg-neutral rounded-xl'>
                    <TransactionList session={session} family={family?.subUsers} isLoading={isLoading} data={data}></TransactionList>
                </div>

            </div>
        </IonApp>
    )

}
