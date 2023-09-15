import React, { useMemo } from 'react'
import { useForm } from "react-hook-form";
import { useEffect, useState, } from 'react'
import addSubUser from '../../../pipes/authentication/addUser'
import { Input, Dropdown, Loading } from '@nextui-org/react';
import Notification from '../Notification';

export default function AddFamily({ session, familyMutate }) {

    const [submitting, setSubmitting] = useState(false)
    const [submitStatus, setSubmitStatus] = useState("")
    const { register, handleSubmit, formState: { errors }, reset, setError, clearErrors } = useForm({ defaultValues: {} })
    const [selected, setSelected] = useState(["Set Privilege"]);

    const selectedValue = useMemo(() => Array.from(selected).join(", ").replaceAll("_", " ")
    ,[selected]);

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
        if (typeof window !== "undefined") {
            if (submitStatus) {

            }
        }
    }, [submitStatus])

    // useEffect(() => {
    //     clearErrors(["privilege"])

    // }, [selected])

    async function handleCreate({ fname, lname, username, dob, privilege, phonenumber }) {
        privilege = privilege == "Sub User" ? "Sub" : "Main2"
        let res = await addSubUser({ name: fname + ' ' + lname, username: username, phoneNumber: phonenumber, dob, privilege, mainID: session.user.id })
        setSubmitting(false)
        if (res.success == true) {
            familyMutate()
            setSubmitStatus("success")
            reset()
            setSelected(["Set Privilege"])
        }
        else {
            setSubmitStatus("error")
        }
    }

    function onSubmit(data, e) {
        data.privilege = selectedValue

        setSubmitting(true)
        handleCreate(data)
    }
    function onError(errors, e) {
        console.log(errors, e)

    }

    return (
        <div className='flex flex-col items-center justify-center h-full lg:w-[300px] 4xl:w-[408px] 2xl:w-[333px] p-5 px-10 4xl:px-12 rounded-xl bg-accent 5xl:w-auto'>
            <h1 className='text-xl font-bold text-center 2xl:text-3xl 4xl:text-4xl'>Add Family Member</h1>
            {!submitStatus ?
                <form className="flex flex-col w-full p-2 my-auto lg:gap-6 2xl:gap-10" onSubmit={handleSubmit(onSubmit, onError)}>
                    <Input
                        width='100%'
                        underlined
                        placeHolder="First Name"
                        status={errors.fname ? "error" : "default"}
                        id='fname'
                        type="text"
                        {...register("fname", { required: "Please enter your first name", max: { value: 30, message: "Max name length is 30" } })}
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
                        width='100%'
                        underlined
                        placeHolder="Last Name"
                        status={errors.lname ? "error" : "default"}
                        id='lname'
                        type="text"
                        {...register("lname", { required: "Please enter your last name", max: { value: 30, message: "Max name length is 30" } })}
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
                        width='100%'
                        id='phone'
                        underlined
                        placeHolder="Phone Number"
                        type="text"
                        labelLeft="+971"
                        // status={errors.phonenumber ? "error" : "neutral"}
                        {...register("phonenumber",
                            {
                                required: "Please enter a phone number",
                                pattern: {
                                    value: /^5[0-9]{8}$/,
                                    message: "Please enter a valid phone number"
                                }
                            })}
                        css={{
                            ".nextui-input-label--left": {
                                color: "#242529", 
                                fontWeight: "400",
                                
                            },
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
                        width='100%'
                        id='username'
                        underlined
                        placeHolder="Username"
                        type="text"
                        status={errors.username ? "error" : "default"}
                        {...register("username",
                            {
                                required: "Please enter an username",
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
                    <div className='flex w-full gap-3 lg:mb-2 2xl:mb-10'>
                        <Input
                            width='100%'
                            underlined
                            placeholder='MM/DD/YYYY'
                            status={errors.dob ? "error" : "default"}
                            type="date"
                            id='dob'
                            {...register("dob",
                                {
                                    required: "Please enter a date of birth",
                                })}
                            style={{ color: "#242529" }}
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
                                "@mdMax": {
                                    fontSize: "1.2rem",
                                },

                            }}

                        />
                        <Dropdown>
                            <Dropdown.Button light 
                            // color={errors.privilege ? "error" : ""}
                                css={{
                                    tt: " ",
                                    "color": "#242529 !important",
                                    border: "none !important",
                                    minWidth: "100px !important"
                                }}>
                                {selectedValue}
                            </Dropdown.Button>
                            <Dropdown.Menu
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
                                // {...register("privilege",
                                //     {
                                //         required: "Please enter a privilege",
                                //     })
                                // }
                            >
                                <Dropdown.Item
                                    css={{
                                        tt: " ",
                                        color: "#EFF6BD",
                                        background: '#242529',
                                        '&:hover': {
                                            background: '#000000',
                                        },
                                    }}
                                    key="Main User"
                                >Main User</Dropdown.Item>
                                <Dropdown.Item
                                    css={{
                                        tt: " ",
                                        color: "#EFF6BD",
                                        background: '#242529',
                                        '&:hover': {
                                            background: '#000000',
                                        },
                                    }}
                                    key="Sub User"
                                >Sub User</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
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
                <Notification message={"Adding family member"} submitStatus={submitStatus} setSubmitStatus={setSubmitStatus} ></Notification>
            }
        </div>
    )
}