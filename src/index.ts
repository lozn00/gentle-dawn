export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 如果是根路径，返回一个 HTML 表单
    if (url.pathname === "/") {
      return new Response(`
        <html>
        <body>
          <form action="/generate" method="get" target="_blank">
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

    // 处理 /generate 路径，生成图片
    if (url.pathname === "/generate") {
      const prompt = url.searchParams.get("prompt") || "cyberpunk woman, china, long hair";
      const inputs = { prompt };

      const response = await env.AI.run(
        "@cf/stabilityai/stable-diffusion-xl-base-1.0",
        inputs,
      );

      return new Response(`
        <html>
        <body>
          <h2>Generated Image</h2>
          <img src="data:image/png;base64,${btoa(response)}" alt="Generated Image" />
          <br>
          <a href="/">Go Back</a>
        </body>
        </html>
      `, {
        headers: { "content-type": "text/html" }
      });
    }

    return new Response("Not Found", { status: 404 });
  },
} satisfies ExportedHandler<Env>;
