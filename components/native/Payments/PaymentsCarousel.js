import { IonNavLink } from '@ionic/react'
import { Loading, Text } from '@nextui-org/react'
import { warning } from 'ionicons/icons'
import { useEffect, useState } from 'react'
import payManualBill from '../../../pipes/payManualBill'
import Scrollbars from 'react-custom-scrollbars-2'
import Modal from '../Modal'
import EditBill from './EditBill'
import ViewDebit from './ViewDebit'
import DeleteBill from './DeleteBill'

function BillsView({ bills, userId, paymentMutate, username, balMutate }) {
    const deleteBillId = "deleteBill";
    const [selectedBill, setSelectedBill] = useState(null)
    const [submitting, setSubmitting] = useState(false)

    return (
        <>
            <h1 className='w-full m-0 -my-4 text-3xl text-medium text-primary bg-neutral'>Payments</h1>
            <div className='w-full h-full overflow-y-auto'>
                <Scrollbars style={{ width: '100%', height: '100%' }} >

                    {bills?.map((bill, index) => {
                        const { title, amount, id, automated, paid } = bill
                        console.log(bill)
                        if (selectedBill?.title === title) {
                            return (
                                <div key={index} className='flex items-center justify-between w-full' >
                                    <div
                                        className={`flex w-full items-center justify-between border-b border-base-100 p-4 text-primary ${index == 0 && "border-t border-base-100"}`}>
                                        <div

                                            onClick={async () => {
                                                if (!automated && !paid) {
                                                    setSubmitting(true)
                                                    const res = await payManualBill({ fromName: username, fromID: userId, toUsername: `${title} Bill`, amount: amount, comment: `Paying for ${title} bill`, type: "Bill_Debit", bill: { title, id } })
                                                    paymentMutate()
                                                    balMutate()
                                                    setSubmitting(false)
                                                }
                                            }}
                                            className={`bg-neutral  border-accent border-[3px] border-r-0 t p-1 px-4 rounded-xl rounded-r-none cursor-pointer w-1/3 `}
                                        >

                                            {!automated ?
                                                paid ?
                                                    <p className={`text-accent text-xl font-semibold text-center opacity-50`}>
                                                        <Text b color="$accent">
                                                            Paid
                                                        </Text>
                                                    </p>
                                                    :
                                                    <p className={`text-accent text-xl font-semibold text-center`}>
                                                        <Text b color="$accent">
                                                            {submitting ? <Loading size='xs'></Loading> : "Pay"}
                                                        </Text>
                                                    </p>
                                                :
                                                <p className={`text-accent text-xl font-semibold text-center opacity-50`}>
                                                    <Text b color="$accent">
                                                        Auto
                                                    </Text>
                                                </p>
                                            }


                                        </div>
                                        <IonNavLink
                                            className={`${paid ? "pointer-events-none" : ""} bg-neutral border-accent border-[3px] border-r-0 p-1  px-4 rounded-xl rounded-r-none rounded-l-none cursor-pointer w-1/3 `}
                                            routerDirection="forward"
                                            component={() =>
                                                <EditBill bill={bill} userId={userId} paymentMutate={paymentMutate} ></EditBill>}>

                                            <p className={`${paid ? "opacity-50" : ""} text-accent text-xl font-semibold text-center`}>Edit</p>
                                        </IonNavLink>
                                        <IonNavLink
                                            htmlFor={deleteBillId}
                                            className={`${title == "Water" || title == "Electricity" || title == "Internet" ? "pointer-events-none" : ""} bg-neutral border-accent border-[3px] p-1 px-4 rounded-xl rounded-l-none cursor-pointer w-1/3  `}
                                            routerDirection="forward"
                                            component={() =>
                                                <DeleteBill bill={bill} userId={userId} paymentMutate={paymentMutate} ></DeleteBill>}>
                                            <p className={`${title == "Water" || title == "Electricity" || title == "Internet" ? "opacity-40" : ""} text-accent text-xl font-semibold text-center`}>Delete</p>
                                        </IonNavLink>
                                    </div>
                                </div>
                            )
                        }
                        return (
                            <div
                                tabIndex={0}
                                onFocus={() => setSelectedBill(bill)}
                                onBlur={() => setSelectedBill(null)}
                                key={index}
                                className={`flex items-center justify-between border-b border-base-100 p-2 text-primary ${index == 0 && "border-t border-base-100"}`}>
                                <div className='flex items-center justify-start gap-8 '>
                                    <div className="flex items-center justify-center w-16 h-16 rounded-full cursor-pointer bg-accent text-neutral">
                                        <h2 className='m-0 text-2xl '>{title[0].toUpperCase() + title[1].toUpperCase()}</h2>
                                    </div>
                                    <h2 className='m-0 text-2xl text-white '>{title}</h2>
                                </div>
                                {paid ?
                                    <div className='flex items-center justify-end pr-3 font-bold'>
                                        <h2 className='m-0 text-lg text-secondary '>PAID</h2>
                                    </div>
                                    :
                                    <div className='flex items-center justify-end pr-3 font-bold'>
                                        <h2 className='m-0 text-lg text-secondary '>AED {amount.toFixed(2)}</h2>
                                    </div>
                                }
                            </div>
                        )

                    })}
                </Scrollbars>
            </div>
        </>
    )



}

function DebitsView({ debits }) {

    return (
        <>
            <h1 className='w-full m-0 -my-4 text-3xl text-medium text-primary bg-neutral'>Payments</h1>
            <div className='w-full h-full overflow-y-auto'>
                <Scrollbars style={{ width: '100%', height: '100%' }} >

                    {debits.length !== 0 ? debits?.map((debit, index) => {
                        const { title, totalAmount, monthlyAmount, dateDue } = debit
                        return (
                            <IonNavLink routerDirection="forward" component={() => <ViewDebit debit={debit}></ViewDebit>}
                                key={index}
                                className={`flex items-center justify-between border-b border-base-100 p-2 text-primary ${index == 0 && "border-t border-base-100"}`}
                            >
                                <div className='flex items-center justify-start gap-8 '>
                                    <div className="flex items-center justify-center w-16 h-16 rounded-full cursor-pointer bg-accent text-neutral">
                                        <h2 className='m-0 text-2xl '>{title[0].toUpperCase() + title[1].toUpperCase()}</h2>
                                    </div>
                                    <h2 className='m-0 text-2xl text-white '>{title}</h2>
                                </div>
                                <div className='flex items-center justify-end font-bold'>
                                    <h2 className='m-0 text-lg text-secondary '>AED {monthlyAmount.toFixed(2)}</h2>
                                </div>
                            </IonNavLink>
                        )

                    })
                        :
                        <div className='flex flex-col items-center justify-center mt-5'>
                            <h1 className='text-2xl font-semibold text-base-100'>No debits to display...</h1>
                        </div>
                    }
                </Scrollbars>
            </div>
        </>
    )
}

export default function PaymentsCarousel({ payments, paymentView, userId, paymentMutate, username, balMutate }) {
    const { debits, bills: allBills } = payments

    allBills.customBills = allBills.customBills.map(i => {
        return { ...i, isCustom: true }
    })
    let bills = [
        {
            title: "Water",
            amount: allBills.presetBills.water,
            id: allBills.presetBills.id,
            automated: allBills.presetBills.automateWater,
            paid: allBills.presetBills.paidWater
        },
        {
            title: "Electricity",
            amount: allBills.presetBills.electricity,
            id: allBills.presetBills.id,
            automated: allBills.presetBills.automateElectricity,
            paid: allBills.presetBills.paidElectricity
        },
        {
            title: "Internet",
            amount: allBills.presetBills.internet,
            id: allBills.presetBills.id,
            automated: allBills.presetBills.automateInternet,
            paid: allBills.presetBills.paidInternet
        },
    ].concat(allBills.customBills)

    return (
        paymentView == 1 ?
            <BillsView bills={bills} userId={userId} paymentMutate={paymentMutate} balMutate={balMutate} username={username}></BillsView>
            :
            <DebitsView debits={debits} ></DebitsView>

    )
}
