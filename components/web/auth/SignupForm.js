import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import addUser from "../../../pipes/authentication/addUser";
import sendOTP from "../../../pipes/SMS/sendOTP";
import verifyOTP from "../../../pipes/SMS/verifyOTP";
import "react-phone-number-input/style.css";
import Modal from "../Modal";
import { Input, Loading } from "@nextui-org/react";


export default function SignupForm({ toggleSignInUp }) {
	const [otp, setOTP] = useState("");
	const [verify, setVerify] = useState(false);
	const [failed, setFailed] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [verifiedStatus, setVerifiedStatus] = useState("");
	const [submitStatus, setSubmitStatus] = useState("");
	const {
		register,
		handleSubmit,
		setError,
		getValues,
		clearErrors,
		formState: { errors },
		reset,
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
		if  (failed)  {
			setError("username", { message: "Username already exists" });
			document.getElementById("username2").value = ""
		}
	}, [failed]);

	async function handleCreate(OTP = true) {

		const { fname, lname, username, dob, phonenumber } = getValues()

		// if (OTP == false){
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
				setSubmitStatus("success");
				toggleSignInUp()
				reset();
			}
			else {
				setFailed(true);
				setSubmitStatus("error");
			}
		// }
		// else{
		// 	setVerify(true)
	
		// 	let verifyRes = await verifyOTP({ phonenumber, OTP: otp })
		// 	setSubmitting(false);
	
		// 	if (verifyRes.success == true) {
		// 		setVerifiedStatus("success")
		// 		setTimeout(async () => {
		// 			let userRes = await addUser({
		// 				name: fname + " " + lname,
		// 				username: username,
		// 				phoneNumber: "+971" + phonenumber,
		// 				dob,
		// 				privilege: "Main",
		// 				OTP:OTP
		// 			});
		// 			// console.log(res)
		// 			if (userRes.success == true) {
		// 				setSubmitStatus("success");
		// 				toggleSignInUp()
		// 				document.getElementById("otp-modal").click();
		// 				reset();
		// 			}
		// 			else {
		// 				setFailed(true);
		// 				setSubmitStatus("error");
		// 			}
	
		// 			setVerify(false)
		// 		}, 10000)
		// 	}
		// 	else {
		// 		setVerifiedStatus("error")
		// 		setVerify(false)
		// 		setSubmitStatus("error");
		// 	}
		// }
	}
	// const OTP_ID = "otp-modal"
	async function onSubmit(data, e) {
		
		// setFormData(data)
		setSubmitting(true);
		//send user the OTP here if
		setFailed(false)
		// const res = await sendOTP({ phoneNumber: "+971" + data.phonenumber, })
		//console.log("SEND OTP RES", res.error)
		// if (res.success == true) {
			// document.getElementById("otp-modal").click();
		// } else if (res.success == false){
			let OTP = false
			handleCreate(OTP)
		// }
		// else {
		// 	setSubmitting(false);
		// 	//send user the OTP here if
		// 	setFailed(true)
		// }
	}

	function onError(errors, e) {
		console.log(errors, e);
	}

	return (
		<>
			{/* <Modal modalId={OTP_ID} title={"OTP"}>
				<div className='flex flex-col items-center justify-center gap-10'>
					<div className='flex flex-col items-center justify-center gap-4'>
						<div className='flex flex-col items-center justify-center gap-6'>
							<Input
								width='100%'
								underlined
								placeholder="Enter the OTP"
								type="text"
								style={{ color: "#EFF6BD" }}
								status={verifiedStatus == "error" ? "error" : "default"}
								value={otp}
								onChange={(e) => {
									setOTP(e.target.value)
									// handleCreate(data);

								}}
								css={{
									tt: " ",
									color: "#EFF6BD",
									fontSize: "1.4rem",
									"::placeholder ": { "color": `${verifiedStatus == "error" ? "#F44336" : "#EFF6BD"}` },
									"::after": { background: `${verifiedStatus == "error" ? "#F44336" : "#ADC172"}` },
									"::before": { background: "#EFF6BD" },
								}}
							/>

							<button
								onClick={() => otp && handleCreate()}
								type="button"
								className='px-8 text-xl rounded-full hover:bg-accent hover:text-neutral bg-secondary text-neutral btn-outline-neutral btn btn-wide '
							>
								{verify ? <Loading></Loading> : "Verify"}
							</button>
						</div>
					</div>
				</div>
			</Modal> */}
			<div className="flex justify-center flex-1 p-8 bg-neutral">
				<form className="flex flex-col w-full h-full gap-3 bg-neutral" onSubmit={handleSubmit(onSubmit, onError)} autoComplete="off">
					<div className="font-bold text-left text-accent">
						<span className="text-primary 4xl:text-3xl">HCI</span>
						<span className="text-accent 4xl:text-3xl">Bank</span>
					</div>
					<div className="pt-12">
						<h2 className="mb-2 text-3xl font-bold 4xl:text-4xl text-primary">
							Create an Account
						</h2>
						<div className="inline-block w-[80px] mb-2 border-2 border-primary"></div>
						<div className="flex justify-center my-2"></div>
					</div>
					<div className="flex flex-col gap-6">
						<div className="grid grid-cols-2 gap-4">
							<div className={`flex items-center h-[45px] border-2 shadow-2xl bg-primary rounded-2xl ${errors.fname ? "border-error" : ""}`}>
								<input
									id="fname"
									className={`flex w-full pl-3 text-sm bg-transparent outline-none text-neutral placeholder-base-100 ${errors.fname ? "placeholder-error" : ""} `}
									type="text"
									autoComplete="off"
									placeholder={errors.fname ? errors.fname.message : "First Name"}
									{...register("fname", {
										required: "Please enter your first name",
										max: { value: 30, message: "Max name length is 30" },
									})}
								></input>
							</div>

							<div className={`flex items-center h-[45px] border-2 shadow-2xl bg-primary rounded-2xl ${errors.lname ? "border-error" : ""}`}>
								<input
									id="lname"
									className={`flex w-full pl-3 text-sm bg-transparent outline-none text-neutral placeholder-base-100 ${errors.lname ? "placeholder-error" : ""} `}
									type="text"
									autoComplete="off"
									placeholder={errors.lname ? errors.lname.message : "Last Name"}
									{...register("lname", {
										required: "Please enter your last name",
										max: { value: 30, message: "Max name length is 30" },
									})}
								></input>
							</div>

						</div>

						<div className={`flex items-center h-[45px] border-2 shadow-2xl bg-primary rounded-2xl ${errors.phonenumber ? "border-error" : ""}`}>
							<label htmlFor="phoneNum" className={`flex items-center justify-center w-12 h-full text-sm ${errors.phone ? "text-error" : "text-neutral"}`}>
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


							<div className={`flex items-center h-[45px] border-2 shadow-2xl bg-primary rounded-2xl ${errors.username ? "border-error" : ""}`}>
								<input
									id="username2"
									className={`flex w-full pl-3 text-sm bg-transparent outline-none text-neutral placeholder-base-100 ${errors.username ? "placeholder-error" :  ""} `}
									type="text"
									autoComplete="off"
									placeholder={errors.username ? errors.username.message : "Username"}
									{...register("username", {
										required: "Please enter a username",
									})}
								></input>
							</div>

						<div className={`flex items-center h-[45px] border-2 shadow-2xl bg-primary rounded-2xl ${errors.dob ? "border-error" : ""}`}>
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

						<button
							type="submit"
							disabled={submitting}
							className="inline-block w-full px-12 py-2 mt-6 font-semibold rounded-full text-secondary ring-2 ring-secondary btn btn-active hover:bg-secondary hover:text-neutral"
						>
							Create
						</button>
					</div>
				</form>
			</div>
		</>
	);
}