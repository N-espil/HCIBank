import { useForm } from "react-hook-form";
import { useRouter } from 'next/router'
import { useEffect, useState, } from 'react'
import { Input, Checkbox, Loading } from '@nextui-org/react';
import editPresetBill from "../../../pipes/editPresetBill";
import editCustomBill from "../../../pipes/editCustomBill";
import NotificationSmall from "../NotificationSmall";

export default function EditBill({ bill , modalId, userId, paymentMutate}) {

    const [submitting, setSubmitting] = useState(false)
    const [submitStatus, setSubmitStatus] = useState("")
    const { register, handleSubmit, formState: { errors }, reset, setError, clearErrors } = useForm({ defaultValues: {} })


    //title: bill?.title
    useEffect(() => {
        reset({ amount: bill?.amount, autoPayment: bill?.automated })
    }, [bill])

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

    async function handleCreate({ amount, autoPayment }) {
        let res = bill?.isCustom ?  await editCustomBill({ id: bill.id, title: bill.title, amount, autoPayment }) : await editPresetBill({ id: bill.id, title: bill.title, amount, autoPayment })
        setSubmitting(false)
        if (res.success == true) {
            setSubmitStatus("success")
            reset()
            paymentMutate()
        }
        else {
            setSubmitStatus("error")

        }
    }

    function onSubmit({ amount, autoPayment }, e) {

        if (amount == bill.amount && autoPayment == bill.autoPayment){
            setError("amount", {message: "Change Something"})
            setError("autoPayment", {message: "Change Something"})
            return
        }
        setSubmitting(true)
        handleCreate({ amount, autoPayment })
    }
    function onError(errors, e) {
        console.log(errors, e)

    }

    return (
        !submitStatus ?
            <form className="flex flex-col items-center justify-center w-full gap-10 p-2 my-auto" onSubmit={handleSubmit(onSubmit, onError)}>

                <Input
                    width='100%'
                    underlined
                    placeholder="Amount"
                    status={errors.amount ? "error" : "#EFF6BD"}
                    id='amount'
                    type="text"
                    style={{ color: "#EFF6BD" }}
                    css={{
                        tt: " ",
                        color: "#EFF6BD",
                        fontSize: "1.4rem",
                        "::placeholder ": { "color": "#EFF6BD" },
                        "::after": { background: "#ADC172" },
                        "::before": { background: "#EFF6BD" },
                    }}
                    {...register("amount", { required: "Please enter your bill amount" })}
                />
                <div className="flex items-center justify-center gap-5 cursor-pointer">
                    <input
                        {...register("autoPayment")}
                        id='autoPayment'
                        type="checkbox"
                        defaultChecked={bill?.autoPayment}
                        className={`p-0 m-0 checkbox border-2 ${errors.autoPayment ? "checkbox-error": "checkbox-accent"}`} />
                    <label
                        htmlFor="autoPayment"
                        className="m-0 text-xl font-normal text-[#FFFBF9] cursor-pointer select-none"
                    >Automate Payment?</label>
                </div>

                <button
                    type="submit"
                    disabled={submitting}
                    className='px-8 text-xl rounded-full hover:bg-accent hover:text-neutral bg-secondary text-neutral btn-outline-neutral btn '
                >
                    {submitting ? <Loading color="currentColor" size="sm" /> : " Submit"}

                </button>

            </form >
            :
            <NotificationSmall message={"Edit"} submitStatus={submitStatus} setSubmitStatus={setSubmitStatus} />
    )
}
