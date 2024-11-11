import React from 'react'
import Employ from './employ'
import type { Metadata } from 'next';


export const metadata = { title: `Employ | Dashboard ` } satisfies Metadata;

function page() {
  return (
    <>
    <Employ />
    </>
  )
}

export default page
