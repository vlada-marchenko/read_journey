import type { MyBook } from "../../api/library"

type Props = {
    book: MyBook
}


export function Details({book}: Props) {
    return (
        <div>Details {book.title}</div>
    )
}