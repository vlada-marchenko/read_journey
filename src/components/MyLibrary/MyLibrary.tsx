import css from "./MyLibrary.module.css";
import { useEffect, useState } from "react";
// import { getMyBooks } from "../../api/mylibrary";
// import Icon from "../Icon/Icon";
import { Listbox } from "@headlessui/react";
import Icon from "../Icon/Icon";

type Book = {
  id: string;
  title: string;
  author: string;
  totalPages: number;
};

type Option = (typeof options)[number];

const options = ["Unread", "In progress", "Done", "All books"] as const;

export default function MyLibrary() {
  const [books, setBooks] = useState<Book[]>([]);
  const [value, setValue] = useState<Option>('All books');
//   const [isLoading, setIsLoading] = useState(false);

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

        <ul className={css.list}>
          {books.length > 0 ? (
            books.map((book) => (
              <li key={book.id}>
                <span>{book.title}</span>
                <span>{book.author}</span>
              </li>
            ))
          ) : (
            <div className={css.emptyState}>
              <div className={css.circle}>
                <span className={css.emojii}>📚</span>
              </div>
              <p className={css.text}>To start training, add <span className={css.span}>some of your books</span> or from the recommended ones</p>
            </div>
          )}
        </ul>
      </div>
    </div>
  );
}
