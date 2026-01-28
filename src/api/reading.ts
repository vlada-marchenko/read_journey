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

export type TimeLeft = {
    hours: number,
    minutes: number,
    seconds: number
}

export type Book = {
    _id: string;
    title: string;
    author: string;
    imageUrl: string;
    totalPages: number;
    status: ReadingStatus;
    owner: string;
    progress: Progress[]
    timeLeftToRead?: TimeLeft
}

 type StartReadingBody = {
    id: string,
    page: number
}

type StopReadingBody = {
    id: string,
    page: number
}

type DeleteReadingBody = {
    bookId: string,
    readingId: string
}

export async function getBook(id: string): Promise<Book> {
    const { data } = await http.get<Book>(`/books/${id}`)
    return data
}

export async function startReading(body: StartReadingBody): Promise<Book> {
    const { data } = await http.post('/books/reading/start', body)
    return data
}

export async function stopReading(body: StopReadingBody): Promise<Book> {
    const { data } = await http.post('/books/reading/finish', body)
    return data
}

export async function deleteReading({ bookId, readingId }: DeleteReadingBody) {
    await http.delete(`/books/reading`, {
        params: { bookId, readingId }
    })
}