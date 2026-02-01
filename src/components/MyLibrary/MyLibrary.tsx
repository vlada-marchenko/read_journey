import css from "./MyLibrary.module.css";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { Listbox } from "@headlessui/react";
import Icon from "../Icon/Icon";
import {
  getMyBooks,
  removeMyBook,
  type ReadingStatus,
} from "../../api/library";
import type { MyBook } from "../../api/library";
import cover from "../../assets/cover.png";

const options = ["Unread", "In progress", "Done", "All books"] as const;
type Option = (typeof options)[number];

function optionToStatus(option: Option): ReadingStatus | undefined {
  if (option === "Unread") return "unread";
  if (option === "In progress") return "in-progress";
  if (option === "Done") return "done";
  return undefined;
}

export default function MyLibrary() {
  const navigate = useNavigate();
  const [books, setBooks] = useState<MyBook[]>([]);
  const [value, setValue] = useState<Option>("All books");
  const [, setIsLoading] = useState(false);
  const [selectedBook, setSelectedBook] = useState<MyBook | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      const status = optionToStatus(value);
      setIsLoading(true);
      try {
        const data = await getMyBooks(status);
        if (mounted) setBooks(data);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    load();

    function onLibraryChanged() {
      load();
    }

    window.addEventListener("library:changed", onLibraryChanged);
    return () => {
      mounted = false;
      window.removeEventListener("library:changed", onLibraryChanged);
    };
  }, [value]);

  async function handleDelete(id: string) {
    await removeMyBook(id);
    setBooks((prev) => prev.filter((b) => b._id !== id));
  }

  function openModal(book: MyBook) {
    setSelectedBook(book);
  }

  function closeModal() {
    setSelectedBook(null);
  }

  function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) closeModal();
  }

  function startReading(book: MyBook) {
    navigate(`/reading/${book._id}`);
    closeModal();
  }

  useEffect(() => {
    if (!selectedBook) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setSelectedBook(null);
    }

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [selectedBook]);

  const modal =
    selectedBook &&
    createPortal(
      <div
        className={css.backdrop}
        onClick={handleBackdropClick}
        aria-modal="true"
        role="dialog"
      >
        <div className={css.modal}>
          <button
            onClick={closeModal}
            type="button"
            className={css.closeButton}
            aria-label="Close"
          >
            <Icon name="close" width={22} height={22} />
          </button>
          <div className={css.modalContent}>
            <div className={css.modalItem}>
              <img
                src={selectedBook.imageUrl || cover}
                alt={selectedBook.title }
                className={css.modalImage}
                onError={(e) => {
                  e.currentTarget.src = cover;
                }}
              />
              <h3 className={css.bookTitleModal}>{selectedBook.title}</h3>
              <p className={css.bookAuthor}>{selectedBook.author}</p>
              <span className={css.pages}>{selectedBook.totalPages} pages</span>
            </div>
            <button
              className={css.addBookButton}
              type="button"
              onClick={() => startReading(selectedBook)}
            >
              Start reading
            </button>
          </div>
        </div>
      </div>,
      document.getElementById("modal-root")!,
    );

  return (
    <div className={css.container}>
      <div className={css.window}>
        <div className={css.header}>
          <h2 className={css.title}>My Library</h2>
          <div className={css.wrap}>
            <Listbox value={value} onChange={setValue}>
              <Listbox.Button className={css.button}>
                {value}
                <Icon name="arrow-down" width={16} height={16} />
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
                <button
                  className={css.imgButton}
                  type="button"
                  onClick={() => openModal(book)}
                >
                  <img
                    className={css.image}
                    src={book.imageUrl || cover}
                    alt="book cover"
                    onError={(e) => {
                      e.currentTarget.src = cover;
                    }}
                  />
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
                    <Icon
                      name="trash"
                      className={css.icon}
                      width={14}
                      height={14}
                    />
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
                To start training, add{" "}
                <span className={css.span}>some of your books</span> or from the
                recommended ones
              </p>
            </div>
          </div>
        )}

        {modal}
      </div>
    </div>
  );
}
