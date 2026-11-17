interface AuthCardProps {
  subtitle: string;
  children: React.ReactNode;
}

export function AuthCard({ subtitle, children }: AuthCardProps) {
  return (
    <main className="mb-40 flex flex-grow items-center justify-center pt-32 font-nunito">
      <div className="space-y-6 p-20 shadow-lg shadow-[#0000000A] max-[500px]:p-6 max-[350px]:p-2">
        <div className="mb-3 flex flex-col gap-y-2 text-center">
          <h1 className="font-montserrat text-[32px] font-[600]">Welcome to Evento</h1>
          <p className="text-[12px]">{subtitle}</p>
        </div>
        {children}
      </div>
    </main>
  );
}

export function OrDivider() {
  return (
    <div className="flex h-px w-full items-center justify-center bg-[#767676]">
      <p className="bg-white px-4 font-work text-[11px]">OR</p>
    </div>
  );
}
