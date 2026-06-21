import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUsers, createUser, updateUser } from "../api";
import { Spinner } from "@/components/Spinner";
import { Button } from "@/components/Button";
import { Plus, SquarePen } from "lucide-react";
import { Dialog } from "@/components/Dialog";
import { useState } from "react";
import { Input } from "@/components/Input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

function UserForm({ selectedUser, closeFn }) {
  const queryClient = useQueryClient();
  const userSchema = z.object({
    name: z.string().min(4, "Min 4 chars required"),
    password: z.string().min(4, "Min 4 chars required"),
    phone: z.string().min(4, "Min 4 chars required"),
    address: z.string().min(4, "Min 4 chars required"),
    email: z.string().min(4, "Min 4 chars required"),
  });

  const {
    register,
    trigger,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userSchema),
    mode: "onBlur",
    defaultValues: selectedUser
      ? selectedUser
      : {
          name: "",
          password: "",
          phone: "",
          address: "",
          email: "",
        },
  });

  const createUserMutation = useMutation({
    mutationKey: ["updateUser"],
    mutationFn: selectedUser ? updateUser : createUser,
  });
  const createUserHandler = async () => {
    console.log("-----");
    const valid = await trigger();
    if (!valid) return;
    const vals = getValues();
    if (selectedUser) vals.id = selectedUser.id;
    await createUserMutation.mutateAsync(vals);
    closeFn();
    queryClient.invalidateQueries(["users"]);
  };
  return (
    <div className="flex flex-col gap-4 rounded-lg bg-card text-card-foreground">
      <p className="text-2xl font-semibold">Add user</p>
      <div className="flex flex-col gap-2">
        <Input {...register("name")} placeholder="Name" />
        <p className="text-xs text-destructive">{errors.name?.message}</p>
        <Input
          {...register("password")}
          placeholder="Password"
          type="password"
        />
        <p className="text-xs text-destructive">{errors.password?.message}</p>
        <Input {...register("phone")} placeholder="Phone" />
        <p className="text-xs text-destructive">{errors.phone?.message}</p>
        <Input {...register("address")} placeholder="Address" />
        <p className="text-xs text-destructive">{errors.address?.message}</p>
        <Input {...register("email")} placeholder="Email" />
        <p className="text-xs text-destructive">{errors.email?.message}</p>
      </div>
      <div className="ml-auto flex flex-col items-end">
        <div className="mt-2 mb-2 flex gap-2">
          <Button onClick={closeFn}>Close</Button>
          <Button onClick={createUserHandler} className="flex gap-2">
            {createUserMutation.isPending && <Spinner />}Save
          </Button>
        </div>
        {createUserMutation.error && (
          <p className="text-destructive">
            {JSON.stringify(
              createUserMutation.error?.data?.detail?.replaceAll('"', "")
            )}
          </p>
        )}
      </div>
    </div>
  );
}
export function Users() {
  const [showUserDialog, setshowUserDialog] = useState(false);
  const [selectedUser, setselectedUser] = useState(null);
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
        <Dialog
          selectedUser={selectedUser}
          closeFn={() => setshowUserDialog(false)}
        >
          <UserForm
            selectedUser={selectedUser}
            closeFn={() => {
              setselectedUser(null);
              setshowUserDialog(false);
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
                  <td className="truncate px-4 py-2">{r.address}</td>
                  <td className="truncate px-4 py-2">
                    <Button
                      onClick={() => {
                        setselectedUser(r);
                        setshowUserDialog(true);
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
