import { useForm } from "react-hook-form";
import { useEffect, useState, } from 'react'
import editUser from '../../../pipes/editUser';
import { Input, Loading } from '@nextui-org/react';
import { IonApp, IonBackButton, IonButtons, IonHeader, IonToolbar } from "@ionic/react";
import { caretBack } from "ionicons/icons";
import Notification from "../Notification";

export default function EditUser({ user, mainId, familyMutate }) {

	const [submitting, setSubmitting] = useState(false)
	const [submitStatus, setSubmitStatus] = useState("")
	const { register, handleSubmit, formState: { errors }, reset, setError, clearErrors } = useForm({ defaultValues: {} })


	useEffect(() => {
		if (user?.allowance) {
			reset({ fname: user?.name.split(" ")[0], lname: user?.name.split(" ")[1], allowance: user?.allowance })

		}
		else {
			reset({ fname: user?.name.split(" ")[0], lname: user?.name.split(" ")[1] })
		}
	}, [user])

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

	async function handleCreate({ fname, lname, allowance }) {
		let res = await editUser({ name: fname + ' ' + lname, allowance: allowance, subId: user.id, mainId: mainId })
		setSubmitting(false)
		if (res) {
			familyMutate()
			reset()
			setSubmitStatus("success")

		}
		else {
			setSubmitStatus("error")

		}
	}

	function onSubmit({ fname, lname, allowance }, e) {
		if (fname + ' ' + lname == user.name && allowance == user.allowance) {
			setError('fname', { message: "Change Something" })
			setError('lname', { message: "Change Something" })
			setError('allowance', { message: "Change Something" })
			return
		}


		setSubmitting(true)
		handleCreate({ fname, lname, allowance })
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
				<h1 className='self-start m-0 text-3xl font-bold text-primary'>Edit {user?.name.split(" ")[0]}</h1>
				{!submitStatus ?
					<form className="flex flex-col items-center justify-center w-full gap-10 p-2 bg-neutral" onSubmit={handleSubmit(onSubmit, onError)}>
						<Input
							width='100%'
							underlined
							label="First Name"
							placeholder="First Name"
							status={errors.fname ? "error" : "primary"}
							id='fname'
							type="text"
							{...register("fname", { required: "Please enter your first name", max: { value: 20, message: "Max name length is 30" } })}
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
							placeholder="Last Name"
							label="Last Name"
							status={errors.lname ? "error" : "primary"}
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

						{user?.allowance && <Input
							width='100%'
							underlined
							placeholder="Allowance"
							label="Allowance"
							status={errors.allowance ? "error" : "primary"}
							id='allowance'
							type="text"
							{...register("allowance", { required: "Please enter an allowance" })}
							style={{ color: "#FFFBF9" }}
							css={{
								tt: " ",
								fontSize: "1.4rem",
								"::placeholder ": { "color": "#D7D7D7" },
								"::after": { background: "#EFF6BD" },
								"::before": { background: "#9A82BF" },
							}}
						/>}



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
					<Notification message={"Edit user"} submitStatus={submitStatus} setSubmitStatus={setSubmitStatus} />
				}
			</div>
		</IonApp>
	)
}
