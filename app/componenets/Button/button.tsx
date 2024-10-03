import { Button } from "@/components/ui/button";
import React from "react";

interface PropsInterface  {
   children : React.ReactNode
}


function ButtonC({ children }: PropsInterface): JSX.Element {
    return (
      <Button className={`border-[1px] sm:px-11 sm:py-6 border-[#E0580C] text-[#E0580C] font-[500] hover:bg-[#E0580C] hover:text-white bg-white max-w-[173px]`}>
        {children}
      </Button>
    );
  }
  
  function ButtonN({ children }: PropsInterface): JSX.Element {
    return (
      <Button className={`bg-[#E0580C] text-white sm:px-11 sm:py-6 font-[500] hover:bg-white hover:text-[#E0580C] max-w-[173px]`}>
        {children}
      </Button>
    );
  }
  
  export { ButtonC, ButtonN };