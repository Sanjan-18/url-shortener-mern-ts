import axios from "axios";

export const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

export type ShortUrl = {
  _id: string;
  originalUrl: string;
  shortCode: string;
  clicks: number;
  createdAt: string;
};

export async function getUrls() {
  const { data } = await API.get<ShortUrl[]>("/urls");
  return data;
}

export async function createUrl(originalUrl: string) {
  const { data } = await API.post<ShortUrl>("/urls", { originalUrl });
  return data;
}

export async function deleteUrl(id: string) {
  await API.delete(`/urls/${id}`);
}
