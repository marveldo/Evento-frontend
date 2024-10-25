"use client";
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar'
import React from 'react';

interface Props {
    children : React.ReactNode
} 

export default function ProgressProvider ({children} : Props) {
    return (<>
     {children}
     <ProgressBar
      height="3px"
      color="#E0580C"
      options={{ showSpinner: false }}
      shallowRouting
     />
    </>)
}