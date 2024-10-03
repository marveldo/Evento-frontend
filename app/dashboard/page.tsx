import { authOptions } from "@/lib/authOptions"
import { getServerSession } from "next-auth"
import { MainDashboard } from "../componenets/dashboard/dashboard"

export default async function DashboardPage(){
    const session = await getServerSession(authOptions)
    return (<div className="pt-32 max-[1200px]:px-10 min-[1300px]:px-24 max-[1290px]:px-14 max-[870px]:px-4 space-y-12 flex-grow mb-40">
        <h1 className="font-montserrat text-[24px] font-[500] leading-[32px]">Welcome {session?.user?.name} ,</h1>
        <MainDashboard/>

    </div>)
}