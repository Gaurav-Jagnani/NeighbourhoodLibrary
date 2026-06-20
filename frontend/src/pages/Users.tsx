import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../api";
import { Spinner } from "@/components/Spinner";
import { Button } from "@/components/Button";
import { Plus } from "lucide-react";
import { Dialog } from "@/components/Dialog";
import { useState } from "react";
import { Input } from "@/components/Input";

export function Users() {
  const [showUserDialog, setshowUserDialog] = useState(true);
  const { isLoading, data, error } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });
  return (
    <div className="flex flex-col gap-4">
      <Button
        onClick={() => setshowUserDialog(true)}
        className="flex w-fit items-center gap-4 font-semibold"
      >
        <Plus />
        Add user
      </Button>
      {showUserDialog && (
        <Dialog closeFn={() => setshowUserDialog(false)}>
          <div className="flex flex-col gap-4 rounded-lg bg-card text-card-foreground">
            <p className="text-2xl font-semibold">Add user</p>
            <div className="flex flex-col gap-2">
              <Input placeholder="Name" />
              <Input placeholder="Phone" />
              <Input placeholder="Address" />
              <Input placeholder="Email" />
            </div>
            <div className="ml-auto flex gap-2">
              <Button onClick={() => setshowUserDialog(false)}>Close</Button>
              <Button onClick={() => setshowUserDialog(false)}>Save</Button>
            </div>
          </div>
        </Dialog>
      )}
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
                  email
                </th>
                <th className="text-md px-4 py-2 text-left font-semibold">
                  phone
                </th>
                <th className="text-md px-4 py-2 text-left font-semibold">
                  address
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((r) => (
                <tr key={r.id}>
                  <td className="px-4 py-2">{r.id}</td>
                  <td className="px-4 py-2">{r.name}</td>
                  <td className="px-4 py-2">{r.email}</td>
                  <td className="px-4 py-2">{r.phone}</td>
                  <td className="px-4 py-2">{r.address}</td>
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
