import css from "./MyLibrary.module.css";
import { useEffect, useState } from "react";
// import { getMyBooks } from "../../api/mylibrary";
// import Icon from "../Icon/Icon";
import { Listbox } from "@headlessui/react";
import Icon from "../Icon/Icon";
import { getMyBooks, removeMyBook, type ReadingStatus } from "../../api/library";
import type { MyBook } from "../../api/library";


const options = ["Unread", "In progress", "Done", "All books"] as const;
type Option = (typeof options)[number];

function optionToStatus(option: Option): ReadingStatus | undefined {
  if (option === 'Unread') return 'unread';
  if (option === 'In progress') return 'in-progress';
  if (option === 'Done') return 'done';
  return undefined
}

export default function MyLibrary() {
  const [books, setBooks] = useState<MyBook[]>([]);
  const [value, setValue] = useState<Option>('All books');
  const [, setIsLoading] = useState(false);

useEffect(() => {
  const status = optionToStatus(value);

  // eslint-disable-next-line no-unexpected-multiline
  (async () => {
    setIsLoading(true);
    try {
      const data = await getMyBooks(status)
      setBooks(data);
    } finally {
      setIsLoading(false)
    }
  })()
}, [value])

async function handleDelete(id: string) {
  await removeMyBook(id)
  setBooks((prev) => prev.filter((b) => b._id !== id))
}

  return (
    <div className={css.container}>
      <div className={css.window}>
        <div className={css.header}>
          <h2 className={css.title}>My Library</h2>
          <div className={css.wrap}>
            <Listbox value={value} onChange={setValue}>
              <Listbox.Button className={css.button}>
                {value}
                <Icon name='arrow-down' width={16} height={16}/>
                </Listbox.Button>
              <Listbox.Options className={css.options}>
{options.map((option) => (
    <Listbox.Option key={option} value={option}>
      {({ selected, active }) => (
        <div
          className={[
            css.option,
            selected ? css.active : "",
            active ? css.active : "",
          ].join(" ")}
        >
          {option}
        </div>
      )}
    </Listbox.Option>
  ))}
              </Listbox.Options>
            </Listbox>
          </div>
        </div>
{books.length > 0 ? (
  <ul className={css.list}>
    {books.map((book) => (
      <li key={book._id} className={css.item}>
        <button className={css.imgButton}>
        <img className={css.image} src={book.imageUrl} alt="book cover" />
                </button>
        <div className={css.bookInfo}>
          <div className={css.info}>
            <span className={css.titleItem}>{book.title}</span>
            <span className={css.author}>{book.author}</span>
          </div>

          <button
            className={css.delete}
            onClick={() => handleDelete(book._id)}
            type="button"
          >
            <Icon name="trash" className={css.icon} width={14} height={14} />
          </button>
        </div>
      </li>
    ))}
  </ul>
) : (
  <div className={css.emptyCover}>
    <div className={css.emptyState}>
      <div className={css.circle}>
        <span className={css.emojii}>📚</span>
      </div>
      <p className={css.text}>
        To start training, add <span className={css.span}>some of your books</span> or from the
        recommended ones
      </p>
    </div>
  </div>
)}

      </div>
    </div>
  );
}
