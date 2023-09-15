import { useForm } from "react-hook-form";
import { useEffect, useState, } from 'react'
import { Input, Loading } from '@nextui-org/react';
import addDebit from "../../../pipes/addDebit";
import { IonApp, IonBackButton, IonButtons, IonHeader, IonToolbar } from "@ionic/react";
import { caretBack } from "ionicons/icons";
import Notification from "../Notification";

export default function AddDebit({ session, paymentMutate }) {

    const [submitting, setSubmitting] = useState(false)
    const [debitInstallment, setDebitInstallment] = useState(0)
    const [installmentsLeft, setInstallmentsLeft] = useState(0)
    const [submitStatus, setSubmitStatus] = useState("")
    const { register, handleSubmit, formState: { errors }, reset, setError, clearErrors, watch } = useForm({ defaultValues: {} })
    const date = watch('finalDate')
    const totalPrice = watch('totalAmount')


    useEffect(() => {
        if (date && totalPrice) {
            let date1 = new Date(date)
            let date2 = new Date()
            let timeDiff = Math.abs(date2.getTime() - date1.getTime());
            let diffMonths = Math.ceil(timeDiff / (1000 * 3600 * 24 * 30)) - 1;
            setInstallmentsLeft(diffMonths)
            setDebitInstallment(totalPrice / (diffMonths == 0 ? 1 : diffMonths))
        }
    }, [date, totalPrice])


    useEffect(() => {
        if (submitting) {
            if (typeof window !== "undefined") {
                document.body.style.cursor = "progress"
            }
        }
        else {
            if (typeof window !== "undefined") {
                document.body.style.cursor = "auto"
            }
        }
    }, [submitting])

    useEffect(() => {
        if (submitStatus == "done") {
            document.getElementById("back").click()
        }
    }, [submitStatus])


    async function handleCreate({ totalAmount, finalDate, title }) {
        const dateDue = new Date(finalDate)
        let res = await addDebit({ userId: session.user.id, title, totalAmount, dateDue, monthlyAmount: debitInstallment, installmentsLeft: installmentsLeft })
        setSubmitting(false)

        if (res.success == true) {
            setSubmitStatus("success")
            setDebitInstallment(0)
            paymentMutate()
            reset()
        }
        else {
            setSubmitStatus("error")
        }
    }

    function onSubmit({ totalAmount, finalDate, title }, e) {


        setSubmitting(true)
        handleCreate({ totalAmount, finalDate, title })
    }
    function onError(errors, e) {
        console.log(errors, e)

    }

    return (
        <IonApp>
            <IonHeader >
                <IonToolbar color="medium" className='border-none' style={{ border: "none !important" }}>
                    <IonButtons slot="start" >
                        <IonBackButton id="back" defaultHref='/' icon={caretBack} text={"Back"} className="custom-back-button"></IonBackButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <div className='flex flex-col w-full h-screen gap-5 px-5 pt-5 bg-neutral'>
                <h1 className='self-start m-0 text-3xl font-bold text-primary'>Add Debit</h1>
                {!submitStatus ?
                    <form className="flex flex-col w-full gap-10 p-2" onSubmit={handleSubmit(onSubmit, onError)}>

                        <Input
                            width='100%'
                            underlined
                            placeholder="Debit Title"
                            status={errors.title ? "error" : "default"}
                            id='title'
                            {...register("title", { required: "Please enter your debit title" })}
                            size="xl"
                            style={{ color: "#FFFBF9" }}
                            css={{
                                tt: " ",
                                fontSize: "1.4rem",
                                "::placeholder ": { "color": "#D7D7D7" },
                                "::after": { background: "#EFF6BD" },
                                "::before": { background: "#9A82BF" },


                            }}
                        />

                        <Input
                            width='100%'
                            underlined
                            placeholder="Total Amount"
                            status={errors.amount ? "error" : "default"}
                            id='amount'
                            {...register("totalAmount", { required: "Please enter your total amount" })}
                            size="xl"
                            style={{ color: "#FFFBF9" }}
                            css={{
                                tt: " ",
                                fontSize: "1.4rem",
                                "::placeholder ": { "color": "#D7D7D7" },
                                "::after": { background: "#EFF6BD" },
                                "::before": { background: "#9A82BF" },


                            }}
                        />

                        <Input
                            width='100%'
                            underlined
                            placeholder='Final Date'
                            status={errors.dob ? "error" : "default"}
                            type="date"
                            id='date'
                            labelLeft = "Due Date"
                            {...register("finalDate",
                                {
                                    required: "Please enter a date",
                                })}
                            size="xl"
                            style={{ color: "#FFFBF9" }}
                            css={{
                                tt: " ",
                                ".nextui-input-label--left": {
                                    color: "#D7D7D7",
                                },
                                fontSize: "1.4rem",
                                "::placeholder ": { "color": "#D7D7D7" },
                                "::after": { background: "#EFF6BD" },
                                "::before": { background: "#9A82BF" },


                            }}

                        />

                        {debitInstallment > 0 && <p className='text-lg font-normal text-center text-[#D7D7D7]'>Installment: AED {debitInstallment.toFixed(2)} per month</p>}

                        <button
                            type="submit"
                            disabled={submitting}
                            style={{
                                borderColor: "#242529",
                                fontSize: "1.4rem",
                                height: "3.8rem",
                                margin: "auto",
                                border: "3px solid",

                            }}
                            className='mx-4 bg-transparent rounded-full btn-wide hover:bg-accent text-accent hover:text-neutral btn-outline-neutral btn'
                        >
                            {submitting ? <Loading color="currentColor" size="sm" /> : " Submit"}

                        </button>


                    </form >
                    :
                    <Notification message={"Adding Debit"} submitStatus={submitStatus} setSubmitStatus={setSubmitStatus} />
                }
            </div >
        </IonApp>
    )
}
