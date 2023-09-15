import { Input, Loading } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import addBirthdayGift from '../../../pipes/addBirthdayGift'
import { IonApp, IonBackButton, IonButtons, IonHeader, IonToolbar } from "@ionic/react";
import { caretBack } from "ionicons/icons";
import Notification from '../Notification';

export default function BirthdayGift({ session, subUser, paidBirthdayMutate }) {
    //console.log("subUser", subUser)
    const [submitting, setSubmitting] = useState(false)
    const [successfulSubmit, setSuccessfulSubmit] = useState(false)
    const { register, handleSubmit, formState: { errors }, reset, setError, clearErrors, watch } = useForm({ defaultValues: {} })
    const [submitStatus, setSubmitStatus] = useState("")

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

    async function handleCreate({ amount }) {
        const res = await addBirthdayGift({
            mainUsername: session.user.username,
            mainID: session.user.id,
            subId: subUser.id,
            subUsername: subUser.username,
            amount,
            subDOB: subUser.dateOfBirth
        })
        setSubmitting(false)
        if (res.success == true) {
            paidBirthdayMutate()
            setSubmitStatus("success")
            reset()

        }
        else {
            setSubmitStatus("error")

        }
    }

    function onSubmit({ amount }, e) {
        setSubmitting(true)
        handleCreate({ amount })
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
                <h1 className='self-start m-0 text-3xl font-bold text-primary'>Birthday for {subUser?.name.split(" ")[0]}</h1>
                {!submitStatus ?
                    <form className="flex flex-col items-center justify-center w-full gap-10 p-2 bg-neutral" onSubmit={handleSubmit(onSubmit, onError)}>
                        <p className="font-bold text-center text-xl text-[#FFFBF9]">
                            Their birthday is in two days or less!
                            <br></br>
                            Send him a Gift
                        </p>
                        <Input
                            width='100%'
                            underlined
                            placeholder="Amount"
                            status={errors.amount ? "error" : "default"}
                            id='amount'
                            {...register("amount", { required: "Please enter your amount" })}
                            style={{ color: "#FFFBF9" }}
                            css={{
                                tt: " ",
                                fontSize: "1.4rem",
                                "::placeholder ": { "color": "#D7D7D7" },
                                "::after": { background: "#EFF6BD" },
                                "::before": { background: "#9A82BF" },
                            }}
                        />

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

                    </form>
                    :
                    <Notification message={"Gifting"} submitStatus={submitStatus} setSubmitStatus={setSubmitStatus} />
                }
            </div>
        </IonApp>
    )
}
