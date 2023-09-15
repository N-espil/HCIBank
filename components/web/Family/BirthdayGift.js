import { Input, Loading } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import addBirthdayGift from '../../../pipes/addBirthdayGift'
import NotificationSmall from '../NotificationSmall'


export default function BirthdayGift({ session, subUser, paidBirthdayMutate }) {
    const [submitting, setSubmitting] = useState(false)
    const [submitStatus, setSubmitStatus] = useState("")
    const { register, handleSubmit, formState: { errors }, reset} = useForm({ defaultValues: {} })


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

    async function handleCreate({ amount }) {
        let res = await addBirthdayGift({ mainUsername: session.user.username, mainID: session.user.id, subId: subUser.id, subUsername: subUser.username, amount, subDOB: subUser.dateOfBirth })
        setSubmitting(false)
        console.log(res)
        if (res.success == true) {
            reset()
            paidBirthdayMutate()
            setSubmitStatus("success")
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
        (!submitStatus || (submitStatus !== "success" && submitStatus !== "error")) ?
            <form className="flex flex-col w-full gap-10 p-2 my-auto" onSubmit={handleSubmit(onSubmit, onError)}>
                <p className="font-bold text-center text-[#FFFBF9]">
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
                <button
                    type="submit"
                    disabled={submitting}
                    className='px-8 text-xl rounded-full hover:bg-accent hover:text-neutral bg-secondary text-neutral btn-outline-neutral btn btn-wide '
                >
                    {submitting ? <Loading color="currentColor" size="sm" /> : " Submit"}
                </button>

            </form>
            :
            <NotificationSmall message={"Gifting"} submitStatus={submitStatus} setSubmitStatus={setSubmitStatus}></NotificationSmall>
    )
}
