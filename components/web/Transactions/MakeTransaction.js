import React, { use } from 'react'
import { useForm } from "react-hook-form";
import useSWR from 'swr'
import { WEB_URL } from '../../../util/keys';
import { useRouter } from 'next/router'
import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import addTransaction from '../../../pipes/addTransaction'
import addBeneficiary from '../../../pipes/addBeneficiary';
import { useSession } from "next-auth/react"
import { Input, Button, Dropdown, Loading } from '@nextui-org/react';
import Notification from '../Notification';


export default function MakeTransaction({ family, transactionMutate, beneficiaries, benMutate }) {
    const { data: session, status } = useSession()
    beneficiaries = beneficiaries?.beneficiaries.map((i) => {
        return { name: i.beneficiaryName, username: i.beneficiaryUsername, id: i.beneficiaryId }
    })
    family = family?.subUsers?.concat(beneficiaries)
    console.log("FAM", family)
    let router = useRouter()
    const { tab, username } = router.query
    const fetcher = (url) => fetch(url).then(res => res.json())

    if (username && document.getElementById('username')) {
        document.getElementById('username').value = username
    }

    const [selected, setSelected] = useState(!username ? new Set(["Choose a Beneficiary"]) : new Set([username]));

    const selectedValue = useMemo(
        () => Array.from(selected).join(", ").replaceAll("_", " "),
        [selected]
    )
    const [submitStatus, setSubmitStatus] = useState("")
    const [submitting, setSubmitting] = useState(false)
    const [tabView, setTabView] = useState(1)
    const [saveBeneficiary, setSaveBeneficiary] = useState("yes")
    const { register, handleSubmit, formState: { errors }, reset, setError } = useForm({ defaultValues: {} })
    const { data, error, isLoading, mutate: balanceMutate } = useSWR(status == "authenticated" ? `${WEB_URL}/api/planetscale/user/getBalance?id=${session?.user.id}` : '', fetcher)


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

    async function handleCreate({ username, amount, comment }) {

        const toUsername = tabView == 1 ? Array.from(selected)[0] : username;

        let res = await addTransaction(
            {
                fromName: session?.user.username,
                fromID: session?.user.id,
                toUsername: toUsername,
                amount: amount,
                comment: comment,
                type: "Transferring"
            })
        setSubmitting(false)

        if (tabView == 2 && saveBeneficiary == "yes") {
            let allowed = true
            family.forEach((f)=>{
                if (f.username == username){
                    allowed = false
                }
            })

            if (allowed){
                let res2 = await addBeneficiary({ userId: session?.user.id, beneficiaryUsername: username })
                if (res.success && res2.success) {
                    reset()
                    balanceMutate()
                    transactionMutate()
                    benMutate()
                    setSubmitStatus("success")
                }
                else {
                    setError('username', { message: "failed" })
                    setSubmitStatus("error")
    
                }
            }else{
                setError('username', { message: "failed" })
                    setSubmitStatus("error")
            }
        }

        else {
            if (res.success == true) {
                reset()
                balanceMutate()
                transactionMutate()
                setSubmitStatus("success")

            }
            else {
                setError('username', { message: "user not found" })
                setSubmitStatus("error")

            }
        }
    }

    function onSubmit({ username, amount, comment }, e) {
        let duplicate = false
        beneficiaries.forEach((b) => {
            if (b.username == username) {
                setError('username', { message: "Username already added" })
                duplicate = true
            }
        })

        if (duplicate) {
            return
        }

        if (tabView == 1 && Array.from(selected)[0] == "Choose A Beneficiary") {
            setError('dependent', { message: "Choose A Beneficiary" })
        }

        if (session?.user.username == username) {
            setError('username', { message: "Cannot send to yourself" })
        }
        else if (amount > data?.balance || amount == 0) {
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
        <div className='flex flex-col items-center h-full p-5 px-5 rounded-xl bg-accent text-neutral'>
            <h1 className='self-start m-0 text-3xl font-bold 2xl:text-4xl 4xl:text-5xl'>Transfer To</h1>
            <div className="flex justify-center w-full border-b 2xl:pb-2 2xl:mt-3 tabs border-neutral">
                <h6 onClick={() => setTabView(1)}
                    className={`m-0 text-sm 2xl:text-lg 4xl:text-xl 5xl:text-2xl tab ${tabView == 1 ? "text-white font-bold" : "text-neutral"}`}>Saved Beneficiaries</h6>
                <h6 onClick={() => setTabView(2)}
                    className={`m-0 text-sm 2xl:text-lg 4xl:text-xl 5xl:text-2xl tab ${tabView == 2 ? "text-white font-bold" : "text-neutral"}`}>New Beneficiary</h6>
            </div>
            {tabView == 1 &&
                (!submitStatus ?
                    <form className="flex flex-col self-center w-full max-w-md gap-10 p-2 mt-[1rem] 2xl:mt-[3rem] 4xl:mt-[6rem]" onSubmit={handleSubmit(onSubmit, onError)}>
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
                                // style={{ color: "#EFF6BD" }}
                                css={{
                                    tt: " ",
                                    fontSize: "1.4rem",
                                    "::placeholder ": {
                                        "color": "#242529",
                                        "fontSize": "1.4rem",
                                        "@mdMax": {
                                            fontSize: "1.2rem",
                                        },
                                    },
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
                                css={{
                                    tt: " ",
                                    fontSize: "1.4rem",
                                    "::placeholder ": {
                                        "color": "#242529",
                                        "fontSize": "1.4rem",
                                        "@mdMax": {
                                            fontSize: "1.2rem",
                                        },
                                    },
                                }}

                            />
                            {
                                <Dropdown >
                                    <Dropdown.Button rounded className='self-center p-1 px-5 mt-5 text-2xl 2xl:px-10 2xl:mt-10 2xl:mb-7' color={errors.dependent ? "error" : "#242529"}
                                        css={{
                                            tt: " ",
                                            background: "#242529",
                                            color: "#EFF6BD",
                                            fontSize: "1.4rem",
                                            // borderRadius: "15px", 
                                            height: "3.8rem",
                                            width: "90%",
                                            "@mdMax": {
                                                fontSize: "1.2rem",
                                                width: "70%",
                                                height: "3.4rem",

                                            },
                                        }}>
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
                                    // {...register("dependent", tabView == 2 ? { disabled } : {
                                    //     required: "Please choose a dependent"
                                    // })}
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
                            }

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
                                // "@mdMax": {

                                // width: "70%",
                                // }

                            }}
                            className='rounded-full hover:bg-neutral bg-accent text-neutral hover:text-accent btn-outline-neutral btn btn-wide '
                        >
                            {submitting ? <Loading color="currentColor" size="sm" /> : " Submit"}

                        </button>
                    </form>
                    :
                    <Notification message={"Transfer"} submitStatus={submitStatus} setSubmitStatus={setSubmitStatus} ></Notification>
                )
            }
            {tabView == 2 &&
                (!submitStatus ?

                    <form className="flex flex-col self-center w-full max-w-md gap-7 xl:gap-10 p-2 mt-[1rem] 2xl:mt-[3rem] 4xl:mt-[6rem]" onSubmit={handleSubmit(onSubmit, onError)}>
                        <Input
                            underlined
                            placeholder="Username"
                            status={errors.username ? "error" : "default"}
                            id='username'
                            type="text"
                            size='medium'
                            color='$neutral'
                            {...register("username",
                                {
                                    required: "Please enter a username",
                                })
                            }
                            css={{
                                tt: " ",
                                fontSize: "1.4rem",
                                "::placeholder ": {
                                    "color": "#242529",
                                    "fontSize": "1.4rem",
                                    "@mdMax": {
                                        fontSize: "1.2rem",
                                    },
                                },

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
                            css={{
                                tt: " ",
                                fontSize: "1.4rem",
                                "::placeholder ": {
                                    "color": "#242529",
                                    "fontSize": "1.4rem",
                                    "@mdMax": {
                                        fontSize: "1.2rem",
                                    },
                                },

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
                            css={{
                                tt: " ",
                                fontSize: "1.4rem",
                                "::placeholder ": {
                                    "color": "#242529",
                                    "fontSize": "1.4rem",
                                    "@mdMax": {
                                        fontSize: "1.2rem",
                                    },
                                },
                            }}

                        />


                        <div className='flex items-center justify-between 2xl:gap-10 5xl:my-10 5xl:mb-15' >
                            <h3 className='font-semibold lg:text-lg 3xl:text-2xl text-neutral' >Save this beneficiary?</h3>
                            <div className="btn-group" id='save'>
                                <div
                                    type='button'

                                    onClick={() => setSaveBeneficiary("yes")}
                                    className={`${saveBeneficiary == "yes" ? "bg-neutral  hover:bg-neutral" : " text-neutral bg-accent hover:bg-accent "} border-neutral border-[3px] border-r-0 transition-all duration-200  ease-in-out p-2  px-4 rounded-xl rounded-r-none cursor-pointer `}
                                >
                                    <p className={`${saveBeneficiary == "yes" ? "text-secondary" : "text-neutral "} text-xl font-semibold`}>Yes</p>
                                </div>
                                <div
                                    type='button'
                                    onClick={() => setSaveBeneficiary("no")}
                                    className={`${saveBeneficiary == "no" ? "bg-neutral text-neutral hover:bg-neutral" : " text-neutral bg-accent hover:bg-accent"} border-neutral border-[3px]  transition-all duration-200 ease-in-out p-2 px-4 rounded-xl rounded-l-none cursor-pointer `}
                                >
                                    <p className={`${saveBeneficiary == "no" ? "text-secondary" : "text-neutral "} text-xl font-semibold`}>No</p>
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
                            className='rounded-full hover:bg-neutral bg-accent text-neutral hover:text-accent btn-outline-neutral btn 2xl:btn-wide'
                        >
                            {submitting ? <Loading color="currentColor" size="sm" /> : " Submit"}

                        </button>
                    </form>
                    :
                    <Notification message={"Transfer"} submitStatus={submitStatus} setSubmitStatus={setSubmitStatus} ></Notification>
                )
            }

        </div>
    )
}
