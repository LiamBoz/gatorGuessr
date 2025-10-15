
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getRandomEntry } from "../services/entries";

export function useRandomEntry() {
  return useQuery({
    queryKey: ["random-entry"],
    queryFn: getRandomEntry,
    // nice-to-have options:
    refetchOnWindowFocus: false,
  });
}
