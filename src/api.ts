const API_BASE_URL = "http://localhost:3001/api/v1";

// Auth token management
export const getToken = (): string | null => {
    return localStorage.getItem("token");
};

export const setToken = (token: string): void => {
    localStorage.setItem("token", token);
};

export const removeToken = (): void => {
    localStorage.removeItem("token");
};

export const isAuthenticated = (): boolean => {
    return !!getToken();
};

// API helper with auth header
const authFetch = async (
    url: string,
    options: RequestInit = {}
): Promise<Response> => {
    const token = getToken();
    const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
    };

    if (token) {
        (headers as Record<string, string>)[
            "Authorization"
        ] = `Bearer ${token}`;
    }

    return fetch(url, {
        ...options,
        headers,
    });
};

// Auth API
export const signUp = async (
    username: string,
    password: string
): Promise<{ success: boolean; message: string }> => {
    try {
        const response = await fetch(`${API_BASE_URL}/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            return { success: true, message: "User created successfully" };
        }
        const message = await response.text();
        return { success: false, message };
    } catch (error) {
        return { success: false, message: "Network error" };
    }
};

export const signIn = async (
    username: string,
    password: string
): Promise<{ success: boolean; token?: string; message?: string }> => {
    try {
        const response = await fetch(`${API_BASE_URL}/signin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            const token = await response.text();
            setToken(token);
            return { success: true, token };
        }
        const message = await response.text();
        return { success: false, message };
    } catch (error) {
        return { success: false, message: "Network error" };
    }
};

export const signOut = (): void => {
    removeToken();
};

// Content API
export interface ContentItem {
    _id: string;
    title: string;
    type: "twitter" | "youtube";
    link: string;
    tags: { _id: string; name: string }[] | string[];
    userId: string;
}

export const getContent = async (): Promise<ContentItem[]> => {
    try {
        const response = await authFetch(`${API_BASE_URL}/content`);
        if (response.ok) {
            return await response.json();
        }
        return [];
    } catch (error) {
        console.error("Failed to fetch content:", error);
        return [];
    }
};

export const createContent = async (data: {
    title: string;
    link: string;
    type: "twitter" | "youtube";
    tags: string;
}): Promise<{ success: boolean; message: string }> => {
    try {
        const response = await authFetch(`${API_BASE_URL}/content`, {
            method: "POST",
            body: JSON.stringify(data),
        });

        if (response.ok) {
            return { success: true, message: "Content created" };
        }
        return { success: false, message: "Failed to create content" };
    } catch (error) {
        return { success: false, message: "Network error" };
    }
};

export const deleteContent = async (
    id: string
): Promise<{ success: boolean }> => {
    try {
        const response = await authFetch(`${API_BASE_URL}/content/${id}`, {
            method: "DELETE",
        });
        return { success: response.ok };
    } catch (error) {
        return { success: false };
    }
};

// Tags API
export interface Tag {
    _id: string;
    name: string;
    userId: string;
}

export const getTags = async (): Promise<Tag[]> => {
    try {
        const response = await authFetch(`${API_BASE_URL}/tags`);
        if (response.ok) {
            return await response.json();
        }
        return [];
    } catch (error) {
        console.error("Failed to fetch tags:", error);
        return [];
    }
};

// Share API
export const enableSharing = async (): Promise<{
    success: boolean;
    hash?: string;
}> => {
    try {
        const response = await authFetch(`${API_BASE_URL}/brain/share`, {
            method: "POST",
            body: JSON.stringify({ share: true }),
        });

        if (response.ok) {
            const data = await response.json();
            return { success: true, hash: data.hash };
        }
        return { success: false };
    } catch (error) {
        return { success: false };
    }
};

export const disableSharing = async (): Promise<{ success: boolean }> => {
    try {
        const response = await authFetch(`${API_BASE_URL}/brain/share`, {
            method: "POST",
            body: JSON.stringify({ share: false }),
        });
        return { success: response.ok };
    } catch (error) {
        return { success: false };
    }
};

export const getSharedBrain = async (
    shareLink: string
): Promise<ContentItem[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/brain/${shareLink}`);
        if (response.ok) {
            const data = await response.json();
            return data.content || [];
        }
        return [];
    } catch (error) {
        console.error("Failed to fetch shared brain:", error);
        return [];
    }
};
