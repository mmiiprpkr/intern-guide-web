import { getCompany } from "@/actions/companyActions";
import SearchFilter from "./components/searchfilter";

export default async function Page() {
  const companies = await getCompany();
  console.log(companies);
  return (
    <div className="w-full overflow-y-hidden overflow-x-auto">
      <SearchFilter companies={companies} />
    </div>
  );
}

