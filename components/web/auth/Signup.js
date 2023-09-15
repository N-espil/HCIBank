import "react-phone-number-input/style.css";
import SignupForm from "./SignupForm";
import Left from "./LeftSection";

export default function Signup({ toggleSignInUp }) {


	return (
		<div className="flex items-center justify-center w-full h-full bg-neutral">
			<main className="flex flex-col items-center justify-center w-full text-center xl:m-12 xl:px-20">
				<div className="flex w-2/3 max-w-4xl overflow-hidden shadow-2xl rounded-2xl shadow-black bg-neutral">
					<div className="w-2/5 px-12 bg-accent py-36">
						<Left toggleSignInUp={toggleSignInUp} />
					</div>
					<SignupForm toggleSignInUp={toggleSignInUp} />
				</div>
			</main>
		</div>
	);
}