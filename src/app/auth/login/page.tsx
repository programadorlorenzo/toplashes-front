"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Box,
  Button,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { isEmail, isNotEmpty } from "@mantine/form";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/stores/auth-store";

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: isEmail("Ingresa un correo válido"),
      password: isNotEmpty("La contraseña es obligatoria"),
    },
  });

  const handleSubmit = form.onSubmit(async (values) => {
    setLoading(true);
    try {
      const { data } = await authApi.authControllerLogin(values);
      setAuth(data.accessToken, data.user);
      notifications.show({
        title: "Bienvenida",
        message: `Hola, ${data.user.name}`,
        color: "green",
      });
      router.replace("/dashboard");
    } catch (error: unknown) {
      const message =
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response &&
        error.response.data &&
        typeof error.response.data === "object" &&
        "message" in error.response.data
          ? String(
              (error.response.data as { message: string | string[] }).message,
            )
          : "No pudimos iniciar sesión. Verifica tus credenciales.";

      notifications.show({
        title: "Error al iniciar sesión",
        message: Array.isArray(message) ? message.join(", ") : message,
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  });

  return (
    <Box
      component="main"
      mih="100dvh"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        background: "hsl(var(--tl-taupe))",
      }}
    >
      <Paper
        shadow="xl"
        radius="lg"
        p={{ base: "xl", sm: 40 }}
        w="100%"
        maw={420}
        style={{
          border: "none",
          backgroundColor: "hsl(var(--card))",
        }}
      >
        <Stack gap="xl">
          <Stack gap="sm" align="center">
            <Box
              style={{
                width: 260,
                height: 140,
                position: "relative",
                borderRadius: "var(--mantine-radius-md)",
                overflow: "hidden",
              }}
            >
              <Image
                src="/brand/logo-toplashes.jpg"
                alt="Top Lashes Perú"
                fill
                sizes="260px"
                style={{ objectFit: "contain" }}
                priority
              />
            </Box>
            <Text
              size="sm"
              style={{ color: "hsl(var(--tl-brown-medium))" }}
              ta="center"
            >
              Panel Administrativo
            </Text>
          </Stack>

          <form onSubmit={handleSubmit}>
            <Stack gap="md">
              <TextInput
                label="Correo electrónico"
                placeholder="tu@correo.com"
                autoComplete="email"
                styles={{
                  label: { color: "hsl(var(--tl-brown))" },
                }}
                {...form.getInputProps("email")}
              />
              <PasswordInput
                label="Contraseña"
                placeholder="Tu contraseña"
                autoComplete="current-password"
                styles={{
                  label: { color: "hsl(var(--tl-brown))" },
                }}
                {...form.getInputProps("password")}
              />
              <Button
                type="submit"
                fullWidth
                loading={loading}
                mt="xs"
                size="md"
                styles={{
                  root: {
                    backgroundColor: "hsl(var(--tl-taupe))",
                    color: "hsl(var(--tl-ivory))",
                    fontWeight: 500,
                    letterSpacing: "0.03em",
                    transition: "all 0.2s ease",
                  },
                }}
              >
                Iniciar sesión
              </Button>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Box>
  );
}
