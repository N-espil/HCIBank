import {  Loading } from "@nextui-org/react";
import { WEB_URL } from "../../../util/keys";
import useSWR from 'swr'
import { useRouter } from 'next/router'

export default function QuickTransfer({ session }) {

    const fetcher = (url) => fetch(url).then((res) => res.json());
    const { data, error, isLoading } = useSWR(`${WEB_URL}/api/planetscale/user/getFamily?id=${session.user.id}`, fetcher);
    if (!data || isLoading)
        return (
            <div className="flex items-center justify-center pt-10"><Loading /></div>
        )
    let family = data.subUsers
    const router = useRouter();
    return (
        <div className='flex flex-col items-center w-full p-5 px-5 rounded-xl bg-accent text-neutral lg:hidden 2xl:inline-flex 2xl:mt-auto '>
            <h1 className='self-start mb-5 font-bold 4xl:text-4xl text-neutral lg:text-2xl'>Quick Transfer</h1>
            <div className="flex items-center justify-center w-full gap-16 my-auto p-7">
                {family?.length != 0 ?
                    family?.map((member, index) => {
                        if (index < 3) {

                            const firstname = member.name.split(" ")[0]
                            const lastname = member.name.split(" ")[1]

                            return (
                                <div key={index} className='flex flex-col items-center justify-center group'>
                                    <div
                                        className="flex items-center justify-center w-20 h-20 4xl:w-28 4xl:h-28 rounded-full cursor-pointer group-hover:bg-accent border-[4px] border-neutral bg-neutral text-accent"
                                        onClick={() => router.push(`${WEB_URL}/dashboard?tab=transactions&username=${member.username}`)}
                                    >

                                        <h2 className='m-0 text-4xl 4xl:text-6xl group-hover:text-neutral'>{firstname[0].toUpperCase() + lastname[0].toUpperCase()}</h2>
                                    </div>
                                    <div className='flex justify-center mt-4 '>
                                        <h1 className='text-xl font-semibold 4xl:text-3xl text-neutral'>{firstname}</h1>
                                    </div>
                                </div>
                            )
                        }
                    })
                    :
                    <div className='flex flex-col items-center justify-center w-full h-full py-10 rounded-2xl'>
                        <h1 className='text-xl font-semibold 4xl:text-3xl text-neutral'>No Family Members...</h1>
                    </div>
                }

            </div>
        </div>
    )
}
