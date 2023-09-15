import { useForm } from "react-hook-form";
import { useEffect, useRef, useState, } from 'react'
import { Input, Loading } from '@nextui-org/react';
import { IonApp, IonBackButton, IonButtons, IonHeader, IonToolbar, IonNavLink } from "@ionic/react";
import { caretBack } from "ionicons/icons";
import addUser from "../../pipes/authentication/addUser"
import verifyOTP from "../../pipes/SMS/verifyOTP";
import Signin from "../../pages/auth/native/signin"
export default function OTPVerify({ getValues }) {

	const signinRef = useRef(null)
	const [submitting, setSubmitting] = useState(false)
	const [successfulSubmit, setSuccessfulSubmit] = useState(false)
	const { register, handleSubmit, formState: { errors }, reset, setError, clearErrors } = useForm({ defaultValues: {} })
	const [verifiedStatus, setVerifiedStatus] = useState("");
	const [otp, setOTP] = useState("");
	const [verify, setVerify] = useState(false);
	const [submitStatus, setSubmitStatus] = useState("");




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
			if (successfulSubmit) {
				reset()
				setSubmitting(false)
			}
		}
	}, [successfulSubmit])

	async function handleCreate({ fname, lname, username, phonenumber, dob, OTP }) {
		setVerify(true)
		let verifyRes = await verifyOTP({ phonenumber, OTP })
		setSubmitting(false);
		if (verifyRes.success == true) {
			setVerifiedStatus("success")
			setTimeout(async () => {
				let userRes = await addUser({
					name: fname + " " + lname,
					username: username,
					phoneNumber: "+971" + phonenumber,
					dob,
					privilege: "Main",
					OTP: true
				});
				if (userRes.success == true) {
					setSubmitting(false);
					setSubmitStatus("success");
					reset();
					signinRef.current.click()
				}
				else {
					setFailed(true);
					setSubmitStatus("error");
				}

				setVerify(false)
			}, 10000)
		}
		else {
			setVerifiedStatus("error")
			setVerify(false)
			setSubmitStatus("error");
		}
	}

	function onSubmit({ otp }, e) {
		let values = getValues()
		values = { ...values, OTP: otp }
		handleCreate(values)
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
				<h1 className='self-start m-0 text-3xl font-bold text-primary'>Verify with OTP</h1>
				<form className="flex flex-col items-center justify-center w-full gap-10 p-2 bg-neutral" onSubmit={handleSubmit(onSubmit, onError)}>
					<Input
						width='100%'
						underlined
						placeholder="OTP"
						status={errors.otp ? "error" : "primary"}
						id='otp'
						type="text"
						{...register("otp", { required: "Please the OTP" })}
						style={{ color: "#FFFBF9" }}
						css={{
							tt: " ",
							fontSize: "1.4rem",
							"::placeholder ": { "color": "#D7D7D7" },
							"::after": { background: "#EFF6BD" },
							"::before": { background: "#9A82BF" },
						}}
					/>

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
						{verify ? <Loading color="currentColor" size="sm" /> : " Verify"}

					</button>

				</form>
			</div>
			<IonNavLink routerDirection="forward" component={() => <Signin ></Signin>}
				ref={signinRef}
				className=""
			></IonNavLink>
		</IonApp>
	)
}
