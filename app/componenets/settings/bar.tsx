"use client";
import React from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from "next/link";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [currentvalue, setcurrentvalue] = React.useState(pathname);
  const [opendialog, setopendialog] = React.useState(false);

  const handlevaluechange = (value: string) => {
    if (value === "delete") {
      setopendialog(true);
    } else {
      setcurrentvalue(value)
      router.push(value);
    }
  };
  return (
    <>
      <div className="md:flex hidden flex-col max-[1200px]:px-10 min-[1300px]:px-24 max-[1290px]:px-14 max-[870px]:px-4 gap-y-10">
        <div className="flex items-center gap-x-3">
          <h1 className="font-montserrat font-[600] text-[48px]">Settings</h1>
          <div className="h-[0px] border-[#3C3C3C] border-[1px] w-[61px]"></div>
        </div>
        <div className="ps-2 font-nunito flex flex-col gap-y-7 font-[400] text-[20px]">
          <Link href='/settings/account' className={`p-3 ${pathname === '/settings/account' ? 'bg-[#FCEEE7]' : '' }  rounded-[8px]`}>Account</Link>
          <Link href='/settings/data-and-security' className={`p-3 ${pathname === '/settings/data-and-security' ? 'bg-[#FCEEE7]' : '' } rounded-[8px]`}>Data & Security</Link>
          <div className="p-3 text-[#F04438] hover:cursor-pointer" onClick={()=> {setopendialog(true)}}>Delete Account</div>
        </div>
      </div>

      <div className="md:hidden flex flex-col gap-y-2 px-3">
        <div className="flex items-center gap-x-3">
          <h1 className="font-montserrat font-[600] text-[32px]">Settings</h1>
          <div className="h-[0px] border-[#3C3C3C] border-[1px] w-[61px]"></div>
        </div>

        <Select onValueChange={handlevaluechange} value={currentvalue}>
          <SelectTrigger className="h-[56px]  border-[#EBEBEB] border-[1px]">
            <SelectValue placeholder="Select event category" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="/settings/account">Account</SelectItem>
            <SelectItem value="/settings/data-and-security">Data & Security</SelectItem>
            <SelectItem value="delete" className="text-[#F04438]">
              Delete Account
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <AlertDialog open={opendialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={()=>{setopendialog(false)}} className="bg-[#F04438] text-white">Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-[#E0580C] text-white">Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
