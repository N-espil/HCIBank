import SignInForm from "./SigninForm";
import Right from "./RightSection";

export default function Signin({ toggleSignInUp }) {

	return (
		<div className="flex items-center justify-center w-full h-full bg-neutral">
			<main className="flex flex-col items-center justify-center w-full m-12 text-center xl:px-20">
				<div className="flex w-2/3 max-w-4xl overflow-hidden shadow-2xl rounded-2xl shadow-black bg-neutral">
					<SignInForm />
					<div className="w-2/5 px-12 bg-accent py-36">
						<Right toggleSignInUp={toggleSignInUp} />
					</div>
				</div>
			</main>
		</div>
	);
}