import { FormEvent, useEffect, useMemo, useState } from "react";
import { Clipboard, Trash2, Check, ExternalLink } from "lucide-react";
import { createUrl, deleteUrl, getUrls, ShortUrl } from "./api";

const API_ROOT = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function App() {
  const [urls, setUrls] = useState<ShortUrl[]>([]);
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState("");

  const baseUrl = useMemo(() => API_ROOT.replace(/\/api\/?$/, ""), []);

  async function load() {
    try {
      setUrls(await getUrls());
    } catch {
      setError("Unable to connect to the backend. Start the Express server.");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const item = await createUrl(value.trim());
      setUrls((old) => [item, ...old]);
      setValue("");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Could not shorten URL.");
    } finally {
      setLoading(false);
    }
  }

  async function remove(id: string) {
    try {
      await deleteUrl(id);
      setUrls((old) => old.filter((item) => item._id !== id));
    } catch {
      setError("Could not delete this URL.");
    }
  }

  async function copy(code: string) {
    const link = `${baseUrl}/api/r/${code}`;
    await navigator.clipboard.writeText(link);
    setCopied(code);
    setTimeout(() => setCopied(null), 1200);
  }

  function openShortUrl(item: ShortUrl) {
  const link = `${baseUrl}/api/r/${item.shortCode}`;

  // Instantly update the click count on the webpage
  setUrls((old) =>
    old.map((url) =>
      url._id === item._id
        ? { ...url, clicks: url.clicks + 1 }
        : url
    )
  );

  // Open the short URL
  window.open(link, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="min-h-screen bg-[#080b13] text-white">
      <header className="h-[74px] border-b border-white/5 bg-[#090b12] px-5 flex items-center">
        <div className="text-[15px] font-medium tracking-tight text-white/95">
          URLShortner
        </div>
      </header>

      <main className="mx-auto max-w-[1360px] px-4 sm:px-5">
        <section className="pt-6">
          <div className="hero relative overflow-hidden rounded-xl border border-white/10 shadow-2xl">
            <div className="absolute inset-0 hero-glow" />
            <div className="absolute inset-x-0 bottom-0 h-24 tree-silhouette" />

            <div className="relative flex min-h-[300px] flex-col items-center justify-center px-5 py-12 text-center">
              <h1 className="text-4xl font-semibold tracking-tight sm:text-[40px]">
                URL Shortner
              </h1>
              <p className="mt-3 text-base text-white/85">
                paste your untidy link to shorten it
              </p>
              <p className="mt-2 max-w-3xl text-xs sm:text-sm text-white/70">
                free tool to shorten a URL or reduce link, Use our URL shortner
                to create a shortened &amp; neat link making it easy to use
              </p>

              <form
                onSubmit={submit}
                className="mt-5 flex w-full max-w-[1200px] overflow-hidden rounded-lg shadow-lg"
              >
                <input
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="urishortner.link / add your link"
                  className="min-w-0 flex-1 bg-white px-4 py-3 text-sm text-slate-700 outline-none placeholder:text-slate-400"
                />
                <button
                  disabled={loading}
                  className="bg-blue-600 px-5 py-3 text-sm font-semibold transition hover:bg-blue-500 disabled:opacity-60"
                >
                  {loading ? "Shortening..." : "Shorten URL"}
                </button>
              </form>

              {error && <p className="mt-3 text-xs text-red-200">{error}</p>}
            </div>
          </div>
        </section>

        <section className="mt-10 overflow-hidden rounded-xl border border-white/5 bg-[#334154] shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="bg-[#283649] text-[12px] font-bold uppercase tracking-wide text-white/90">
                  <th className="px-5 py-4">FULLURL</th>
                  <th className="px-5 py-4">SHORTURL</th>
                  <th className="px-5 py-4 text-center">CLICKS</th>
                  <th className="px-5 py-4 text-center">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {urls.map((item) => (
                  <tr key={item._id} className="border-t border-white/10">
                    <td className="max-w-[520px] truncate px-5 py-4 text-white/80">
                      <a
                        href={item.originalUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-white hover:underline"
                      >
                        {item.originalUrl}
                      </a>
                    </td>
                    <td className="px-5 py-4 text-white/85">
                      
                      <button
  onClick={() => openShortUrl(item)}
  className="inline-flex items-center gap-1 text-white/85 hover:text-blue-300"
>
  {item.shortCode}
  <ExternalLink size={13} />
</button>

                    </td>
                    <td className="px-5 py-4 text-center text-white/85">
                      {item.clicks}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-center gap-4">
                        <button
                          title="Copy short URL"
                          onClick={() => copy(item.shortCode)}
                          className="text-white/85 transition hover:text-white"
                        >
                          {copied === item.shortCode ? (
                            <Check size={20} />
                          ) : (
                            <Clipboard size={20} />
                          )}
                        </button>
                        <button
                          title="Delete"
                          onClick={() => remove(item._id)}
                          className="text-red-400 transition hover:text-red-300"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {urls.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-5 py-10 text-center text-sm text-white/45"
                    >
                      No shortened URLs yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <footer className="flex min-h-[90px] items-center justify-center border-b-4 border-white/10 text-sm text-white/90">
          Copyright © URLShortner | Dipesh Malvia
        </footer>
      </main>
    </div>
  );
}
