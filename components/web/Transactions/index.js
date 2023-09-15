import TransactionList from './TransactionList'
import MakeTransaction from './MakeTransaction'
import { WEB_URL } from '../../../util/keys';
import useSWR from 'swr'


export default function Transactions({ session }) {

    const fetcher = (url) => fetch(url).then(res => res.json())
    const { data, error, isLoading, mutate: transactionMutate } = useSWR(`${WEB_URL}/api/planetscale/user/getTransactions?id=${session?.user.id}&privilege=${session?.user.privilege}`, fetcher)
    const { data: family, error: error2, isLoading: isLoading2 } = useSWR(`${WEB_URL}/api/planetscale/user/getFamily?id=${session?.user.id}`, fetcher);
    const { data: beneficiaries, error: error3, isLoading: isLoading3, mutate: benMutate } = useSWR(`${WEB_URL}/api/planetscale/user/getBeneficiaries?id=${session?.user.id}`, fetcher);

    return (
        <div className='grid h-screen grid-cols-2 gap-10 p-5 xl:px-10 2xl:p-16 2xl:px-32 4xl:px-24 2xl:gap-28 5xl:px-44 bg-neutral '>
            <MakeTransaction session={session} family={family} transactionMutate={transactionMutate} beneficiaries= {beneficiaries} benMutate={benMutate}></MakeTransaction>
            <div className='flex flex-col h-full gap-4 bg-neutral rounded-xl'>
                <TransactionList session={session} family={family?.subUsers} isLoading={isLoading} data={data}></TransactionList>
            </div>
        </div >

    )
}

