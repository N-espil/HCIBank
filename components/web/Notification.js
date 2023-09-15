import { checkmark, close } from 'ionicons/icons'
import { IonIcon } from '@ionic/react'
export default function Notification({ message, submitStatus, setSubmitStatus }) {
	return (
		<div className='flex flex-col items-center w-full p-2 my-auto lg:gap-6 2xl:gap-10'>
			{submitStatus == 'success' ?
				<IonIcon icon={checkmark} className='p-1 rounded-full text-8xl text-accent bg-neutral' />
				:
				<IonIcon icon={close} className='p-1 rounded-full text-7xl text-accent bg-neutral' />
			}
			{submitStatus == 'success' ?
				<span className='text-2xl text-center text-neutral'>{message} Successful!</span>
				:
				<span className='text-2xl text-center text-neutral'>{message} Failed!</span>
			}
			<button
				onClick={() => setSubmitStatus(null)}
				//   type="submit"
				style={{
					borderColor: "#242529",
					fontSize: "1.4rem",
					height: "3.8rem",
					margin: "auto",
					border: "3px solid",
				}}
				className='rounded-full hover:bg-neutral bg-accent text-neutral hover:text-accent btn-outline-neutral btn 2xl:btn-wide'
			>
				Done
			</button>

		</div>
	)
}
