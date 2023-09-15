import { useForm } from "react-hook-form";
import { useRouter } from 'next/router'
import { useEffect, useState, useMemo } from 'react'
import addAllowance from '../../../pipes/addAllowance'
import { Input, Dropdown, Loading } from '@nextui-org/react';
import { IonApp, IonBackButton, IonButtons, IonHeader, IonToolbar } from '@ionic/react';
import { caretBack } from 'ionicons/icons';
import Notification from "../Notification";


export default function SetAllowance({ session, family }) {
    let router = useRouter()
    const { tab, username } = router.query

    if (username && document.getElementById('username')) {
        document.getElementById('username').value = username
    }

    const [selected, setSelected] = useState(!username ? new Set(["Choose a Dependent"]) : new Set([username]));

    const selectedValue = useMemo(
        () => Array.from(selected).join(", ").replaceAll("_", " "),
        [selected]
    )
    const [submitting, setSubmitting] = useState(false)
    const { register, handleSubmit, formState: { errors }, reset, setError, clearErrors } = useForm({ defaultValues: {} })
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
        if (selectedValue == "Choose a Dependent")
            setError("dependent", { message: "Please choose a dependent" })
        else {
            clearErrors("dependent")
        }
    }, [selectedValue])

    useEffect(() => {
        if (submitStatus == "done") {
            document.getElementById("back").click()
        }
    }, [submitStatus])

    async function handleCreate({ subId, amount }) {
        let res = await addAllowance({ mainId: session.user.id, subId: subId, amount: amount })

        setSubmitting(false)
        if (res.success == true) {
            setSubmitStatus("success")
            reset()
        }
        else {
            setSubmitStatus("error")
        }
    }

    function onSubmit({ amount }, e) {
        let subId = ""
        if (selectedValue == "Choose a Dependent")
            setError("dependent", { message: "Please choose a dependent" })
        else {
            clearErrors("dependent")
        }
        family.forEach((sub) => {
            if (sub.username == selectedValue)
                subId = sub.id
        })
        setSubmitting(true)
        handleCreate({ subId, amount })

    }
    function onError(errors, e) {
        console.log(selectedValue)
        if (selectedValue == "Choose a Dependent")
            setError("dependent", { message: "Please choose a dependent" })
        else {
            clearErrors("dependent")
        }
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
                <h1 className='self-start m-0 text-3xl font-bold text-primary'>Set Allowance</h1>
                {!submitStatus ?
                    <form className="flex flex-col w-full max-w-md gap-10 p-2 " onSubmit={handleSubmit(onSubmit, onError)}>

                        <Input
                            underlined
                            placeholder="Amount"
                            status={errors.amount ? "error" : "default"}
                            size="xl"
                            id='amount'
                            type="text"
                            {...register("amount",
                                {
                                    required: "Please enter an amount",
                                })}
                            style={{ color: "#FFFBF9" }}
                            css={{
                                tt: " ",
                                fontSize: "1.4rem",
                                "::placeholder ": { "color": "#D7D7D7" },
                                "::after": { background: "#EFF6BD" },
                                "::before": { background: "#9A82BF" },


                            }}

                        />

                        <Dropdown >
                            <Dropdown.Button className='self-center p-1 text-2xl' color={errors.dependent ? "error" : "#242529"} css={{ tt: " ", background: "#ADC172", color: "#242529", fontSize: "1.4rem", borderRadius: "15px", height: "3.8rem", width: "90%" }} >
                                {selectedValue}
                            </Dropdown.Button>
                            <Dropdown.Menu
                                items={family}
                                css={{
                                    tt: " ",
                                    background: "#242529",
                                    color: "#EFF6BD",

                                }}
                                aria-label="Single selection actions"
                                disallowEmptySelection
                                selectionMode="single"
                                selectedKeys={selected}
                                onSelectionChange={setSelected}

                            >
                                {(item) => {
                                    return (
                                        item.username === selectedValue ?
                                            <Dropdown.Item
                                                css={{
                                                    tt: " ",
                                                    color: "#EFF6BD",
                                                    background: '#000000',
                                                }}
                                                key={item.username}
                                            >
                                                {item.name}
                                            </Dropdown.Item>
                                            :
                                            <Dropdown.Item
                                                css={{
                                                    tt: " ",
                                                    color: "#EFF6BD",
                                                    background: '#242529',
                                                    '&:hover': {
                                                        background: '#000000',
                                                    },
                                                }}
                                                key={item.username}
                                            >
                                                {item.name}
                                            </Dropdown.Item>

                                    )
                                }}
                            </Dropdown.Menu>
                        </Dropdown>

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
                    <Notification message = { "Set allowance" } submitStatus={submitStatus} setSubmitStatus={setSubmitStatus} />
                }
            </div>
        </IonApp>
    )
}
