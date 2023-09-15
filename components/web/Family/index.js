import AddFamily from './AddFamily';
import SetAllowance from './SetAllowance';
import { WEB_URL } from "../../../util/keys";
import useSWR from 'swr'
import { Scrollbars } from 'react-custom-scrollbars-2';
import { useState, useEffect } from 'react';
import FamilyCarousel from './FamilyCarousel';
import { gift } from 'ionicons/icons';
import Modal from '../Modal';
import BirthdayGift from './BirthdayGift';
import Loader from '../../Loader';
import { IonIcon } from '@ionic/react';
import { useRouter } from 'next/router';

export default function Family({ session }) {
    const router = new useRouter()
    if (session?.user.privilege == "SUB") {
        router.push('/dashboard?tab=home')
    }

    const fetcher = (url) => fetch(url).then((res) => res.json());
    const { data, error, isLoading, mutate: familyMutate } = useSWR(`${WEB_URL}/api/planetscale/user/getFamily?id=${session?.user.id}`, fetcher);
    const { data: data2, error: error2, isLoading: isLoading2, mutate: paidBirthdayMutate } = useSWR(`${WEB_URL}/api/planetscale/user/getPaidBirthdays?id=${session?.user.id}`, fetcher);
    const [selectedSubUser, setSelectedSubUser] = useState(null)
    const [showAddFamily, setShowAddFamily] = useState(true)

    if (!data || isLoading || !data2 || isLoading2)
        return <Loader />


   // console.log("data", data)
    
    let family = data.subUsers
    if (session.user.privilege == "MAIN2") {

        family = family.filter(i => ( i.privilege != "MAIN2"))
    }



    const paidSubsIDs = data2.paidSubs.map(i => i.subId)
    let famSortedBDay = family?.sort((a, b) => {
        let aDate = new Date(a.dateOfBirth)
        let bDate = new Date(b.dateOfBirth)
        let aMonth = aDate.getMonth();
        let aDay = aDate.getDate();
        let bMonth = bDate.getMonth();
        let bDay = bDate.getDate();
        if (aMonth === bMonth && aDay === bDay) {
            return 0;
        }
        if (aMonth === bMonth) {
            return (aDay < bDay) ? -1 : 1;
        }
        if (aMonth < bMonth) {
            return -1;
        }
        if (aMonth > bMonth) {
            return 1;
        }

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

        if ( daysDiff <= 2 && daysDiff >= 0) {
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
        <div className='flex h-screen gap-4 p-5 xl:gap-10 xl:p-10 5xl:p-24 bg-neutral'>
            <Modal modalId={birthDayId} title={"Birthday!"} icon={gift}>
                <div className='flex flex-col items-center justify-center gap-10 '>
                    <BirthdayGift modalId={birthDayId} session={session} subUser={selectedSubUser} paidBirthdayMutate={paidBirthdayMutate} ></BirthdayGift>
                </div>
            </Modal>
            <div className='flex-1 h-full m-0' >
                {showAddFamily && session.user.privilege == "MAIN" ?
                    <AddFamily session={session} familyMutate={familyMutate}></AddFamily>
                    :
                    <SetAllowance session={session} family={family}></SetAllowance>
                }
            </div>
            <div className='flex flex-col flex-[2] gap-4 2xl:gap-10 h-full' >
                <div className='flex gap-4 2xl:gap-10 justify-evenly h-[45%]'>
                    <div className=' bg-primary w-[50%] rounded-xl'>
                        <div className='flex flex-col w-full p-5 m-0 text-3xl font-bold text-neutral'>
                            <h1 className='m-0 text-lg font-bold xl:text-2xl 2xl:text-3xl text-neutral'>Family Finance Hub</h1>
                            <p className='text-sm font-semibold 2xl:text-base'>Effortlessly Manage Your Family's Banking Needs</p>
                            <div className='flex flex-col gap-5 p-5 5xl:gap-10 5xl:p-10'>
                                <button
                                    disabled={family.length == 0 || showAddFamily == false}
                                    onClick={() => setShowAddFamily(false)}
                                    className={`disabled:opacity-50 disabled:pointer-events-none p-3 text-xs align-middle xl:text-base 2xl:text-xl 4xl:p-5 bg-neutral text-primary hover:bg-opacity-70 rounded-2xl`}
                                >Allowance</button>
                                <button
                                    disabled={session.user.privilege != "MAIN" || showAddFamily == true}
                                    onClick={() => setShowAddFamily(true)}
                                    className='p-3 text-xs align-middle xl:text-base 2xl:text-xl 4xl:p-5 bg-neutral text-primary hover:bg-opacity-70 rounded-2xl disabled:bg-opacity-50 disabled:pointer-events-none'
                                >Add New Member</button>
                            </div>
                        </div>
                    </div>
                    <div className='bg-primary w-[50%] h-full rounded-xl overflow-auto '>
                        {/* renderThumbVertical={renderThumbVertical} */}
                        <Scrollbars style={{ width: '100%', height: '100%' }} >
                            <h1 className='sticky top-0 z-40 w-full p-5 m-0 text-lg font-bold border-b xl:text-2xl 2xl:text-3xl text-neutral border-neutral bg-primary'>Upcoming Birthdays</h1>
                            <div className="flex flex-col w-full h-auto gap-1 ">
                                {famSortedBDay?.length != 0 ?
                                    famSortedBDay?.map((member, index) => {
                                        const date = new Date(member.dateOfBirth);
                                        const month = date.toLocaleString('default', { month: 'short' });
                                        const day = date.getDate();
                                        
                                        return (
                                            <div key={index} className='flex items-center justify-between w-full gap-10 px-5 border-b border-neutral'>
                                                <div className='flex flex-col font-serif w-[150px] 2xl:w-[220px]'>
                                                    <h1 className='self-center p-0 m-0 text-4xl 2xl:text-5xl 4xl:text-6xl '>{day}</h1>
                                                    <h3 className='self-center p-0 m-0 text-base 2xl:text-xl 4xl:text-2xl text-base-100'>{month}</h3>
                                                </div>
                                                <div className='flex items-center w-full'>
                                                    <h1 className='self-center m-0 text-xl 2xl:text-2xl'>{member.name}</h1>
                                                </div>

                                                {member.daysLeft <= 2 && !paidSubsIDs.includes(member.id) ?
                                                    <label
                                                        onClick={() => setSelectedSubUser(member)}
                                                        htmlFor={birthDayId}
                                                        className='flex justify-end w-full h-full m-0 cursor-pointer'>
                                                        <IonIcon icon={gift} className='w-8 h-8 duration-1000 cursor-pointer text-neutral' ></IonIcon>
                                                    </label>
                                                    :
                                                    member.daysLeft <= 2 ?
                                                        <label className='ml-20 font-medium text-neutral'>
                                                            Paid
                                                        </label>
                                                        :
                                                        <label
                                                            onClick={() => setSelectedSubUser(member)}
                                                            htmlFor={birthDayId}
                                                            className='flex justify-end invisible w-full h-full m-0 cursor-pointer'>
                                                            <IonIcon icon={gift} className='w-8 h-8 duration-1000 cursor-pointer text-neutral' ></IonIcon>
                                                        </label>
                                                }
                                            </div>
                                        )

                                    })
                                    :
                                    <div className='flex items-center justify-center w-full h-full'>
                                        <h1 className='pt-5 m-0 text-2xl font-bold opacity-70 text-base-neutral'>No Upcoming Birthdays...</h1>
                                    </div>
                                }
                            </div>
                        </Scrollbars>
                    </div>
                </div>
                <div className='flex flex-col items-center justify-center bg-base-100 rounded-xl h-[55%]'>
                    <h1 className='w-full p-3 m-0 text-2xl font-bold 2xl:p-5 2xl:text-3xl 4xl:text-4xl text-neutral '>Your Family</h1>
                    <FamilyCarousel family={family} familyMutate={familyMutate} mainId={session.user.id}></FamilyCarousel>
                </div>
            </div >
        </div >
    )
}