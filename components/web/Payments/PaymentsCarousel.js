import { IonIcon } from '@ionic/react'
import { Dropdown, Loading, Text, purple } from '@nextui-org/react'
import { chevronBackSharp, chevronForwardSharp, warning } from 'ionicons/icons'
import { useState } from 'react'
import EditBill from './EditBill'
import Modal from '../Modal';
import ViewDebit from './ViewDebit'
import deleteBill from '../../../pipes/deleteBill'
import payManualBill from '../../../pipes/payManualBill'
import NotificationSmall from '../NotificationSmall'

function BillsView({ bills, userId, paymentMutate, username, balMutate }) {
    const editBillPaymentId = "editBill";
    const deleteBillId = "deleteBill";
    const [selectedBill, setSelectedBill] = useState(null)
    const [viewCount, setViewCount] = useState(1)
    const [submitting, setSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState("")

    const handleDelete = async () => {
        setSubmitting(true);
        const res = await deleteBill({ id: selectedBill.id });
        setSubmitting(false);
        if (res.success == true) {
            setSubmitStatus("success")
            paymentMutate()
            setViewCount(1)

            // document.getElementById(deleteBillId).click();
        }
        else {
            setSubmitStatus("error")
        }

    }

    function Circles() {
        let circles = []
        for (let i = 0; i < Math.ceil(bills.length / 3); i++) {
            circles.push(
                <div
                    key={i}
                    className={`w-3 h-3 rounded-full cursor-pointer ${i === viewCount - 1 ? 'bg-white' : 'bg-neutral'}`}
                    onClick={() => setViewCount(i + 1)}
                ></div>)
        }
        return circles
    }

    return (
        <>
            <Modal modalId={editBillPaymentId} title={selectedBill?.title}>
                <div className='flex flex-col items-center justify-center gap-10'>
                    <EditBill bill={selectedBill} modalId={editBillPaymentId} userId={userId} paymentMutate={paymentMutate}></EditBill>
                </div>
            </Modal>
            <Modal modalId={deleteBillId} title={"Warning!"} icon={warning} >
                {!submitStatus ?
                    <div className='flex flex-col items-center justify-center gap-10 '>
                        <p className="text-lg max-w-xs font-bold text-center text-[#FFFBF9]">
                            Are you sure you want to delete this user permanently?
                        </p>

                        <button
                            onClick={handleDelete}
                            disabled={submitting}
                            className='px-8 text-xl rounded-full hover:bg-accent hover:text-neutral bg-secondary text-neutral btn-outline-neutral btn '
                        >
                            {submitting ? <Loading color="currentColor" size="sm" /> : " Delete"}

                        </button>
                    </div>
                    :
                    <NotificationSmall message={"Delete"} submitStatus={submitStatus} setSubmitStatus={setSubmitStatus}></NotificationSmall>
                }
            </Modal>
            <div className="flex items-center justify-center w-full gap-10 p-1 my-auto 5xl:p-2 5xl:gap-16">

                <IonIcon className={`w-12 h-12 mr-auto cursor-pointer 4xl:w-20 4xl:h-20 text-neutral ${viewCount === 1 ? "invisible" : "inline-flex"}`} icon={chevronBackSharp} onClick={() => {
                    if (viewCount > 1)
                        setViewCount(prev => prev - 1)
                }} />
                {
                    bills?.map((bill, index) => {
                        const { title, amount, id, automated, paid } = bill
                        if (index < viewCount * 3 && index >= (viewCount - 1) * 3) {

                            return (
                                <div key={index} className='flex flex-col items-center justify-center group'>
                                    <Dropdown menuProps placement='bottom-left' >
                                        <Dropdown.Trigger className={` ${submitting || paid? `pointer-events-none` : `pointer-events-auto`}`}>
                                            {!paid ? 
                                            <div
                                                className="flex items-center justify-center w-24 h-24 4xl:w-32 4xl:h-32 rounded-full cursor-pointer border-[4px] group-hover:text-neutral group-hover:bg-accent border-neutral bg-neutral text-accent"
                                            >
                                                <h2 className='m-0 text-[36px] 4xl:text-6xl group-hover:hidden '>{title[0].toUpperCase() + title[1].toUpperCase()}</h2>
                                                <h2 className='hidden m-0 text-4xl 4xl:text-6xl group-hover:inline-flex '>
                                                    {submitting ? <Loading type="points" size='lg' color="white"></Loading> : 'Pay'}
                                                </h2>
                                            </div>
                                            :
                                                <div
                                                    className="flex items-center justify-center w-24 h-24 4xl:w-32 4xl:h-32 rounded-full cursor-pointer border-[4px] text-neutral bg-accent border-neutral"
                                                >
                                                    <h2 className='m-0 text-[36px] 4xl:text-6xl '>Paid</h2>
                                                   
                                                </div>
                                            }

                                        </Dropdown.Trigger>
                                        <Dropdown.Menu className='myDropdown'>
                                            <Dropdown.Item key="pay" textValue='Pay' css={{ minWidth: "100%", padding: 0, }} >
                                                <div className='flex w-full h-full pl-3 m-0'
                                                    onClick={async () => {
                                                        if (!automated && !paid) {
                                                            setSubmitting(true)
                                                            const res = await payManualBill({ fromName: username, fromID: userId, toUsername: `${title} Bill`, amount: amount, comment: `Paying for ${title} bill`, type: "Bill_Debit", bill: { title, id } })
                                                            paymentMutate()
                                                            balMutate()
                                                            setSubmitting(false)
                                                        }
                                                    }}>
                                                    {!automated ? !paid ?
                                                        <Text b >
                                                            Pay
                                                        </Text>
                                                        :
                                                        <Text b >
                                                            Paid
                                                        </Text>
                                                        :
                                                        <Text b>
                                                            Automated
                                                        </Text>
                                                    }
                                                </div>
                                            </Dropdown.Item>
                                            {!paid && <Dropdown.Item key="edit" textValue='Edit' css={{ minWidth: "100%", padding: 0, }} >
                                                <label htmlFor={editBillPaymentId} className={`${paid ? "pointer-events-none opacity-50 disabled" : ""} flex w-full h-full pl-3 m-0 cursor-pointer`}
                                                    onClick={() => {
                                                        setSelectedBill(bill)

                                                    }}>
                                                    <Text b>
                                                        Edit
                                                    </Text>
                                                </label>
                                            </Dropdown.Item>}
                                            {bill.isCustom &&
                                                <Dropdown.Item withDivider key="delete" textValue='Delete' css={{ minWidth: "100%", padding: 0, }}>
                                                    <label htmlFor={deleteBillId} className='flex w-full h-full pl-3 m-0 cursor-pointer'
                                                        onClick={() => {
                                                            setSelectedBill(bill)

                                                        }}>
                                                        <Text b color='error'>
                                                            Delete
                                                        </Text>
                                                    </label>
                                                </Dropdown.Item>
                                            }
                                        </Dropdown.Menu>

                                    </Dropdown>
                                    <div className='flex justify-center 3xl:mt-4 '>
                                        <h1 className='m-0 text-3xl font-semibold text-neutral'>{title}</h1>
                                    </div>
                                </div>
                            )
                        }

                    })
                }
                <IonIcon className={`w-12 h-12 ml-auto cursor-pointer 4xl:w-20 4xl:h-20 text-neutral ${viewCount === Math.ceil(bills.length / 3) ? "invisible" : "inline-flex"}`} icon={chevronForwardSharp} onClick={() => {
                    if (viewCount < Math.ceil(bills.length / 3))
                        setViewCount(prev => prev + 1)
                }} />
            </div>
            <div className='flex gap-3 p-4'>
                <Circles></Circles>
            </div>
        </>
    )



}

function DebitsView({ debits }) {
    const viewDebitPaymentId = "viewDebit";
    const [selectedDebit, setSelectedDebit] = useState(null)
    const [viewCount, setViewCount] = useState(1)

    function Circles() {
        let circles = []
        for (let i = 0; i < Math.ceil(debits.length / 3); i++) {
            circles.push(
                <div
                    key={i}
                    className={`w-3 h-3 rounded-full cursor-pointer ${i === viewCount - 1 ? 'bg-white' : 'bg-neutral'}`}
                    onClick={() => setViewCount(i + 1)}
                ></div>)
        }
        return circles
    }

    return (
        <>
            <Modal modalId={viewDebitPaymentId} title={selectedDebit?.title} footer={selectedDebit?.dateDue}>
                <div className='flex flex-col items-center justify-center gap-10'>
                    <ViewDebit debit={selectedDebit}></ViewDebit>
                </div>
            </Modal>
            <div className="flex items-center justify-center w-full gap-10 p-1 my-auto 5xl:gap-16 5xl:p-2">

                <IonIcon className={`w-12 h-12 cursor-pointer 4xl:w-20 4xl:h-20 text-neutral ${viewCount === 1 ? "invisible" : "inline-flex"}`} icon={chevronBackSharp} onClick={() => {
                    if (viewCount > 1)
                        setViewCount(prev => prev - 1)
                }} />
                {
                    debits?.map((debit, index) => {
                        const { title, totalAmount, monthlyAmount, dateDue } = debit
                        if (index < viewCount * 3 && index >= (viewCount - 1) * 3) {

                            return (
                                <label htmlFor={viewDebitPaymentId} key={index} className='flex flex-col items-center justify-center group' onClick={() => {
                                    setSelectedDebit(debit)
                                }}>


                                    <div className="flex items-center justify-center w-24 h-24 4xl:w-32 4xl:h-32 rounded-full cursor-pointer border-[4px] group-hover:text-neutral group-hover:bg-accent border-neutral bg-neutral text-accent"
                                    >
                                        <h2 className='m-0 text-4xl 4xl:text-6xl group-hover:hidden '>{title[0].toUpperCase() + title[1].toUpperCase()}</h2>
                                        <h2 className='hidden m-0 text-4xl 4xl:text-6xl group-hover:inline-flex '>{title[0].toUpperCase() + title[1].toUpperCase()}</h2>
                                    </div>
                                    <div className='flex justify-center 3xl:mt-4 '>
                                        <h1 className='m-0 text-3xl font-semibold text-neutral'>{title}</h1>
                                    </div>
                                </label>
                            )
                        }

                    })
                }
                <IonIcon className={`w-12 h-12 cursor-pointer 4xl:w-20 4xl:h-20 text-neutral ${viewCount === Math.ceil(debits.length / 3) ? "invisible" : "inline-flex"}`} icon={chevronForwardSharp} onClick={() => {
                    if (viewCount < Math.ceil(debits.length / 3))
                        setViewCount(prev => prev + 1)
                }} />
            </div>
            <div className='flex gap-3 p-4'>
                <Circles></Circles>
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
            <BillsView bills={bills} userId={userId} paymentMutate={paymentMutate} username={username} balMutate={balMutate}></BillsView>
            :
            <DebitsView debits={debits} ></DebitsView>

    )
}
