import React, { useMemo } from 'react'
import { useForm } from "react-hook-form";
import { useEffect, useState, } from 'react'
import addSubUser from '../../../pipes/authentication/addUser'
import { Input, Button, Dropdown, Loading } from '@nextui-org/react';
import { IonApp, IonBackButton, IonButtons, IonDatetime, IonHeader, IonItem, IonLabel, IonToolbar } from '@ionic/react';
import { caretBack } from 'ionicons/icons';
import Notification from '../Notification';

export default function AddFamily({ session, familyMutate }) {

    const [submitting, setSubmitting] = useState(false)
    const [submitStatus, setSubmitStatus] = useState("")
    const [birthdate, setBirthdate] = useState("")

    const { register, handleSubmit, formState: { errors }, reset, setError, clearErrors } = useForm({ defaultValues: {} })
    const [selected, setSelected] = useState(["Set Privilege"]);

    const selectedValue = useMemo(
        () => Array.from(selected).join(", ").replaceAll("_", " "),
        [selected]
    );

    // useEffect(()=>{
    //     if (typeof window !== "undefined") {
    //         document.getElementById("dob").value = "01/01/1990"
    //     }
    // },[])

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

    // useEffect(() => {
    //     clearErrors(["privilege"])

    // }, [selected])

    useEffect(() => {
        if (submitStatus == "done") {
            document.getElementById("back").click()
        }
    }, [submitStatus])

    async function handleCreate({ fname, lname, username, dob, privilege, phonenumber }) {
        privilege = privilege == "Sub User" ? "Sub" : "Main2"
        let res = await addSubUser({ name: fname + ' ' + lname, username: username, phoneNumber: phonenumber, dob, privilege, mainID: session.user.id })
        setSubmitting(false)
        if (res.success == true) {
            familyMutate()
            setSubmitStatus("success")
            setSelected(["Set Privilege"])
            reset()
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
        <IonApp>
            <IonHeader >
                <IonToolbar color="medium" className='border-none' style={{ border: "none !important" }}>
                    <IonButtons slot="start" >
                        <IonBackButton id="back" defaultHref='/' icon={caretBack} text={"Back"} className="custom-back-button"></IonBackButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <div className='flex flex-col w-full h-screen gap-5 px-5 pt-5 bg-neutral'>
                <h1 className='self-start m-0 text-3xl font-bold text-primary'>Add Family Member</h1>
                {!submitStatus ?
                    <form autoComplete='off' className="flex flex-col w-full max-w-md gap-10 p-2 " onSubmit={handleSubmit(onSubmit, onError)}>

                        <Input
                            width='100%'
                            underlined
                            autoComplete='off'
                            placeHolder="First Name"
                            status={errors.fname ? "error" : "default"}
                            id='fname'
                            type="text"
                            {...register("fname", { required: "Please enter your first name", max: { value: 30, message: "Max name length is 30" } })}
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
                            width='100%'
                            underlined
                            autoComplete='off'
                            placeHolder="Last Name"
                            status={errors.lname ? "error" : "default"}
                            id='lname'
                            type="text"
                            {...register("lname", { required: "Please enter your last name", max: { value: 30, message: "Max name length is 30" } })}
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
                            width='100%'
                            id='phone'
                            underlined
                            autoComplete='off'
                            placeHolder="Phone Number"
                            labelLeft="+971"
                            type="text"
                            status={errors.phonenumber ? "error" : "#D7D7D7"}
                            {...register("phonenumber",
                                {
                                    required: "Please enter a phone number",
                                    pattern: {
                                        value: /^5[0-9]{8}$/,
                                        message: "Please enter a valid phone number"
                                    }
                                })}
                            style={{ color: "#FFFBF9" }}
                            css={{
                                ".nextui-input-label--left": {
                                    color: "#D7D7D7",
                                },
                                tt: " ",
                                fontSize: "1.4rem",
                                "::placeholder ": { "color": "#D7D7D7" },
                                "::after": { background: "#EFF6BD" },
                                "::before": { background: "#9A82BF" },
                            }}
                        />

                        <Input
                            width='100%'
                            autoComplete='off'
                            id='username'
                            underlined
                            placeHolder="Username"
                            type="text"
                            status={errors.username ? "error" : "default"}
                            {...register("username",
                                {
                                    required: "Please enter an username",
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
                     
                        <div className='flex w-full gap-3 mb-10 items-center'>
                            <Input
                                autoComplete='off'
                                width='100%'
                                underlined
                                status={errors.dob ? "error" : "default"}
                                type="date"
                                id='dob'
                                labelLeft = "Date of Birth"
                                initialValue = {new Date().toLocaleDateString()}
                                {...register("dob",
                                    {
                                        required: "Please enter a date of birth",
                                    })}
                                style={{ color: "#FFFBF9" }}
                                css={{
                                    tt: " ",
                                    ".nextui-input-label--left": {
                                        color: "#D7D7D7",
                                    },
                                    fontSize: "1.4rem",
                                    "::placeholder ": { "color": "#D7D7D7" },
                                    "::after": { background: "#EFF6BD" },
                                    "::before": { background: "#9A82BF" },
                                }}

                            />

                            <Dropdown>
                                <Dropdown.Button light color={errors.privilege ? "error" : ""} css={{ tt: " ", border: "none !important", minWidth: "100px !important", width: "100px", color: "#D7D7D7" }}>
                                    {selectedValue}
                                </Dropdown.Button>
                                <Dropdown.Menu
                                    css={{
                                        tt: " ",
                                        background: "#242529",
                                        color: "#EFF6BD",
                                        minWidth: "120px !important",

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
                            className='mx-4 bg-transparent rounded-full btn-wide hover:bg-accent text-accent hover:text-neutral btn-outline-neutral btn'
                        >
                            {submitting ? <Loading color="currentColor" size="sm" /> : " Submit"}

                        </button>

                    </form>
                    :
                    <Notification message={"Adding family member"} submitStatus={submitStatus} setSubmitStatus={setSubmitStatus} />
                }
            </div>
        </IonApp>
    )
}