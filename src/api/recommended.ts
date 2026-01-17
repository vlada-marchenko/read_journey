import { http } from "./http";

export type Book = {
    _id: string;
    title: string;
    author: string;
    imageUrl: string;
    totalPages: number;
    recommend: boolean
}

export type RecommendedResponse = {
    results: Book[];
    totalPages: number;
    page: number;
    perPage: number
}

export async function fetchRecommendedBooks(params: {
    page: number;
    limit: number;
    title: string;
    author: string
}): Promise<RecommendedResponse> {
    const { data } = await http.get<RecommendedResponse>('/books/recommend', {
        params,
    })
    return data
}

export async function addRecommendedBook(id: string) {
    const { data } = await http.post(`/books/add/${id}`)
    return data
}

export async function fetchBookById(id: string): Promise<Book> {
    const { data } = await http.get<Book>(`/books/${id}`)
    return data
}