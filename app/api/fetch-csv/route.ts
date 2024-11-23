export async function POST(req: Request) {
  const { url } = await req.json()

  if (url === undefined || url === "") {
    console.log("Invalid request")
    return new Response(JSON.stringify({ message: "Invalid request" }), {
      status: 400,
    })
  }

  try {
    const response = await fetch(url)
    const data = await response.text()

    return Response.json({ data }, { status: 200 })
  } catch (error) {
    console.error(error)
    return Response.json(
      { message: "Error processing request" },
      { status: 500 }
    )
  }
}
