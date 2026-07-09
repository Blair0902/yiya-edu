// Streams an image from an SSE endpoint that yields OpenAI-style
// `image_generation.partial_image` / `image_generation.completed` events.
// Calls onFrame(dataUrl, isFinal) each time a b64 frame arrives.
export async function streamImage(
  endpoint: string,
  prompt: string,
  onFrame: (dataUrl: string, isFinal: boolean) => void,
): Promise<void> {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
  if (!res.ok || !res.body) {
    throw new Error(`Image gen failed: ${res.status} ${await res.text().catch(() => "")}`);
  }
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    const parts = buf.split("\n\n");
    buf = parts.pop() ?? "";
    for (const chunk of parts) {
      for (const line of chunk.split("\n")) {
        if (!line.startsWith("data:")) continue;
        const payload = line.slice(5).trim();
        if (!payload || payload === "[DONE]") continue;
        try {
          const evt = JSON.parse(payload);
          const b64 =
            evt?.data?.[0]?.b64_json ??
            evt?.b64_json ??
            evt?.image?.b64_json ??
            evt?.partial_image_b64 ??
            null;
          if (b64) {
            const isFinal =
              evt?.type === "image_generation.completed" ||
              evt?.type === "response.image_generation.completed" ||
              evt?.status === "completed";
            onFrame(`data:image/png;base64,${b64}`, isFinal);
          }
        } catch {
          /* ignore parse errors on keepalive frames */
        }
      }
    }
  }
}
