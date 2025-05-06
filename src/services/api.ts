interface CreateChatResponse {
  chatId: string;
  message: string;
}

interface GetResponseRawResult {
  error?: string;
  raw?: string;
  message?: string;
}

export const createChat = async (prompt: string): Promise<CreateChatResponse> => {
  try {
    const response = await fetch('https://noox.ooguy.com:5030/api/crear-chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating chat:', error);
    throw error;
  }
};

export const getResponse = async (chatId: string): Promise<GetResponseRawResult> => {
  try {
    const response = await fetch('https://noox.ooguy.com:5030/api/obtener-respuesta', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ chatId }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const result = await response.json();

    // If we get the "no messages" response, wait 4 seconds and retry
    if (result.message === "No se encontraron mensajes en la respuesta.") {
      await new Promise(resolve => setTimeout(resolve, 4000));
      return getResponse(chatId); // Recursive retry
    }

    // If we have an error with raw content, extract the raw
    if (result.error === "No se pudo convertir la respuesta a JSON" && result.raw) {
      return { raw: result.raw };
    }

    // If we have a direct message response, return it
    if (result.message && !result.error) {
      return { raw: result.message };
    }

    return result;
  } catch (error) {
    console.error('Error getting response:', error);
    throw error;
  }
};