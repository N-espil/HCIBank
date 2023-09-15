import { useForm } from "react-hook-form";
import { useEffect, useState, } from 'react'
import { Input, Loading } from '@nextui-org/react';
import addCustomBill from "../../../pipes/addCustomBill";
import { IonApp, IonBackButton, IonButtons, IonHeader, IonToolbar } from "@ionic/react";
import { caretBack } from "ionicons/icons";
import Notification from "../Notification";

export default function AddCustomBill({ session, paymentMutate }) {

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

    useEffect(() => {
        if (submitStatus == "done") {
            document.getElementById("back").click()
        }
    }, [submitStatus])

    async function handleCreate({ amount, autoPayment, title }) {

        let res = await addCustomBill({ userId: session.user.id, title, amount, autoPayment })

        setSubmitting(false)
        if (res.success == true) {
            setSubmitStatus("success")
            paymentMutate()
            reset()
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
        <IonApp>
            <IonHeader >
                <IonToolbar color="medium" className='border-none' style={{ border: "none !important" }}>
                    <IonButtons slot="start" >
                        <IonBackButton id="back" defaultHref='/' icon={caretBack} text={"Back"} className="custom-back-button"></IonBackButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <div className='flex flex-col w-full h-screen gap-5 px-5 pt-5 bg-neutral'>
                <h1 className='self-start m-0 text-3xl font-bold text-primary'>Add Bill</h1>
                {!submitStatus ?
                    <form className="flex flex-col w-full gap-10 p-2 " onSubmit={handleSubmit(onSubmit, onError)}>

                        <Input
                            width='100%'
                            underlined
                            placeholder="Bill Title"
                            status={errors.title ? "error" : "default"}
                            id='title'
                            {...register("title", { required: "Please enter your bill title" })}
                            style={{ color: "#FFFBF9" }}
                            size="xl"
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
                            placeholder="Amount"
                            status={errors.amount ? "error" : "default"}
                            id='amount'
                            {...register("amount", { required: "Please enter your bill amount" })}
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
                    <Notification message={"Adding Bill"} submitStatus={submitStatus} setSubmitStatus={setSubmitStatus} />
                }
            </div>
        </IonApp>
    )
}
