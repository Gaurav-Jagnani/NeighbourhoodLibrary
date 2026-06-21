import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { login } from "../api";
import { Spinner } from "@/components/Spinner";
import { useLocation, useNavigate } from "react-router-dom";

export function Login() {
  const naviagte = useNavigate();
  const location = useLocation();
  const loginMutation = useMutation({
    mutationKey: ["login"],
    mutationFn: login,
  });
  const loginHandler = async () => {
    const valid = await trigger();
    if (!valid) return;
    const vals = getValues();
    try {
      const res = await loginMutation.mutateAsync(vals);
      localStorage.setItem("token", res);
    } catch (error) {
      return;
    }
    const from = location.state?.from?.pathname || "/books";
    naviagte(from);
  };
  const schema = z.object({
    username: z
      .string()
      .min(4, "Min 4 chars required")
      .max(10, "Max 10 chars long"),
    password: z
      .string()
      .min(4, "Min 4 chars required")
      .max(10, "Max 10 chars long"),
  });
  const {
    register,
    formState: { errors },
    trigger,
    getValues,
  } = useForm({
    mode: "onBlur",
    resolver: zodResolver(schema),
  });
  return (
    <div className="flex flex-col gap-4 rounded-md border p-4">
      <p className="rounded-md bg-amber-400 px-2 py-1 text-white">
        Use username: <span className="font-extrabold">test</span> and password:
        <span className="font-extrabold">test</span>
      </p>
      <div className="w-full">
        <Input
          className="w-full"
          placeholder="Username"
          {...register("username")}
        />
        <p className="text-sm text-destructive">{errors.username?.message}</p>
      </div>
      <div className="w-full">
        <Input
          className="w-full"
          placeholder="Password"
          type="password"
          {...register("password")}
        />
        <p className="text-sm text-destructive">{errors.password?.message}</p>
      </div>
      <Button
        className="mt-4 flex w-full items-center justify-center gap-2"
        onClick={loginHandler}
      >
        {loginMutation.isPending && <Spinner />}Submit
      </Button>
      {loginMutation.error && (
        <p className="text-destructive">Incorrect username/password</p>
      )}
    </div>
  );
}
