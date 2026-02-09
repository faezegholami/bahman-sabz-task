"use client";
import { useAuthContext } from "@/src/auth/auth-guard";
import { AuthContext } from "@/src/auth/auth-provider";
import { Box, Center } from "@chakra-ui/react";
import { Button, Field, Input, Stack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

interface FormValues {
  username: string;
  password: string;
}
export default function LoginForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>();
  const { login } = useAuthContext();
  const values = watch();
  const onSubmit = async () => {
    try {
      const res = await login(values.username, values.password);
      if (res) {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Center w="320px" h="400px" maxH="500px">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="4" align="flex-start" maxW="sm">
          <Field.Root invalid={!!errors.username}>
            <Field.Label>نام کاربری</Field.Label>
            <Input {...register("username")} />
            <Field.ErrorText>{errors.username?.message}</Field.ErrorText>
          </Field.Root>

          <Field.Root invalid={!!errors.password}>
            <Field.Label>رمزعبور</Field.Label>
            <Input {...register("password")} type="password" />
            <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
          </Field.Root>

          <Button type="submit">ورود</Button>
        </Stack>
      </form>
    </Center>
  );
}
