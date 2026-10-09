import axios from "axios";
import { Configuration } from "@/generated-client";
import {
  AuthApi,
  CategorasDeServicioApi,
  ClientesApi,
  ColaboradorasApi,
  DashboardApi,
  DisponibilidadApi,
  HorariosApi,
  PagosApi,
  ReservasApi,
  RolesYPermisosApi,
  ServiciosApi,
  SucursalesApi,
  UsuariosApi,
} from "@/generated-client";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3003";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem("auth-storage");
      if (raw) {
        const parsed = JSON.parse(raw);
        const token = parsed?.state?.token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch {
      // ignore parse errors
    }
  }

  if (config.data && typeof config.data === "object") {
    config.data = trimStrings(config.data);
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error.config?.url?.includes("/auth/login") === true;
    if (
      error.response?.status === 401 &&
      !isLoginRequest &&
      typeof window !== "undefined"
    ) {
      localStorage.removeItem("auth-storage");
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  },
);

function trimStrings(obj: unknown): unknown {
  if (typeof obj === "string") return obj.trim();
  if (Array.isArray(obj)) return obj.map(trimStrings);
  if (obj !== null && typeof obj === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = trimStrings(value);
    }
    return result;
  }
  return obj;
}

const config = new Configuration({ basePath: API_BASE_URL });

export const authApi = new AuthApi(config, undefined, api);
export const categoriasApi = new CategorasDeServicioApi(config, undefined, api);
export const clientesApi = new ClientesApi(config, undefined, api);
export const colaboradorasApi = new ColaboradorasApi(config, undefined, api);
export const dashboardApi = new DashboardApi(config, undefined, api);
export const disponibilidadApi = new DisponibilidadApi(config, undefined, api);
export const horariosApi = new HorariosApi(config, undefined, api);
export const pagosApi = new PagosApi(config, undefined, api);
export const reservasApi = new ReservasApi(config, undefined, api);
export const rolesApi = new RolesYPermisosApi(config, undefined, api);
export const serviciosApi = new ServiciosApi(config, undefined, api);
export const sucursalesApi = new SucursalesApi(config, undefined, api);
export const usuariosApi = new UsuariosApi(config, undefined, api);
