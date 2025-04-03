export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathPrompt = decodeURIComponent(url.pathname.slice(1)).trim();

    // 如果是根路径，返回一个 HTML 表单，表单提交后使用路径方式传递参数
    if (url.pathname === "/") {
      return new Response(`
        <html>
        <body>
          <form action="/generate/" method="get">
            <label for="prompt">Enter your prompt:</label>
            <input type="text" id="prompt" name="prompt" required>
            <button type="submit">Generate</button>
          </form>
        </body>
        </html>
      `, {
        headers: { "content-type": "text/html" }
      });
    }

    // 处理 /generate 路径，支持查询参数或路径方式传递 prompt
    if (url.pathname.startsWith("/generate")) {
      const queryPrompt = url.searchParams.get("prompt");
      const prompt = queryPrompt || pathPrompt || "cyberpunk woman, china, long hair";
      const inputs = { prompt };

      try {
        const response = await env.AI.run(
          "@cf/stabilityai/stable-diffusion-xl-base-1.0",
          inputs,
        );

        if (!response) {
          return new Response("AI generation failed: empty response", { status: 500 });
        }

        return new Response(response, {
          headers: {
            "content-type": "image/png",
          },
        });
      } catch (error) {
        return new Response(`AI generation error: ${error.message}`, { status: 500 });
      }
    }

    return new Response("Not Found", { status: 404 });
  },
} satisfies ExportedHandler<Env>;
