import { useForm } from "react-hook-form";
import { useRouter } from 'next/router'
import { useEffect, useState, } from 'react'
import { Input, Checkbox, Loading } from '@nextui-org/react';
import addDebit from "../../../pipes/addDebit";
import NotificationSmall from "../NotificationSmall";
export default function AddDebit({ modalId, session, paymentMutate }) {

    const [submitting, setSubmitting] = useState(false)
    const [submitStatus, setSubmitStatus] = useState("")
    const [debitInstallment, setDebitInstallment] = useState(0)
    const [installmentsLeft, setInstallmentsLeft] = useState(0)
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




    async function handleCreate({ totalAmount, finalDate, title }) {
        // const dateString = finalDate;
        const dateDue = new Date(finalDate)
        let res = await addDebit({ userId: session.user.id, title, totalAmount, dateDue, monthlyAmount: debitInstallment, installmentsLeft: installmentsLeft })
        setSubmitting(false)

        if (res.success == true) {
            reset()
            setSubmitStatus("success")
            setDebitInstallment(0)
            paymentMutate()
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
        !submitStatus ?
            <form className="flex flex-col w-full gap-10 p-2 my-auto" onSubmit={handleSubmit(onSubmit, onError)}>

                <Input
                    width='100%'
                    underlined
                    placeholder="Debit Title"
                    status={errors.title ? "error" : "default"}
                    id='title'
                    {...register("title", { required: "Please enter your debit title" })}
                    style={{ color: "#EFF6BD" }}
                    css={{
                        tt: " ",
                        color: "#EFF6BD",
                        fontSize: "1.4rem",
                        "::placeholder ": { "color": "#EFF6BD" },
                        "::after": { background: "#ADC172" },
                        "::before": { background: "#EFF6BD" },
                    }}
                />

                <Input
                    width='100%'
                    underlined
                    placeholder="Total Amount"
                    status={errors.amount ? "error" : "default"}
                    id='amount'
                    {...register("totalAmount", { required: "Please enter your total amount" })}
                    style={{ color: "#EFF6BD" }}
                    css={{
                        tt: " ",
                        color: "#EFF6BD",
                        fontSize: "1.4rem",
                        "::placeholder ": { "color": "#EFF6BD" },
                        "::after": { background: "#ADC172" },
                        "::before": { background: "#EFF6BD" },
                    }}
                />

                <Input
                    width='100%'
                    underlined
                    placeholder='Final Date'
                    status={errors.dob ? "error" : "default"}
                    type="date"
                    id='date'
                    {...register("finalDate",
                        {
                            required: "Please enter a date",
                        })}
                    style={{ color: "#EFF6BD" }}
                    css={{
                        tt: " ",
                        // color: "#EFF6BD",
                        fontSize: "1.4rem",
                        // "::placeholder ": { "color": "#EFF6BD" },
                        "::after": { background: "#ADC172" },
                        "::before": { background: "#EFF6BD" },
                    }}

                />

                {debitInstallment > 0 && <p className='text-lg font-normal text-center  text-[#FFFBF9]'>Installment: AED {debitInstallment.toFixed(2)} per month</p>}

                <button
                    type="submit"
                    disabled={submitting}
                    className='px-8 text-xl rounded-full hover:bg-accent hover:text-neutral bg-secondary text-neutral btn-outline-neutral btn btn-wide '
                >
                    {submitting ? <Loading color="currentColor" size="sm" /> : " Submit"}

                </button>

            </form >
            :
            <NotificationSmall message={"Adding"} submitStatus={submitStatus} setSubmitStatus={setSubmitStatus} />

    )
}
