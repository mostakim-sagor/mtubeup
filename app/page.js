import { redirect } from "next/navigation";
import { Suspense } from "react";
import { resolvePage } from "@/lib/router";
import Home from "@/components/pages/Home";
import Download from "@/components/pages/Download";
import Downloads from "@/components/pages/Downloads";
import Finished from "@/components/pages/Finished";
import Settings from "@/components/pages/Settings";
import Api from "@/components/pages/Api";
import Support from "@/components/pages/Support";
import Terms from "@/components/pages/Terms";
import Privacy from "@/components/pages/Privacy";

// This route intentionally stays fully dynamic: which page renders
// depends entirely on the query string, per the app's query-parameter
// routing requirement (see lib/router.js).
export const dynamic = "force-dynamic";

const PAGE_COMPONENTS = {
  download: Download,
  downloads: Downloads,
  finished: Finished,
  settings: Settings,
  api: Api,
  support: Support,
  terms: Terms,
  privacy: Privacy
};

export default async function RootRoute({ searchParams }) {
  const { page, isEmpty } = resolvePage(await searchParams);

  // Bare "/" with no query string at all -> canonical home URL "/~".
  // A query string with an unrecognized key still renders Home inline
  // (no redirect), per spec: "If no supported query parameter exists,
  // show Home."
  if (page === "home" && isEmpty) {
    redirect("/~");
  }

  const PageComponent = PAGE_COMPONENTS[page] || Home;
  return (
    <Suspense fallback={null}>
      <PageComponent />
    </Suspense>
  );
}
