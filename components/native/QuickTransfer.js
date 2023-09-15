import React from 'react'
import { WEB_URL } from "../../util/keys";
import useSWR from 'swr'
import { Loading } from '@nextui-org/react';
import Transactions from './Transactions';
import { IonNavLink } from '@ionic/react';
import MakeTransaction from './Transactions/MakeTransaction';
import Loader from '../Loader';

export default function QuickTransfer({ session }) {

    const fetcher = (url) => fetch(url).then((res) => res.json());
    const { data: transactions, error, isLoading, mutate: transactionMutate } = useSWR(`${WEB_URL}/api/planetscale/user/getTransactions?id=${session?.user.id}&privilege=${session?.user.privilege}`, fetcher)
    const { data, error: error2, isLoading: isLoading2, mutate: familyMutate } = useSWR(`${WEB_URL}/api/planetscale/user/getFamily?id=${session.user.id}`, fetcher);
    const { data: beneficiaries, error: error3, isLoading: isLoading3, mutate: benMutate } = useSWR(`${WEB_URL}/api/planetscale/user/getBeneficiaries?id=${session.user.id}`, fetcher);
    const { data: bal, error: balError, isLoading: balLoading, mutate: balMutate } = useSWR(`${WEB_URL}/api/planetscale/user/getBalance?id=${session.user.id}`, fetcher)
    
    if (!data || isLoading || !bal || balLoading || !transactions || !beneficiaries)
        return <Loader/>
           
        
    let family = data.subUsers
    return (
        <div className='flex flex-col items-center w-full bg-transparent rounded-xl text-neutral'>
            <h1 className='self-start m-0 mb-2 text-2xl font-bold text-primary'>Quick Transfer</h1>
            <div className="flex items-center justify-center w-full gap-10 p-4">
                {family?.length != 0 ?
                    family?.map((member, index) => {
                        if (index < 3) {

                            const firstname = member.name.split(" ")[0]
                            const lastname = member.name.split(" ")[1]
                            return (
                               
                                <IonNavLink key={index} className='flex flex-col items-center justify-center group' 
                                routerDirection="forward" 
                                    component={() => <MakeTransaction defaultBeneficiary={member} family={data} familyMutate={familyMutate} balance={bal} transactionMutate={transactionMutate} beneficiaries={beneficiaries} balMutate={balMutate} benMutate={benMutate} ></MakeTransaction>}>
                                    <div
                                        className="flex items-center justify-center w-16 h-16 rounded-full cursor-pointer border-[4px] border-accent bg-accent text-neutral"
                                    >

                                        <h2 className='m-0 text-2xl '>{firstname[0].toUpperCase() + lastname[0].toUpperCase()}</h2>
                                    </div>
                                    <div className='flex justify-center w-16 mt-2'>
                                        <h1 className='w-full text-base font-semibold text-center overflow text-secondary '>{firstname.slice(0, 7)}</h1>
                                    </div>
                                </IonNavLink>
                            )
                        }
                    })
                    :
                    <div className='flex flex-col items-center justify-center w-full h-full py-10 rounded-2xl'>
                        <h1 className='text-xl font-semibold 4xl:text-3xl text-neutral'>No Family Members</h1>
                    </div>
                }

            </div>

        </div>
    )
}
