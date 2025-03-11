

import Blog from "@/components/Blog/Blog";
// import { GetStaticPaths } from "next";


export default async function Page({params}: {params: Promise<{id:string}>}) {
  const {id }= await params;
  return <Blog id={id} />
}

export async function generateStaticParams() {
  const posts = (await import('@/assets/data/statisticsData.json')).default
 
  return Object.keys(posts).map((id) => ({
    id: id,
  }))
}

export const dynamicParams = false