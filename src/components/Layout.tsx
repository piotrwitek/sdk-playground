import { ReactNode } from "react";
import { ConnectKitButton } from "connectkit";
import { Navigation } from "./ui/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useGlobalState } from "@/context/GlobalStateContext";
import { Environment, environmentLabels } from "@/types";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { environment, setEnvironment } = useGlobalState();

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
            <Select value={environment} onValueChange={setEnvironment}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Environment" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(Environment).map((env) => (
                  <SelectItem key={env} value={env}>
                    {environmentLabels[env]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <ConnectKitButton />
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-12">{children}</main>
    </div>
  );
}
