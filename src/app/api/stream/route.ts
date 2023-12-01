import axios from "axios";


export async function POST(message: string): Promise<Response> {
  const endpoint = "http://localhost:8000/test_request";
  try {
    const response = await axios.post(endpoint, message);

    return new Response(response.data);
  } catch (error) {
    // エラー処理
    console.error('Error:', error);
    return new Response('Error occurred', { status: 500 });
  }
}