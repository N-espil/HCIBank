import { useForm } from "react-hook-form";
import { useEffect, useState, } from 'react'
import { Input, Checkbox, Loading } from '@nextui-org/react';
import addCustomBill from "../../../pipes/addCustomBill";
import NotificationSmall from "../NotificationSmall";

export default function AddCustomBill({ modalId, session, paymentMutate }) {

    const [submitting, setSubmitting] = useState(false)
    const [submitStatus, setSubmitStatus] = useState("")
    const { register, handleSubmit, formState: { errors }, reset, setError, clearErrors } = useForm({ defaultValues: {} })


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


    async function handleCreate({ amount, autoPayment, title }) {
        let res = await addCustomBill({ userId: session.user.id, title, amount, autoPayment })
        setSubmitting(false)
        if (res.success == true) {
            reset()
            paymentMutate()
            setSubmitStatus("success")
            // document.getElementById(modalId).click();
        }
        else {
            setSubmitStatus("error")

        }
    }

    function onSubmit({ amount, autoPayment, title }, e) {
        if (title.toLowerCase() === "water" || title === "electricity" || title === "internet") {
            setError("title", { type: "manual", message: "Please enter a custom bill title" })
            return
        }
        setSubmitting(true)
        handleCreate({ amount, autoPayment, title })
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
                    placeholder="Bill Title"
                    status={errors.title ? "error" : "default"}
                    id='title'
                    {...register("title", { required: "Please enter your bill title" })}
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
                    placeholder="Amount"
                    status={errors.amount ? "error" : "default"}
                    id='amount'
                    {...register("amount", { required: "Please enter your bill amount" })}
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
                <div className="flex items-center justify-center gap-5 cursor-pointer">
                    <input
                        {...register("autoPayment")}
                        id='autoPayment'
                        type="checkbox"
                        className={`p-0 m-0 checkbox border-2 ${errors.autoPayment ? "checkbox-error" : "checkbox-accent"}`} />
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
            <NotificationSmall message={"Adding"} submitStatus={submitStatus} setSubmitStatus={setSubmitStatus} />

    )
}
