import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBooks, createBook, updateBook } from "../api";
import { Spinner } from "@/components/Spinner";
import { Button } from "@/components/Button";
import { Dialog } from "@/components/Dialog";
import { Plus, SquarePen } from "lucide-react";
import { Input } from "@/components/Input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useState } from "react";

function BookForm({ selectedBook, closeFn }) {
  const queryClient = useQueryClient();
  const bookSchema = z.object({
    name: z.string().min(4, "Min 4 chars required"),
    description: z.string().min(4, "Min 4 chars required"),
    author: z.string().min(4, "Min 4 chars required"),
    publisher: z.string().min(4, "Min 4 chars required"),
    // email: z.string().min(4, "Min 4 chars required"),
  });

  const {
    register,
    trigger,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(bookSchema),
    mode: "onBlur",
    defaultValues: selectedBook
      ? selectedBook
      : {
          // id: "",
          name: "",
          // thumbnail_image_name: "",
          description: "",
          author: "",
          publisher: "",
        },
  });

  const createBookMutation = useMutation({
    mutationKey: ["updateBook"],
    mutationFn: selectedBook ? updateBook : createBook,
  });
  const createBookHandler = async () => {
    const valid = await trigger();
    if (!valid) return;
    const vals = getValues();
    if (selectedBook) vals.id = selectedBook.id;
    await createBookMutation.mutateAsync(vals);
    closeFn();
    queryClient.invalidateQueries(["books"]);
  };
  return (
    <div className="flex flex-col gap-4 rounded-lg bg-card text-card-foreground">
      <p className="text-2xl font-semibold">Add Book</p>
      <div className="flex flex-col gap-2">
        <Input {...register("name")} placeholder="Name" />
        <p className="text-xs text-destructive">{errors.name?.message}</p>
        <Input {...register("description")} placeholder="Description" />
        <p className="text-xs text-destructive">
          {errors.description?.message}
        </p>
        <Input {...register("author")} placeholder="Author" />
        <p className="text-xs text-destructive">{errors.author?.message}</p>
        <Input {...register("publisher")} placeholder="Publisher" />
        <p className="text-xs text-destructive">{errors.publisher?.message}</p>
        {/* <Input {...register("email")} placeholder="Email" /> */}
        {/* <p className="text-xs text-destructive">{errors.email?.message}</p> */}
      </div>
      <div className="ml-auto flex flex-col items-end">
        <div className="mt-2 mb-2 flex gap-2">
          <Button onClick={closeFn}>Close</Button>
          <Button onClick={createBookHandler} className="flex gap-2">
            {createBookMutation.isPending && <Spinner />}Save
          </Button>
        </div>
        {createBookMutation.error && (
          <p className="text-destructive">
            {JSON.stringify(
              createBookMutation.error?.data?.detail?.replaceAll('"', "")
            )}
          </p>
        )}
      </div>
    </div>
  );
}

export function Books() {
  const [showBookDialog, setshowBookDialog] = useState(false);
  const [selectedBook, setselectedBook] = useState(null);
  const { isLoading, data, error } = useQuery({
    queryKey: ["books"],
    queryFn: getBooks,
  });
  return (
    <div>
      <Button
        onClick={() => setshowBookDialog(true)}
        className="flex w-fit items-center gap-4 font-semibold"
      >
        <Plus />
        Add Book
      </Button>
      {showBookDialog && (
        <Dialog
          selectedBook={selectedBook}
          closeFn={() => setshowBookDialog(false)}
        >
          <BookForm
            selectedBook={selectedBook}
            closeFn={() => {
              setselectedBook(null);
              setshowBookDialog(false);
            }}
          />
        </Dialog>
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
                  Name
                </th>
                {/* <th className="text-md px-4 py-2 text-left font-semibold">
                  thumbnail_image_name
                </th> */}
                <th className="text-md px-4 py-2 text-left font-semibold">
                  Description
                </th>
                <th className="text-md px-4 py-2 text-left font-semibold">
                  Author
                </th>
                <th className="text-md px-4 py-2 text-left font-semibold">
                  Publisher
                </th>
              </tr>
            </thead>
            <tbody>
              {data
                .sort((a, b) => b.id - a.id)
                .map((r) => (
                  <tr key={r.id}>
                    <td className="px-4 py-2">{r.id}</td>
                    <td className="px-4 py-2">{r.name}</td>
                    {/* <td className="px-4 py-2">{r.thumbnail_image_name}</td> */}
                    <td className="px-4 py-2">{r.description}</td>
                    <td className="px-4 py-2">{r.author}</td>
                    <td className="max-w-sm truncate px-4 py-2">
                      {r.publisher}
                    </td>
                    <td className="truncate px-4 py-2">
                      <Button
                        onClick={() => {
                          setselectedBook(r);
                          setshowBookDialog(true);
                        }}
                      >
                        <SquarePen />
                      </Button>
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
