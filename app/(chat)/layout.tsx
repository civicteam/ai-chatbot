import { cookies } from "next/headers";
import Script from "next/script";
import { AppSidebar } from "@/components/app-sidebar";
import { DataStreamProvider } from "@/components/data-stream-provider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getUser } from "@civic/auth/nextjs";
import { ensureUserExists } from "@/lib/db/queries";

export const experimental_ppr = true;

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, cookieStore] = await Promise.all([getUser(), cookies()]);
  const isCollapsed = cookieStore.get("sidebar_state")?.value !== "true";

  // Sync Civic Auth user with database
  if (user?.id && user?.email) {
    try {
      await ensureUserExists(user.id, user.email);
    } catch (error) {
      console.error("Failed to sync user with database:", error);
    }
  }

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js"
        strategy="beforeInteractive"
      />
      <DataStreamProvider>
        <SidebarProvider defaultOpen={!isCollapsed}>
          <AppSidebar user={user || undefined} />
          <SidebarInset>{children}</SidebarInset>
        </SidebarProvider>
      </DataStreamProvider>
    </>
  );
}
