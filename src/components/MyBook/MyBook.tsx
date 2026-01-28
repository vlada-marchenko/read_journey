import css from './MyBook.module.css'
import type { MyBook } from '../../api/library'
import { toast } from 'react-toastify'

type Props = {
    book: MyBook
    isReading: boolean
}

export function MyBook({book, isReading}: Props) {

    if (!book) {
        toast.error('No book exists')
        return 
    }

    return (
        <div className={css.container}>
                <h2 className={css.title}>My reading</h2>
                <div className={css.cover}>
                    <img className={css.image} src={book.imageUrl} alt="book cover" />
                    <h3 className={css.bookTitle}>{book.title}</h3>
                    <span className={css.author}>{book.author}</span>
                    <div className={css.circle}>
                        <div className={`${css.filling} ${isReading ? css.reading : ''}`}></div>
                </div>
            </div>
        </div>
    )
}