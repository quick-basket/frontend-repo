import useJournal from "@/hooks/journal/useJournal";
import { DataTable } from "../ui/DataTable";
import { columns } from "./columns";
import Spinner from "../spinner/Spinner";

interface JournalTableProps {
  storeId: string;
}

const JournalTable = ({ storeId }: JournalTableProps) => {
  const { data: journal, isLoading, error } = useJournal(storeId);

  return (
    <div className="container mx-auto pb-10 pt-4">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Journals</h1>
      </div>
      {isLoading ? (
        <Spinner fullScreen={true} size="large" />
      ) : (
        journal && <DataTable columns={columns()} data={journal} />
      )}
    </div>
  );
};

export default JournalTable;
