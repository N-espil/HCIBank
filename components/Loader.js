import { Loading } from '@nextui-org/react'
import React from 'react'

export default function Loader() {
  return (
      <div className='flex items-center justify-center w-full h-screen pt-10 bg-neutral'>
          <Loading size='xl' color="secondary"></Loading>
      </div>
  )
}
