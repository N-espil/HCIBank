import { useForm } from "react-hook-form";
import { useEffect, useState, } from 'react'
import editUser from '../../../pipes/editUser';
import { Input, Loading } from '@nextui-org/react';
import NotificationSmall from '../NotificationSmall';

export default function EditUser({ user, mainId, familyMutate }) {

    const [submitting, setSubmitting] = useState(false)
    const [submitStatus, setSubmitStatus] = useState("")
    const { register, handleSubmit, formState: { errors }, reset, setError, clearErrors } = useForm({ defaultValues: {} })


    useEffect(() => {
        reset({ fname: user?.name.split(" ")[0], lname: user?.name.split(" ")[1], allowance: user?.allowance })
    }, [user])

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


    async function handleCreate({ fname, lname, allowance }) {
        let res = await editUser({ name: fname + ' ' + lname, allowance: allowance, subId: user.id, mainId: mainId })
        setSubmitting(false)
        console.log(res)
        if (res.success == true) {
            familyMutate()
            reset()
            setSubmitStatus("success")
        }
        else {
            setSubmitStatus("error")
        }
    }

    function onSubmit({ fname, lname, allowance }, e) {
        if (fname + ' ' + lname == user.name && allowance == user.allowance) {
            setError('fname', { message: "Change Something" })
            setError('lname', { message: "Change Something" })
            setError('allowance', { message: "Change Something" })
            return
        }
        setSubmitting(true)
        handleCreate({ fname, lname, allowance })
    }
    function onError(errors, e) {
        console.log(errors, e)

    }

    return (
        <>
            {!submitStatus ?
                <form className="flex flex-col w-full gap-10 p-2 my-auto" onSubmit={handleSubmit(onSubmit, onError)}>
                    <Input
                        width='100%'
                        underlined
                        placeholder="First Name"
                        status={errors.fname ? "error" : "default"}
                        id='fname'
                        type="text"
                        {...register("fname", { required: "Please enter your first name", max: { value: 30, message: "Max name length is 30" } })}
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
                        placeholder="Last Name"
                        status={errors.lname ? "error" : "default"}
                        id='lname'
                        type="text"
                        {...register("lname", { required: "Please enter your last name", max: { value: 30, message: "Max name length is 30" } })}
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

                    {user?.allowance && <Input
                        width='100%'
                        underlined
                        placeholder="Allowance"
                        status={errors.allowance ? "error" : "default"}
                        id='allowance'
                        type="text"
                        {...register("allowance", { required: "Please enter an allowance" })}
                        style={{ color: "#EFF6BD" }}
                        css={{
                            tt: " ",
                            color: "#EFF6BD",
                            fontSize: "1.4rem",
                            "::placeholder ": { "color": "#EFF6BD" },
                            "::after": { background: "#ADC172" },
                            "::before": { background: "#EFF6BD" },
                        }}
                    />}

                    <button
                        type="submit"
                        disabled={submitting}
                        className='px-8 text-xl rounded-full hover:bg-accent hover:text-neutral bg-secondary text-neutral btn-outline-neutral btn btn-wide '
                    >
                        {submitting ? <Loading color="currentColor" size="sm" /> : " Submit"}
                    </button>

                </form>
                :
                <NotificationSmall message={"Edit"} submitStatus={submitStatus} setSubmitStatus={setSubmitStatus} />
            }
        </>
    )
}
