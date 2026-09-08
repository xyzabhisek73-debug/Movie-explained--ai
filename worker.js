export default {
  async fetch(request, env) {
    // CORS
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
        }
      });
    }

    // Upload endpoint
    if (request.method === "POST") {
      try {
        const formData = await request.formData();
        const file = formData.get("file");

        if (!file) {
          return new Response(
            JSON.stringify({ error: "No video file received" }),
            {
              status: 400,
              headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
              }
            }
          );
        }

        const fileName =
          Date.now() + "-" + file.name.replace(/[^a-zA-Z0-9._-]/g, "_");

        await env.MOVIE_BUCKET.put(fileName, file.stream(), {
          httpMetadata: {
            contentType: file.type || "video/mp4"
          }
        });

        return new Response(
          JSON.stringify({
            success: true,
            message: "Movie uploaded successfully",
            fileName: fileName
          }),
          {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*"
            }
          }
        );
      } catch (error) {
        return new Response(
          JSON.stringify({
            error: "Upload failed",
            details: error.message
          }),
          {
            status: 500,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*"
            }
          }
        );
      }
    }

    return new Response("Movie Explained AI API is running.");
  }
};
