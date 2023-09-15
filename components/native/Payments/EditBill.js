import { useForm } from "react-hook-form";
import { useRouter } from 'next/router'
import { useEffect, useState, } from 'react'
import { Input, Checkbox, Loading } from '@nextui-org/react';
import editPresetBill from "../../../pipes/editPresetBill";
import editCustomBill from "../../../pipes/editCustomBill";
import { IonApp, IonBackButton, IonButtons, IonHeader, IonToolbar } from "@ionic/react";
import { caretBack } from "ionicons/icons";
import Notification from "../Notification";

export default function EditBill({ bill, userId, paymentMutate }) {

    const [submitting, setSubmitting] = useState(false)
    const [submitStatus, setSubmitStatus] = useState("")
    const { register, handleSubmit, formState: { errors }, reset, setError, clearErrors } = useForm({ defaultValues: {} })

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


    useEffect(() => {
        if (submitStatus == "done") {
            document.getElementById("back").click()
        }
    }, [submitStatus])

    async function handleCreate({ amount, autoPayment }) {
        let res = bill?.isCustom ? await editCustomBill({ id: bill.id, title: bill.title, amount, autoPayment }) : await editPresetBill({ id: bill.id, title: bill.title, amount, autoPayment })
        // console.log(res)
        setSubmitting(false)
        if (res) {
            setSubmitStatus("success")
            reset()
            paymentMutate()
        }
        else {
            setSubmitStatus("error")
        }
    }

    function onSubmit({ amount, autoPayment }, e) {

        if (amount == bill.amount && autoPayment == bill.autoPayment) {
            setError("amount", { message: "Change Something" })
            setError("autoPayment", { message: "Change Something" })
            return
        }
        setSubmitting(true)
        handleCreate({ amount, autoPayment })
    }
    function onError(errors, e) {
        console.log(errors, e)

    }

    return (
        <IonApp>
            <IonHeader >
                <IonToolbar color="dark" className='border-none' style={{ border: "none !important" }}>
                    <IonButtons slot="start" >
                        <IonBackButton id="back" defaultHref='/' icon={caretBack} text={"Back"} className="custom-back-button"></IonBackButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <div className='flex flex-col w-full h-screen gap-5 px-5 pt-5 bg-neutral'>
                <h1 className='self-start m-0 text-3xl font-bold text-primary'>Edit {bill?.title} Bill</h1>
                {!submitStatus ?
                    <form className="flex flex-col items-center justify-center w-full gap-10 p-2 bg-neutral" onSubmit={handleSubmit(onSubmit, onError)}>

                        <Input
                            width='100%'
                            underlined
                            placeholder="Amount"
                            label="Amount"
                            status={errors.amount ? "error" : "primary"}
                            id='amount'
                            type="text"
                            size="xl"
                            style={{ color: "#FFFBF9" }}
                            css={{
                                tt: " ",
                                fontSize: "1.4rem",
                                "::placeholder ": { "color": "#D7D7D7" },
                                "::after": { background: "#EFF6BD" },
                                "::before": { background: "#9A82BF" },


                            }}
                            {...register("amount", { required: "Please enter your bill amount" })}
                        />
                        <div className="flex items-center justify-center gap-5 cursor-pointer">
                            <input
                                {...register("autoPayment")}
                                id='autoPayment'
                                type="checkbox"
                                defaultChecked={bill?.autoPayment}
                                className={`p-0 m-0 checkbox border-2 ${errors.autoPayment ? "checkbox-error" : "checkbox-accent"}`} />
                            <label
                                htmlFor="autoPayment"
                                className="m-0 text-xl font-normal text-[#FFFBF9] cursor-pointer select-none"
                            >Automate Payment?</label>
                        </div>
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
                    <Notification message={"Edit Bill"} submitStatus={submitStatus} setSubmitStatus={setSubmitStatus} />
                }
            </div>

        </IonApp>
    )
}