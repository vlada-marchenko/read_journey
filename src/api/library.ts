import { http } from "./http";

export type ReadingStatus = 'unread' | 'in-progress' | 'done'

export type ProgressStatus = 'active' | 'inactive'

export type Progress = {
    startPage: number;
    startReading: string;
    finishPage?: number;
    finishReading?: string;
    speed?: number;
    status: ProgressStatus
}

export type MyBook = {
    _id: string;
    title: string;
    author: string;
    imageUrl: string;
    totalPages: number;
    status: ReadingStatus;
    owner: string;
    progress: Progress[]
}

export async function getMyBooks(status?: ReadingStatus): Promise<MyBook[]> {
    const { data } = await http.get('books/own', {
        params: status ? { status } : undefined
    })
    return data
}

export async function removeMyBook(id: string): Promise<void> {
    await http.delete(`/books/remove/${id}`)
}