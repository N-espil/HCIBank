import { Capacitor } from '@capacitor/core';
import { useRouter } from 'next/router';
import { useSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { MdLockOutline } from "react-icons/md";
import { ImUser } from "react-icons/im";
import Link from "next/link";
import { IonNavLink } from '@ionic/react';
import { Loading } from '@nextui-org/react';
import Signup from "./signup"

export default function Signin() {
    const router = useRouter();
    const [failed, setFailed] = useState(false);
    const { data: session, status } = useSession();
    const [submitting, setSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({ defaultValues: {} });

    if (status == "authenticated") {
        router.push("/index2");
    }

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

    async function handleCreate({ username, pass }) {
        try {
            const res = await signIn("credentials", {
                redirect: false,
                username: username,
                password: pass,
            });

            if (res.status != 200) {
                setSubmitting(false);
                setFailed(true)
                return;
            }
        } catch (error) {
            setSubmitting(false);
            setFailed(true)
            return;
        }
        if (status) {
            // console.log("LOL");
            setSubmitting(false);
            router.push("/index2");
        }
    }

    function onSubmit(data, e) {
        // console.log("LOL", data)
        setFailed(false)
        setSubmitting(true);
        handleCreate(data);
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
                <h2 className="text-3xl font-bold text-primary">
                    Login to Account
                </h2>
                <div className="w-16 border-2 border-accent"></div>
            </div>
            <form autoComplete="off" className="flex flex-col items-center h-full gap-5 px-10 py-4 bg-neutral" onSubmit={handleSubmit(onSubmit, onError)}>

                <div className={`flex items-center w-full p-2 bg-primary rounded-2xl border-2 ${errors.username ? "border-error" : ""}`}>
                    <ImUser className="m-2 text-neutral" />
                    <input
                        placeholder={errors.username ? errors.username.message : "Username"}
                        id="username"
                        className={`flex w-full pl-3 text-sm bg-transparent outline-none text-neutral placeholder-base-100 ${errors.username ? "placeholder-error" : ""} `}
                        type="text"
                        {...register("username", {
                            required: "Please enter a username",
                        })}
                    />
                </div>

                <div className={`flex items-center w-full p-2 bg-primary rounded-2xl border-2 ${errors.pass ? "border-error" : ""}`}>
                    <MdLockOutline className="m-2 text-neutral" />

                    <input
                        placeholder={errors.pass ? errors.pass.message : "Password"}
                        id="pass"
                        className={`flex w-full pl-3 text-sm bg-transparent outline-none text-neutral placeholder-base-100 ${errors.pass ? "placeholder-error" : ""} `}
                        type="password"
                        {...register("pass", {
                            required: "Please enter your password",
                        })}
                    />
                </div>
                {failed ? (
                    <div className="flex flex-col items-center w-full -mb-3 text-sm text-error">
                        <p className="text-sm">Invalid username or password.</p>
                    </div>
                ) : null}
                <div className="flex flex-col">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="self-center inline-block w-full px-16 py-2 mt-6 mb-3 rounded-full group text-secondary ring-2 ring-secondary btn btn-active disabled:cursor-not-allowed disabled:disabled"
                    >
                        <p className="text-xl font-semibold text-secondary">
                            {submitting ? <Loading></Loading> : "Login"}
                        </p>
                    </button>
                </div>
                <h3 className="m-0 text-base text-primary"> Don't have an account?</h3>
                <IonNavLink routerDirection="forward" component={() => <Signup ></Signup>}
                    className="m-0 -mt-4 text-base underline text-accent"
                >Sign up</IonNavLink>
            </form>
        </div>
    )
}


