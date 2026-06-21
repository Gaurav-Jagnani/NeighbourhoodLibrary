import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { getBooks } from "../api";
import { Spinner } from "@/components/Spinner";
import { Button } from "@/components/Button";

export function Books() {
  const { isLoading, data, error } = useQuery({
    queryKey: ["books"],
    queryFn: getBooks,
  });
  return (
    <div>
      {isLoading && <Spinner />}
      {data && (
        <div className="overflow-x-auto rounded-lg border bg-card px-4 py-2">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-md px-4 py-2 text-left font-semibold">
                  id
                </th>
                <th className="text-md px-4 py-2 text-left font-semibold">
                  name
                </th>
                <th className="text-md px-4 py-2 text-left font-semibold">
                  thumbnail_image_name
                </th>
                <th className="text-md px-4 py-2 text-left font-semibold">
                  description
                </th>
                <th className="text-md px-4 py-2 text-left font-semibold">
                  author
                </th>
                <th className="text-md px-4 py-2 text-left font-semibold">
                  publisher
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((r) => (
                <tr key={r.id}>
                  <td className="px-4 py-2">{r.id}</td>
                  <td className="px-4 py-2">{r.name}</td>
                  <td className="px-4 py-2">{r.thumbnail_image_name}</td>
                  <td className="px-4 py-2">{r.description}</td>
                  <td className="px-4 py-2">{r.author}</td>
                  <td className="max-w-sm truncate px-4 py-2">{r.publisher}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {error && <p>Error</p>}
    </div>
  );
}
