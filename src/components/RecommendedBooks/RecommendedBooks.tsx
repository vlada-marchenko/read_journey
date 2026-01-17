import css from './RecommendedBooks.module.css'
import { useEffect, useMemo, useState } from 'react';
import {  fetchRecommendedBooks, addRecommendedBook} from '../../api/recommended'
import type { Book } from '../../api/recommended';
import { set } from 'react-hook-form';

function getPerPage() {
    if(window.innerWidth < 768) return 2
    if(window.innerWidth < 1440) return 8
    return 10
}

export function RecommendedBooks() {
    const [page, setPage] = useState(1)
    const [perPage, setPerPage] = useState(getPerPage())
    const [books, setBooks] = useState<Book[]>([])
    const [totalPages, setTotalPages] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedBook, setSelectedBook] = useState<Book | null>(null)
    const [isAdding, setIsAdding] = useState(false)

    const goPrev = page > 1
    const goNext = page < totalPages
    

    useEffect(() => {
        const onResize = () => {
            setPerPage(getPerPage())
        }
        window.addEventListener('resize', onResize)
        onResize()
        return () => {
            window.removeEventListener('resize', onResize)}
    }, [])

    useEffect(() => {
        setPage(1)
    }, [perPage])

    const params = useMemo(() => ({
        page,
        perPage,
        title: '',
        author: ''
    }), [page, perPage])

    useEffect(() => {
        let fetching = true

        async function load() {
            try {
                setIsLoading(true)
                setError(null)

                const data  = await fetchRecommendedBooks(params)

                if(!fetching) return 

                setBooks(data.results)
                setTotalPages(data.totalPages || 1)

                if (data.totalPages && page > data.totalPages) {
                    setPage(data.totalPages)
                }
            } catch (err) {
                if (!fetching) return
                setError('Failed to download recomneded books') 
                console.error(err)
            } finally {
                setIsLoading(false)
            }
        }

        load()
        return () => {
            fetching = false
        }
    },[params, page])

    function openModal(book: Book) {
        setSelectedBook(book)
        setIsModalOpen(true)
    }

    function closeModal() {
        setIsModalOpen(false)
        setSelectedBook(null)
        setIsAdding(false)
    }

    useEffect(() => {
        if (!isModalOpen) return

        function onKeyDown(e: KeyboardEvent) {
            if (e.key === 'Escape') {
                closeModal()
            }
        }
        
        window.addEventListener('keydown', onKeyDown)
        return () => {
            window.removeEventListener('keydown', onKeyDown)
        }
    }, [isModalOpen])

    async function handleAddBook() {
        if (!selectedBook) return

        try {
            setIsAdding(true)
            await addRecommendedBook(selectedBook._id)
            closeModal()
        } catch (err) {
            setIsAdding(false)
            console.error(err)
            alert('Failed to add book to your collection')
        }
    }

return (
    <div>
        <h2 className={css.title}>Recommended</h2>
    </div>
)
}