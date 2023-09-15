
import { WEB_URL } from "../../../util/keys";
import useSWR from 'swr'
import { useEffect, useRef, useState } from 'react';
import { IonApp, IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonModal, IonNavLink, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { caretBack, gift, warning } from "ionicons/icons";
import SetAllowance from "./SetAllowance";
import FamilyCarousel from "./FamilyCarousel";
import Loader from "../../Loader";
import AddFamily from "./AddFamily";
import EditUser from './EditUser';
import deleteUser from '../../../pipes/deleteUser';
import { Loading } from "@nextui-org/react";
import Modal from "../Modal";
import BirthdayGift from "./BirthdayGift";
import Scrollbars from "react-custom-scrollbars-2";
import NotificationSmall from "../NotificationSmall";
import DeleteUser from "./DeleteUser";

export default function Family({ session }) {
	const [selectedSubUser, setSelectedSubUser] = useState(null)
	const [user, setUser] = useState(null)
	const fetcher = (url) => fetch(url).then((res) => res.json());
	const { data, error, isLoading, mutate: familyMutate } = useSWR(`${WEB_URL}/api/planetscale/user/getFamily?id=${session.user.id}`, fetcher);
	const { data: data2, error: error2, isLoading: isLoading2, mutate: paidBirthdayMutate } = useSWR(`${WEB_URL}/api/planetscale/user/getPaidBirthdays?id=${session.user.id}`, fetcher);

	if (!data || isLoading || !data2 || isLoading2)
		return <Loader />

	let family = data.subUsers
	console.log("FAM B4", family)
	if (session.user.privilege == "MAIN2") {
        family = family.filter(i => ( i.privilege != "MAIN2"))
    }
	console.log("FAM AFT", family)
	const paidSubsIDs = data2.paidSubs.map(i => i.subId)

	let famSortedBDay = family?.sort((a, b) => {
		let aDate = new Date(a.dateOfBirth)
		let bDate = new Date(b.dateOfBirth)
		let today = new Date()
		let aDiff = aDate - today
		let bDiff = bDate - today
		return aDiff - bDiff

	}).filter((i) => {
		let birthDate = new Date(i.dateOfBirth);
		let today = new Date();
		let birthMonth = birthDate.getMonth();
		let birthDay = birthDate.getDate();
		let currentMonth = today.getMonth();
		let currentDay = today.getDate();

		if (birthMonth === currentMonth && birthDay >= currentDay) {
			return i;
		} else if (birthMonth > currentMonth) {
			return i;
		}
	});

	famSortedBDay = famSortedBDay.map((i) => {
		let birthDate = new Date(i.dateOfBirth)
		let today = new Date()

		let birthdateThisYear = new Date(
			today.getFullYear(),
			birthDate.getMonth(),
			birthDate.getDate()
		);

		let timeDiff = birthdateThisYear.getTime() - today.getTime()
		let daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))

		// console.log(birthdateThisYear)
		// console.log(today)
		// console.log(daysDiff)

		if (daysDiff <= 2 && daysDiff >= 0) {
			i.daysLeft = daysDiff
			return i
		}
		else {
			i.daysLeft = 420
			return i
		}
	})


	const birthDayId = "birthDayId";

	return (
		<IonApp>

			<IonHeader >
				<IonToolbar color="medium" className='border-none' style={{ border: "none !important" }}>
					<IonButtons slot="start" >
						<IonBackButton defaultHref='/' icon={caretBack} text={"Back"} className="custom-back-button"></IonBackButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>

			<div className='flex flex-col w-screen h-screen gap-5 px-5 py-5 bg-neutral'>
				<h1 className='self-start m-0 text-3xl font-bold text-primary'>Family Finance Hub</h1>
				<p className='max-w-xs font-semibold text-lg text-[#D7D7D7] -mt-4'>Effortlessly Manage Your Family's Banking Needs</p>
				<div className='flex flex-col items-center w-full h-full gap-5'>
					<IonNavLink routerDirection="forward" component={() => <SetAllowance session={session} family={family} ></SetAllowance>}>
						<button
							className='text-2xl font-bold rounded-lg h-14 text-neutral btn btn-accent btn-wide'
						>
							Set Allowance
						</button>
					</IonNavLink>
					{session.user.privilege == "MAIN" &&
						<IonNavLink routerDirection="forward" component={() => <AddFamily session={session} familyMutate={familyMutate}></AddFamily>}>
							<button
								className='text-2xl font-bold rounded-lg h-14 text-neutral btn btn-accent btn-wide'
							>
								Add Member
							</button>
						</IonNavLink>}

					<h1 className='self-start m-0 text-3xl font-bold text-primary'>Your Family</h1>
					<FamilyCarousel family={family} familyMutate={familyMutate} user={user} setUser={setUser}></FamilyCarousel>
					{user &&
						<div className="flex justify-center w-full">
							<IonNavLink
								className={`bg-neutral border-accent border-[3px] border-r-0 p-1 flex justify-center items-center  px-1 rounded-xl rounded-r-none cursor-pointer w-1/3 `}
								routerDirection="forward"
								component={() =>
									<EditUser user={user} familyMutate={familyMutate} mainId={session.user.id} ></EditUser>}>
								<p className={`active:text-secondary text-accent text-xl font-semibold text-center`}>Edit</p>
							</IonNavLink>
							<IonNavLink
								className={` bg-neutral border-accent border-[3px] p-1 px-1 rounded-xl rounded-l-none cursor-pointer w-1/3  `} routerDirection="forward"
								component={() =>
									<DeleteUser user={user} familyMutate={familyMutate} mainId={session.user.id} setUser={setUser} ></DeleteUser>}>
								<p className={`active:text-secondary text-accent text-xl font-semibold text-center`}>Delete</p>
							</IonNavLink>
						</div>
					}

					<h1 className='self-start m-0 text-3xl font-bold text-primary'>Upcoming Birthdays</h1>
					<div className='w-full h-full overflow-y-auto border-t '>
						<Scrollbars style={{ width: '100%', height: '100%' }} >
							{famSortedBDay?.length != 0 ?
								famSortedBDay?.map((member, index) => {
									const date = new Date(member.dateOfBirth);
									const month = date.toLocaleString('default', { month: 'short' });
									const day = date.getDate();
									return (
										<div key={index} className='flex items-center justify-start w-full gap-10 px-5 border-b '>
											<div className='flex flex-col font-serif  w-[150px]'>
												<h1 className='self-center p-0 m-0 text-4xl 2xl:text-5xl 4xl:text-6xl text-accent'>{day}</h1>
												<h3 className='self-center p-0 m-0 text-base 2xl:text-xl 4xl:text-2xl text-secondary'>{month}</h3>
											</div>
											<div className='flex items-center w-full'>
												<h1 className='self-center m-0 text-xl text-[#FFFBF9] 2xl:text-2xl'>{member.name}</h1>
											</div>

											{member.daysLeft <= 2 && !paidSubsIDs.includes(member.id) ?
												<IonNavLink
													routerDirection="forward"
													component={() => <BirthdayGift session={session} subUser={member} paidBirthdayMutate={paidBirthdayMutate}></BirthdayGift>}
													onClick={() => setSelectedSubUser(member)}
													className='flex justify-end w-full h-full m-0 cursor-pointer'>
													<IonIcon icon={gift} className='w-8 h-8 duration-1000 cursor-pointer text-primary'></IonIcon>
												</IonNavLink>
												:
												member.daysLeft <= 2 ?
													<label className="flex justify-end w-full m-0 font-medium cursor-pointer text-primary">
														Paid
													</label>
													:
													<label
														onClick={() => setSelectedSubUser(member)}
														htmlFor={birthDayId}
														className='flex justify-end invisible w-full h-full m-0 cursor-pointer '>
														<IonIcon icon={gift} className='w-8 h-8 duration-1000 cursor-pointer text-primary'></IonIcon>
													</label>
											}
										</div>
									)

								})
								:
								<div className='flex flex-col items-center justify-center mt-5'>
									<h1 className='text-2xl font-semibold text-base-100'>No upcoming birthdays...</h1>
								</div>

							}
							{/* </div> */}
						</Scrollbars>
					</div>
				</div>
			</div>
		</IonApp>
	)
}
