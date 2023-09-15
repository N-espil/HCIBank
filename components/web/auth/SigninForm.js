import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { MdLockOutline } from "react-icons/md";
import { ImUser } from "react-icons/im";
import { Loading } from "@nextui-org/react";

export default function SigninForm() {
	const router = useRouter();
	const { data: session, status } = useSession();
	const [failed, setFailed] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm({ defaultValues: {} });

	if (status == "authenticated") {
		router.push("/");
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
			setFailed(true)
			setSubmitting(false);
			return;
		}
		if (status) {
			// console.log("LOL");
			setSubmitting(false);
			router.push("/");
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
		<div className="flex flex-col flex-1 p-8 bg-neutral">

			<div className="font-bold text-left text-accent">
				<span className="text-primary 4xl:text-3xl">HCI</span>
				<span className="text-accent 4xl:text-3xl">Bank</span>
			</div>
			<form autoComplete="off" className="flex flex-col w-full h-full gap-5 py-12 bg-neutral" onSubmit={handleSubmit(onSubmit, onError)}>
				<h2 className="my-4 mb-2 text-3xl font-bold text-primary">
					Login to Account
				</h2>
				<div className="inline-block w-[80px] mx-auto mb-4 border-2 border-accent"></div>
				{/* <div className="flex justify-center my-2"></div> */}

				<div className={`flex items-center w-full p-2 bg-primary rounded-2xl border-2 ${errors.username ? "border-error": ""}`}>
					<ImUser className="m-2 text-neutral" />
					<input
						placeholder={errors.username ? errors.username.message : "Username"}
						id="username"
						className={`flex w-full pl-3 text-sm bg-transparent outline-none text-neutral placeholder-base-100 ${errors.username ? "placeholder-error": ""}`}
						color={errors.username && "error"}
						status={errors.username ? "error" : "default"}
						type="text"
						{...register("username", {
							required: "Please enter a username",
						})}
					/>
				</div>

				<div className={`flex items-center w-full p-2 bg-primary rounded-2xl border-2 ${errors.pass ? "border-error": ""}`}>
					<MdLockOutline className="m-2 text-neutral" />
					<input
						placeholder={errors.pass ? errors.pass.message : "Password"}
						id="pass"
						className={`flex w-full pl-3 text-sm bg-transparent outline-none text-neutral placeholder-base-100 ${errors.pass ? "placeholder-error": ""}`}
						type="password"
						{...register("pass", {
							required: "Please enter your password",
						})}
					/>
				</div>
				{/* Error message */}
				{failed ? (
					<div className="flex flex-col w-full -mb-3 text-sm text-error">
						<p className="text-sm">Invalid username or password.</p>
					</div>
				) : null}
				<button
					type="submit"
					disabled={submitting}
					className="self-center inline-block w-full px-12 py-2 mt-6 rounded-full group text-secondary ring-2 ring-secondary hover:bg-secondary btn btn-active disabled:cursor-not-allowed"
				>
					<p className="font-semibold text-secondary group-hover:text-neutral">
						{submitting ? <Loading/> : "Login"}
					</p>
				</button>
			</form>
		</div>
	);
}