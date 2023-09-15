export default function CreditCard({ name, balance }) {

    return (
        <div className="relative flex flex-col justify-between w-full bg-center bg-cover text-neutral rounded-xl lg:h-40 xl:h-52 4xl:h-56 5xl:h-64" style={{ backgroundImage: "url('/card.svg')" }}>
            <h2 className="absolute font-bold top-4 right-4 text-neutral">HCIB</h2>
            <div className='flex flex-col gap-2 p-3 xl:p-5 xl:pt-5 xl:gap-5 4xl:gap-16 4xl:pt-10'>
                <div>
                    <h2 className='m-0 font-normal text-neutral lg:text-xl 5xl:text-2xl'>Current Balance</h2>
                    <h2 className='m-0 font-semibold text-[#FFFBF9] lg:text-2xl 2xl:text-3xl 5xl:text-5xl'>AED {balance}</h2>
                </div>
                <h3 className='m-0 font-semibold text-neutral lg:text-xl 5xl:text-3xl'>**** **** **** 3812 </h3>
            </div>
            <h2 className="absolute text-2xl font-bold bottom-4 right-4 text-neutral">
                12/25
            </h2>


        </div>
    )
}
