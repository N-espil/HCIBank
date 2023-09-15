import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { IonNav, IonNavLink } from "@ionic/react";
import { Loading } from "@nextui-org/react";
import addUser from "../../../pipes/authentication/addUser";
import sendOTP from "../../../pipes/SMS/sendOTP";
import OTPVerify from "../../../components/native/OTPVerify";
import Signin from "./signin";

export default function Signup() {
    const otpRef = useRef(null)
    let router = useRouter();
    const [failed, setFailed] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState("");
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setError,
        getValues
    } = useForm({ defaultValues: {} });

    useEffect(() => {
        if (submitting) {
            if (typeof window !== "undefined") {
                document.body.style.cursor = "progress";
            }
        } else {
            if (typeof window !== "undefined") {
                document.body.style.cursor = "auto";
            }
        }
    }, [submitting]);


    useEffect(() => {
        if (failed) {
            setError("username", { message: "Username already exists" });
            document.getElementById("username2").value = ""
        }
    }, [failed]);

    async function handleCreate() {
        const { fname, lname, username, dob, phonenumber } = getValues()
        let userRes = await addUser({
            name: fname + " " + lname,
            username: username,
            phoneNumber: "+971" + phonenumber,
            dob,
            privilege: "Main",
            OTP: false
        });
        setSubmitting(false);
        if (userRes.success == true) {
            router.push("/auth/native/signin");
            reset();
            setSubmitting(false);
            setSubmitStatus("success");
        }
        else {
            setFailed(true);
            setSubmitStatus("error");
        }
    }

    async function onSubmit(data, e) {
        setSubmitting(true);

        setFailed(false)

        // const res = await sendOTP({ phoneNumber: "+971" + data.phonenumber, })

        // if (res.success == true) {
            // otpRef.current.click()
        // } else if (res.success == false) {
        handleCreate()
        // }
        // else {
            // setSubmitting(false);
            //send user the OTP here if
            setFailed(true)
        // }
    }

    function onError(errors, e) {
        console.log(errors, e);
    }

    return (
        <div className='w-screen h-screen bg-neutral' >
            <div class="ion-text-center py-16">
                <span className='text-6xl font-medium text-primary'>HCI</span>
                <span className='text-6xl font-medium text-accent'>Bank</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-5 p-5">
                <h2 className="m-0 text-3xl font-bold text-primary">
                    Create an Account
                </h2>
                <div className="w-16 border-2 border-accent"></div>
            </div>
            <form className="flex flex-col items-center h-full gap-5 px-4 py-4 bg-neutral" onSubmit={handleSubmit(onSubmit, onError)} autoComplete="off">
                <div className="flex flex-col w-full h-full gap-6">
                    <div className="grid grid-cols-2 gap-4">

                        <div className="flex items-center h-[45px] border-2 shadow-2xl bg-primary rounded-2xl">
                            <input
                                id="fname"
                                className={`flex w-full pl-3 text-sm bg-transparent outline-none text-neutral placeholder-base-100 ${errors.fname ? "placeholder-error" : ""} `}
                                type="text"
                                autoComplete="off"
                                placeholder={errors.fname ? errors.fname.message : "First Name"}
                                {...register("fname", {
                                    required: "Please enter first name",
                                    max: { value: 30, message: "Max name length is 30" },
                                })}
                            ></input>
                        </div>

                        <div className={`flex items-center  p-1 py-2 bg-primary rounded-2xl border-2 h-[45px] ${errors.lname ? "border-error" : ""}`}>
                            <input
                                id="lname"
                                className={`flex w-full pl-3 text-sm bg-transparent outline-none text-neutral placeholder-base-100 ${errors.lname ? "placeholder-error" : ""} `}
                                type="text"
                                autoComplete="off"
                                placeholder={errors.lname ? errors.lname.message : "Last Name"}
                                {...register("lname", {
                                    required: "Please enter last name",
                                    max: { value: 30, message: "Max name length is 30" },
                                })}
                            ></input>
                        </div>

                    </div>

                    <div className={`flex items-center  p-1 py-2 bg-primary rounded-2xl border-2 h-[45px] ${errors.phonenumber ? "border-error" : ""}`}>
                        <label htmlFor="phoneNum" className={`flex items-center justify-center w-12 h-full text-sm ${errors.phonenumber ? "text-error" : "text-neutral"}`}>
                            +971
                        </label>
                        <input
                            className={`flex w-full pl-3 text-sm bg-transparent outline-none text-neutral placeholder-base-100 ${errors.phonenumber ? "placeholder-error" : ""} `}
                            {...register("phonenumber",
                                {
                                    required: "Please enter a phone number",
                                    pattern: {
                                        value: /^5[0-9]{8}$/,
                                        message: "Please enter a valid phone number"
                                    }
                                })}
                            id="phoneNum"
                            placeholder={errors.phonenumber ? errors.phonenumber.message : "Phone Number"}
                            autoComplete="off"
                        />
                    </div>


                    <div className={`flex items-center w-full p-1 py-2 bg-primary rounded-2xl border-2 h-[45px] ${errors.username ? "border-error" : ""}`}>
                        <input
                            id="username"
                            className={`flex w-full pl-3 text-sm bg-transparent outline-none text-neutral placeholder-base-100 ${errors.username ? "placeholder-error" : ""} `}
                            type="text"
                            autoComplete="off"
                            placeholder={errors.username ? errors.username.message : "Username"}
                            {...register("username", {
                                required: "Please enter a username",
                            })}
                        ></input>
                    </div>

                    <div className={`flex items-center p-1 h-[45px] border-2 shadow-2xl bg-primary rounded-2xl ${errors.dob ? "border-error" : ""}`}>
                        <label htmlFor="phoneNum" className={`flex items-center justify-center w-24 h-full text-sm ${errors.dob ? "text-error" : "text-neutral"}`}>
                            Date Of Birth
                        </label>
                        <input
                            id="dob"
                            className={`flex w-full pl-3 text-sm bg-transparent outline-none text-neutral placeholder-base-100 ${errors.dob ? "text-red-500" : ""} `}
                            type="date"
                            placeholder="Date of Birth"
                            {...register("dob", {
                                required: "Please enter a date of birth",
                            })}
                        ></input>
                    </div>

                    <div className="flex flex-col items-center justify-center w-full">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="self-center inline-block px-20 py-2 mt-6 mb-5 rounded-full text-secondary ring-2 ring-secondary btn btn-active disabled:cursor-not-allowed disabled:disabled"
                        >
                            <p className="text-xl font-semibold text-secondary ">
                                {submitting ? <Loading></Loading> : "Create"}
                            </p>
                        </button>
                        <h3 className="m-0 text-base text-primary">Already have an account?</h3>
                        <IonNavLink routerDirection="forward" component={() => <Signin ></Signin>}
                            className="m-0 text-base underline text-accent"
                        >Sign in</IonNavLink>
                    </div>

                    {/* <IonNavLink routerDirection="forward" component={() => <OTPVerify getValues={getValues}></OTPVerify>}
                        ref={otpRef}
                        className=""
                    ></IonNavLink> */}
                </div>
            </form>
        </div>
    );
}