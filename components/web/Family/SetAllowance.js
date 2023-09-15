import React, { use } from 'react'
import { useForm } from "react-hook-form";
import { useRouter } from 'next/router'
import { useEffect, useState, useMemo } from 'react'
import addAllowance from '../../../pipes/addAllowance'
import { Input, Button, Dropdown, Loading } from '@nextui-org/react';
import Notification from '../Notification';



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
    const [submitStatus, setSubmitStatus] = useState("")
    const [submitting, setSubmitting] = useState(false)
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
        if (selectedValue == "Choose a Dependent")
            setError("dependent", { message: "Please choose a dependent" })
        else {
            clearErrors("dependent")
        }
    }, [selectedValue])

    async function handleCreate({ subId, amount }) {
        let res = await addAllowance({ mainId: session.user.id, subId: subId, amount: amount })
        setSubmitting(false)
        if (res.success == true) {
            reset()
            setSubmitStatus("success")

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
        if (selectedValue == "Choose a Dependent")
            setError("dependent", { message: "Please choose a dependent" })
        else {
            clearErrors("dependent")
        }
        console.log(errors, e)
    }

    return (
        <div className='flex flex-col items-center justify-center h-full lg:w-[300px]  4xl:w-[408px] 2xl:w-[333px] p-5 px-10 4xl:px-12 rounded-xl bg-accent 5xl:w-auto'>
            <h1 className='text-2xl font-bold text-center 2xl:text-3xl 3xl:text-4xl'>Set an Allowance</h1>
            {!submitStatus ?
                <>
                    <form className="flex flex-col w-full max-w-md gap-10 p-2 my-auto" onSubmit={handleSubmit(onSubmit, onError)}>

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

                        <Dropdown >
                            <Dropdown.Button
                                rounded={true}
                                className='self-center p-1 px-10 mt-10 text-2xl'
                                color={errors.dependent ? "error" : "#242529"}
                                css={{ tt: " ", background: "#242529", color: "#EFF6BD", fontSize: "1.4rem", height: "3.3rem", width: "100%" }} >
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
                            className='rounded-full hover:bg-neutral bg-accent text-neutral hover:text-accent btn-outline-neutral btn 2xl:btn-wide'
                        >
                            {submitting ? <Loading color="currentColor" size="sm" /> : " Submit"}

                        </button>

                    </form>
                </>
                :
                <Notification message={"Set allowance"} submitStatus={submitStatus} setSubmitStatus={setSubmitStatus} />
            }
        </div>
    )
}
