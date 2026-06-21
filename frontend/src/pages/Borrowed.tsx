import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBorrows, getBooks, getUsers, borrow, returnBook } from "../api";
import { Spinner } from "@/components/Spinner";
import { Button } from "@/components/Button";
import { Select } from "@/components/Select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export function Borrowed() {
  const borrowSchema = z.object({
    book_id: z.string().refine((v) => v !== "0", { message: "Incorrect id" }),
    user_id: z.string().refine((v) => v !== "0", { message: "Incorrect id" }),
  });
  const { register, getValues, trigger } = useForm({
    resolver: zodResolver(borrowSchema),
    mode: "onChange",
  });
  const { isLoading, data, error } = useQuery({
    queryKey: ["borrows"],
    queryFn: getBorrows,
  });
  const booksQuery = useQuery({
    queryKey: ["books"],
    queryFn: getBooks,
  });
  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });
  const borrowMutation = useMutation({
    mutationKey: ["borrowBook"],
    mutationFn: borrow,
  });
  const queryClient = useQueryClient();
  const borrowBook = async () => {
    const valid = await trigger();
    if (!valid) return;
    const vals = getValues();
    await borrowMutation.mutateAsync(vals);
    queryClient.invalidateQueries(["borrows"]);
  };

  const returnBookMutation = useMutation({
    mutationKey: ["returnBook"],
    mutationFn: returnBook,
  });

  const returnBookHandler = async (borrow_id: number) => {
    await returnBookMutation.mutateAsync({ borrow_id });
    queryClient.invalidateQueries(["borrows"]);
  };

  return (
    <div>
      {usersQuery.data && booksQuery.data && (
        <div className="flex items-center gap-4 p-4">
          <Select defaultValue={0} {...register("user_id")}>
            <option disabled value={0} key={"default"}>
              Select user
            </option>
            {usersQuery.data.map((u) => (
              <option value={parseInt(u.id)} key={u.id}>
                {u.name}
              </option>
            ))}
          </Select>

          <Select defaultValue={0} {...register("book_id")}>
            <option disabled value={0} key={"default"}>
              Select book
            </option>

            {booksQuery.data.map((b) => (
              <option value={parseInt(b.id)} key={b.id}>
                {b.name}
              </option>
            ))}
          </Select>
          <Button className="text-lg font-semibold" onClick={borrowBook}>
            <p className="flex gap-2">
              {borrowMutation.isPending && <Spinner />}Borrow
            </p>
          </Button>
          {borrowMutation.error && (
            <p className="font-semibold text-destructive">
              {borrowMutation.error?.data.detail}
            </p>
          )}
        </div>
      )}

      {isLoading && <Spinner />}
      {data && (
        <div className="overflow-x-auto rounded-lg border bg-card px-4 py-2">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-md px-4 py-2 text-left font-semibold">
                  ID
                </th>
                <th className="text-md px-4 py-2 text-left font-semibold">
                  Book
                </th>
                <th className="text-md px-4 py-2 text-left font-semibold">
                  User
                </th>
                <th className="text-md px-4 py-2 text-left font-semibold">
                  Borrowed at
                </th>
                <th className="text-md px-4 py-2 text-left font-semibold">
                  Due date
                </th>
                <th className="text-md px-4 py-2 text-left font-semibold">
                  Returned at
                </th>
                <th className="text-md px-4 py-2 text-left font-semibold">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {data
                .sort((a, b) => b.id - a.id)
                .map((r) => (
                  <tr key={r.id}>
                    <td className="px-4 py-2">{r.id}</td>
                    <td className="px-4 py-2">{r.book_name}</td>
                    <td className="px-4 py-2">{r.user_name}</td>
                    <td className="px-4 py-2">{r.borrowed_at}</td>
                    <td className="px-4 py-2">{r.due_date}</td>
                    <td className="px-4 py-2">
                      {r.returned_at ? (
                        r.returned_at
                      ) : (
                        <Button
                          onClick={() => returnBookHandler(r.id)}
                          className="flex gap-2"
                        >
                          <p>
                            {returnBookMutation.isPending && <Spinner />}Return
                          </p>
                        </Button>
                      )}
                    </td>
                    <td className="px-4 py-2">{r.status}</td>
                    <td className="max-w-sm truncate px-4 py-2">
                      {r.publisher}
                    </td>
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
