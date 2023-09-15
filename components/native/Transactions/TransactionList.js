import { add, remove } from 'ionicons/icons';
import { Loading } from "@nextui-org/react"
import { IonIcon } from '@ionic/react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { BiTransferAlt } from 'react-icons/bi';
import { GiMoneyStack, GiReceiveMoney } from 'react-icons/gi';
import { HiShoppingCart, HiUser, HiUserGroup } from 'react-icons/hi';
import { FaMoneyBillWave } from 'react-icons/fa';
import { useState } from 'react';
import Loader from '../../Loader';

export default function TransactionList({ session, period, family, data, isLoading }) {
    
    let subIDs = []
    let main2IDs = []

    family?.forEach((f) => {
        f.privilege == "SUB" ? subIDs.push(f.id) : main2IDs.push(f.id)
    })
    
    if (isLoading || !data?.Transactions)
        return <Loader/>
    //console.log("all transactions", data)
    const [isMyTransactions, setIsMyTransactions] = useState(true)

    let transactions = []

    if (isMyTransactions)
        transactions = data?.Transactions.mainTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    else if (data.Transactions.subTransactions.length !== 0)
        transactions = data?.Transactions.subTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    transactions = transactions.map(t => {
        const date = new Date(t.date)
        let formattedDate = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
        return {
            ...t,
            date: formattedDate
        }
    })

    transactions = transactions.filter((obj, index, self) =>
        index === self.findIndex((t) => t.id === obj.id && t.name === obj.name)
    )

    if (period == "Today") {
        const today = new Date();
        transactions = transactions.filter(t => {
            const transactionDate = new Date(t.date);
            return transactionDate.getFullYear() === today.getFullYear()
                && transactionDate.getMonth() === today.getMonth()
                && transactionDate.getDate() === today.getDate();
        });
    }

    if (transactions.length === 0) {
        return (
            <div>
                <div className='flex w-full '>
                    {period == "Today" ?
                        <h1 className='w-full m-0 mb-4 text-2xl text-medium text-primary bg-neutral'>Recent Transactions</h1>
                        :
                        <h1 className='w-full m-0 mb-4 text-2xl font-bold text-primary'>Transactions</h1>
                    }
                {(session.user.privilege == "MAIN" || session.user.privilege == "MAIN2") && <div className='flex gap-4 -mb-1'>
                    <HiUser onClick={() => setIsMyTransactions(true)}
                        className={`${!isMyTransactions ? "text-base-100 border-base-100" : "text-primary border-primary"} cursor-pointer w-6 h-6 m-0 text-3xl border rounded-full`}></HiUser>
                    <HiUserGroup onClick={() => setIsMyTransactions(false)}
                        className={`${isMyTransactions ? "text-base-100 border-base-100" : "text-primary border-primary"} cursor-pointer w-6 h-6 m-0 text-3xl border rounded-full`}></HiUserGroup>

                </div>
                }
                </div>
                <h1 className='text-lg font-normal text-primary'>No transactions to show</h1>
            </div>
        )
    }


    function TransactionIcon({ type }) {
        if (type === "Transferring")
            return <BiTransferAlt className='4xl:w-10 w-8 h-8  4xl:h-10  p-[0px] border-2 rounded-full border-primary' />
        else if (type === "Receiving")
            return <GiMoneyStack className='4xl:w-10 w-8 h-8  4xl:h-10  p-[0px] border-2 rounded-full border-primary' />
        else if (type === "Shopping")
            return <HiShoppingCart className='4xl:w-10 w-8 h-8  4xl:h-10  p-[0px] border-2 rounded-full border-primary' />
        else if (type === "Allowance")
            return <GiReceiveMoney className='4xl:w-10 w-8 h-8  4xl:h-10  p-[0px] border-2 rounded-full border-primary' />
        else if (type === "Bill_Debit")
            return <FaMoneyBillWave className='4xl:w-10 w-8 h-8  4xl:h-10  p-[0px] border-2 rounded-full border-primary' />
    }

    function groupTransactionsByDate() {

        let groupedTransactions = []
        let currentGroup = []
        let currentDate = transactions[0].date
        transactions.forEach(t => {
            if (t.date === currentDate) {
                currentGroup.push(t)
            } else {
                groupedTransactions.push(currentGroup)
                currentGroup = []
                currentGroup.push(t)
                currentDate = t.date
            }
        })
        groupedTransactions.push(currentGroup)
        return groupedTransactions
    }

    transactions = groupTransactionsByDate()


    return (
        <>
            <div className='flex w-full bg-neutral'>
                {period == "Today" ?
                    <h1 className='w-full m-0 text-2xl text-medium text-primary bg-neutral xl:text-2xl'>Recent Transactions</h1>
                    :
                    <h1 className='w-full m-0 text-2xl font-bold text-primary'>Transactions</h1>
                }
                {(session.user.privilege == "MAIN" || session.user.privilege == "MAIN2") && <div className='flex gap-4 -mb-1'>
                    <HiUser onClick={() => setIsMyTransactions(true)}
                        className={`${!isMyTransactions ? "text-base-100 border-base-100" : "text-primary border-primary"} cursor-pointer w-6 h-6 m-0 text-3xl border rounded-full`}></HiUser>
                    <HiUserGroup onClick={() => setIsMyTransactions(false)}
                        className={`${isMyTransactions ? "text-base-100 border-base-100" : "text-primary border-primary"} cursor-pointer w-6 h-6 m-0 text-3xl border rounded-full`}></HiUserGroup>

                </div>}
            </div>
            <div className='w-full h-full overflow-y-auto'>
                <Scrollbars style={{ width: '100%', height: '100%' }} >

                    {transactions?.map((transactionGroup, index) => {
                        return (
                            <div key={index} className='w-full'>
                                {/* <div className='sticky top-0 z-30 border border-base-100'></div> */}
                                <h1 className='sticky top-0 z-30 w-full p-1 m-0 text-base border-t border-base-100 2xl:px-4 4xl:text-xl 4xl:px-5 bg-neutral text-base-100'>{transactionGroup[0].date}</h1>
                                {transactionGroup.map((item, index) => {
                                    const comment = item.comment;
                                    const maxLength = 15;
                                    const limitedComment = comment.slice(0, maxLength) + (comment.length > maxLength ? "..." : "");
                                    return (
                                        <div key={index} className={`flex items-center justify-between lg:text-xs 2xl:text-base border-b border-neutral p-2 4xl:text-lg 4xl:px-5 text-primary`}>
                                            {(subIDs.includes(item.toId) && main2IDs.includes(item.fromId)) || (subIDs.includes(item.fromId) && main2IDs.includes(item.toId)) ?
                                                <div className='flex flex-col gap-4'>
                                                    <div className='flex items-center justify-start gap-2'>
                                                        <TransactionIcon type={item.type} />
                                                        <div>
                                                            <div className='font-bold'>
                                                                {limitedComment.charAt(0).toUpperCase() + limitedComment.slice(1)}
                                                            </div>
                                                            <div className='-mt-1 lg:text-[10px] 2xl:text-xs font-bold 4xl:text-sm text-base-100'>
                                                                {item.toName}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='flex items-center justify-start gap-2'>
                                                        <TransactionIcon type={item.type} />
                                                        <div>
                                                            <div className='font-bold'>
                                                                {limitedComment.charAt(0).toUpperCase() + limitedComment.slice(1)}
                                                            </div>
                                                            <div className='-mt-1 lg:text-[10px] 2xl:text-xs font-bold 4xl:text-sm text-base-100'>
                                                                {item.fromName}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                :
                                                <div className='flex items-center justify-start gap-2'>
                                                    <TransactionIcon type={item.type} />
                                                    <div>
                                                        <div className='font-bold'>
                                                            {limitedComment.charAt(0).toUpperCase() + limitedComment.slice(1)}
                                                        </div>
                                                        <div className='-mt-1 lg:text-[10px] 2xl:text-xs font-bold 4xl:text-sm text-base-100'>
                                                            {isMyTransactions ? item.toName == session.user.username ? item.fromName : item.toName : subIDs.includes(item.toId) ? item.fromName : item.toName}
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                            <div className='flex items-center justify-end font-bold'>
                                                {isMyTransactions ?
                                                    <div>
                                                        <div className='flex items-center'>
                                                            <IonIcon icon={item.toName == session.user.username ? add : remove} />
                                                            <div>AED {item.amount.toFixed(2)}</div>
                                                        </div>
                                                        <div className='font-sans -mt-1 lg:text-[10px] 2xl:text-xs font-bold 4xl:text-sm text-base-100 text-left'>
                                                            {item.toName == session.user.username ? item.toBalance.toFixed(2) : item.fromBalance.toFixed(2)}
                                                        </div>
                                                    </div>
                                                    :
                                                    <div>

                                                        {(subIDs.includes(item.toId) && main2IDs.includes(item.fromId)) || (subIDs.includes(item.fromId) && main2IDs.includes(item.toId)) ?
                                                            <div className='flex flex-col gap-4'>
                                                                <div>
                                                                    <div className='flex items-center'>
                                                                        <IonIcon icon={add} />
                                                                        <div>AED {item.amount.toFixed(2)}</div>
                                                                    </div>
                                                                    <div className='font-sans -mt-1 lg:text-[10px] 2xl:text-xs font-bold 4xl:text-sm text-base-100 text-left'>
                                                                        {item.toBalance.toFixed(2)}
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <div className='flex items-center'>

                                                                        <IonIcon icon={remove} />
                                                                        <div>AED {item.amount.toFixed(2)}</div>
                                                                    </div>
                                                                    <div className='font-sans -mt-1 lg:text-[10px] 2xl:text-xs font-bold 4xl:text-sm text-base-100 text-left'>
                                                                        {item.fromBalance.toFixed(2)}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            :
                                                            <>
                                                                <div className='flex items-center'>

                                                                    <IonIcon icon={subIDs.includes(item.toId) ? add : remove} />
                                                                    <div>AED {item.amount.toFixed(2)}</div>
                                                                </div>
                                                                <div className='font-sans -mt-1 lg:text-[10px] 2xl:text-xs font-bold 4xl:text-sm text-base-100 text-left'>
                                                                    {subIDs.includes(item.toId) ? item.toBalance.toFixed(2) : item.fromBalance.toFixed(2)}
                                                                </div>
                                                            </>
                                                        }
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                        )

                    })}

                </Scrollbars>
            </div>
        </>
    )
}
