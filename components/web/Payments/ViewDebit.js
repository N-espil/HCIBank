import React from 'react'

export default function ViewDebit({ debit }) {
    if (!debit)
        return
    const { monthlyAmount, totalAmount, installmentsLeft } = debit
    return (
        <div className="flex flex-col gap-10 p-2">
            <div className="flex items-center justify-between gap-16">
                <p className="text-xl font-medium text-[#FFFBF9]">Monthly Amount:</p>
                <p className="text-xl font-medium text-[#FFFBF9]"><span className="amount">{monthlyAmount.toFixed(2)}</span></p>
            </div>
            <div className="flex items-center justify-between gap-16">
                <p className="text-xl font-medium text-[#FFFBF9]">Total Amount:</p>
                <p className="text-xl font-medium text-[#FFFBF9]">{totalAmount.toFixed(2)}</p>
            </div>
            <div className="flex items-center justify-between gap-16">
                <p className="text-xl font-medium text-[#FFFBF9]">Remaining Installments:</p>
                <p className="text-xl font-medium text-[#FFFBF9]">{installmentsLeft}</p>
            </div>
        </div>

    )
}
