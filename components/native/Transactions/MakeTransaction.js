import React, { use } from 'react'
import { useForm } from "react-hook-form";
import useSWR from 'swr'
import { WEB_URL } from '../../../util/keys';
import { useRouter } from 'next/router'
import { useEffect, useState, useMemo } from 'react'
import addTransaction from '../../../pipes/addTransaction'
import addBeneficiary from '../../../pipes/addBeneficiary';
import { useSession } from "next-auth/react"
import { Input, Button, Dropdown, Loading } from '@nextui-org/react';
import { IonApp, IonBackButton, IonButtons, IonHeader, IonToolbar } from '@ionic/react';
import { caretBack } from 'ionicons/icons';
import Notification from '../Notification';


export default function MakeTransaction({ family, transactionMutate, beneficiaries, balance, balMutate, benMutate, defaultBeneficiary = null }) {
    beneficiaries = beneficiaries?.beneficiaries.map((i) => {
        return { name: i.beneficiaryName, username: i.beneficiaryUsername, id: i.beneficiaryId }
    })
    family = family?.subUsers.concat(beneficiaries)

    let router = useRouter()
    const { tab, username } = router.query

    if (username && document.getElementById('username')) {
        document.getElementById('username').value = username
    }

    const [selected, setSelected] = useState(!username ? !defaultBeneficiary ? new Set(["Choose a Beneficiary"]) : new Set([defaultBeneficiary.username]) : new Set([username]));

    const selectedValue = useMemo(
        () => Array.from(selected).join(", ").replaceAll("_", " "),
        [selected]
    )
    const [submitting, setSubmitting] = useState(false)
    const [tabView, setTabView] = useState(1)
    const [saveBeneficiary, setSaveBeneficiary] = useState("yes")
    const [submitStatus, setSubmitStatus] = useState("")

    const { register, handleSubmit, formState: { errors }, reset, setError } = useForm({ defaultValues: {} })

    const { data: session, status } = useSession()



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

    async function handleCreate({ username, amount, comment }) {

        const toUsername = tabView == 1 ? Array.from(selected)[0] : username;

        let res = await addTransaction(
            {
                fromName: session.user.username,
                fromID: session.user.id,
                toUsername: toUsername,
                amount: amount,
                comment: comment,
                type: "Transferring"
            })
        setSubmitting(false)
        if (tabView == 2 && saveBeneficiary == "yes") {
            let allowed = true
            family.forEach((f) => {
                if (f.username == username) {
                    allowed = false
                }
            })
            if (allowed) {

                let res2 = await addBeneficiary({ userId: session.user.id, beneficiaryUsername: username })
                if (res.success && res2.success) {
                    balMutate()
                    transactionMutate()
                    benMutate()
                    reset()
                    setSubmitStatus("success")
                    setSubmitting(false)
                }
                else {
                    setError('username', { message: "failed" })
                    setSubmitting(false)
                    setSubmitStatus("error")

                }
            }
            else {
                setError('username', { message: "failed" })
                setSubmitting(false)
                setSubmitStatus("error")

            }
        }
        else {
            if (res.success) {
                balMutate()
                transactionMutate()
                reset()
                setSubmitting(false)
                setSubmitStatus("success")

                //call the mutate called transactionMutate in the TransactionList.js here
            }
            else {
                setError('username', { message: "user not found" })
                setSubmitting(false)
                setSubmitStatus("error")

            }
        }
    }

    function onSubmit({ username, amount, comment }, e) {
        setSubmitting(true)
        let duplicate = false
        beneficiaries.forEach((b) => {
            if (b.username == username) {
                setError('username', { message: "Username already added" })
                setSubmitting(false)
                duplicate = true
            }
        })

        if (duplicate) {
            return
        }

        if (tabView == 1 && Array.from(selected)[0] == "Choose A Beneficiary") {
            setError('dependent', { message: "Choose A Beneficiary" })
        }

        if (session.user.username == username) {
            setError('username', { message: "Cannot send to yourself" })
        }
        else if (amount > balance || amount == 0) {
            setError('amount', { message: "Not enough balance" })
        }
        else {
            setSubmitting(true)
            handleCreate({ username, amount, comment })
        }
    }

    function onError(errors, e) {
        console.log("useForm Error", errors, e)
    }

    return (
        <IonApp>
            <IonHeader >
                <IonToolbar color="medium" className='border-none' style={{ border: "none !important" }}>
                    <IonButtons slot="start" >
                        <IonBackButton defaultHref='/' id="back" icon={caretBack} text={"Back"} className="custom-back-button"></IonBackButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <div className='flex flex-col w-full h-screen gap-5 px-5 pt-5 bg-neutral'>
                <h1 className='self-start m-0 text-3xl font-bold text-primary'>Transfer To</h1>
                <div className="flex justify-center w-full pb-2 mt-3 border-b tabs border-neutral">
                    <h6 onClick={() => setTabView(1)}
                        className={`m-0 text-lg tab ${tabView == 1 ? "text-secondary  font-bold" : "text-[#D7D7D7]"}`}>Saved Beneficiaries</h6>
                    <h6 onClick={() => setTabView(2)}
                        className={`m-0 text-lg tab ${tabView == 2 ? "text-secondary font-bold" : "text-[#D7D7D7]"}`}>New Beneficiary</h6>
                </div>
                {tabView == 1 &&
                    (!submitStatus ?
                        <form className="flex flex-col self-center w-full max-w-md gap-10 p-2 mt-[3rem] 4xl:mt-[6rem]" onSubmit={handleSubmit(onSubmit, onError)}>
                            <>
                                <Input

                                    underlined
                                    placeholder="Amount"
                                    status={errors.amount ? "error" : "default"}
                                    id='amount'
                                    type="text"
                                    size='medium'
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
                                <Input
                                    underlined
                                    placeholder="Description"
                                    status={errors.comment ? "error" : "default"}
                                    id='comment'
                                    type="text"
                                    size='medium'
                                    {...register("comment",
                                        {
                                            required: "Please enter a comment",
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

                            </>
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
                        <Notification message={"Transfer"} submitStatus={submitStatus} setSubmitStatus={setSubmitStatus} />

                    )
                }
                {tabView == 2 &&
                    (!submitStatus ?
                        <form className="flex flex-col self-center w-full max-w-md gap-10 p-2 mt-[1rem] 2xl:mt-[3rem] 4xl:mt-[6rem]" onSubmit={handleSubmit(onSubmit, onError)}>
                            <Input
                                underlined
                                placeholder="Username"
                                status={errors.username ? "error" : "default"}
                                id='username'
                                type="text"
                                size='medium'
                                {...register("username",
                                    {
                                        required: "Please enter a username",
                                    })
                                }
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
                                underlined
                                placeholder="Amount"
                                status={errors.amount ? "error" : "default"}
                                id='amount'
                                type="text"
                                size='medium'
                                color='$neutral'
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
                            <Input
                                underlined
                                placeholder="Description"
                                status={errors.comment ? "error" : "default"}
                                id='comment'
                                type="text"
                                size='medium'
                                {...register("comment",
                                    {
                                        required: "Please enter a comment",
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


                            <div className='flex items-center justify-between' >
                                <h3 className='text-xl font-semibold text-accent' >Save this beneficiary?</h3>
                                <div className="btn-group" id='save'>
                                    <div
                                        type='button'

                                        onClick={() => setSaveBeneficiary("yes")}
                                        className={`${saveBeneficiary == "yes" ? "bg-accent hover:bg-accent" : "text-neutral bg-neutral hover:bg-accent "} border-accent border-[3px] border-r-0 transition-all duration-200  ease-in-out p-2  px-4 rounded-xl rounded-r-none cursor-pointer `}
                                    >
                                        <p className={`${saveBeneficiary == "yes" ? "text-neutral" : "text-secondary "} text-xl font-semibold`}>Yes</p>
                                    </div>
                                    <div
                                        type='button'
                                        onClick={() => setSaveBeneficiary("no")}
                                        className={`${saveBeneficiary == "no" ? "bg-accent text-neutral hover:bg-accent" : "text-neutral bg-neutral hover:bg-accent"} border-accent border-[3px]  transition-all duration-200 ease-in-out p-2 px-4 rounded-xl rounded-l-none cursor-pointer `}
                                    >
                                        <p className={`${saveBeneficiary == "no" ? "text-neutral" : "text-secondary "} text-xl font-semibold`}>No</p>
                                    </div>
                                </div>
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
                        </form>
                        :
                        <Notification message={"Transfer"} submitStatus={submitStatus} setSubmitStatus={setSubmitStatus} />
                    )
                }

            </div>
        </IonApp>
    )
}
