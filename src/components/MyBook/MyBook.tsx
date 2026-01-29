import css from './MyBook.module.css'
import type { Book } from '../../api/reading'
import { toast } from 'react-toastify'

type Props = {
    book: Book
    isReading: boolean
}

export function MyBook({book, isReading}: Props) {

    if (!book) {
        toast.error('No book exists')
        return 
    }

    const time = book.timeLeftToRead
    const timeLeft = `${time?.hours} hours ${time?.minutes} minutes`

    return (
        <div className={css.container}>
            <div className={css.window}>
                <div className={css.header}>
                <h2 className={css.title}>My reading</h2>
                {!isReading && time && <span className={css.time}>{timeLeft}</span>}
                </div>
                <div className={css.cover}>
                    <img className={css.image} src={book.imageUrl} alt="book cover" />
                    <h3 className={css.bookTitle}>{book.title}</h3>
                    <span className={css.author}>{book.author}</span>
                    <div className={css.circle}>
                        <div className={`${css.filling} ${isReading ? css.reading : ''}`}></div>
                </div>
            </div>
            </div>
        </div>
    )
}