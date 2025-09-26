import { ReactNode } from "react";
import { ConnectKitButton } from "connectkit";
import { Navigation } from "./ui/navigation";
import AddressPill from "@/components/shared/AddressPill";
import { useUserAddressModal } from "@/hooks/useUserAddressModal";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const userAddressModal = useUserAddressModal();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-semibold text-slate-900">
              SDK Playground
            </h1>
            <Navigation />
          </div>
          <div className="flex items-center space-x-3">
            <AddressPill onOpen={userAddressModal.openModal} />

            <ConnectKitButton />
          </div>
        </div>
      </header>
      <userAddressModal.Modal />
      <main className="container mx-auto px-4 py-12">{children}</main>
    </div>
  );
}
