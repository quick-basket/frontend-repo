import journalAPI from "@/api/journal/journalAPI";
import { queryKeys } from "@/constants/queryKey";
import { JournalList } from "@/types/journal/type";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const useJournal = (id?: string) => {
  const { data, isLoading, error } = useQuery<JournalList[], Error>({
    queryKey: [queryKeys.journal.GET_JOURNAL],
    queryFn: async () => await journalAPI.getJournalList(id!),
    enabled: !!id,
  });

  return {
    data,
    isLoading,
    error,
  };
};

export default useJournal;
