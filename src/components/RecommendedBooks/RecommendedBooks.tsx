import css from "./RecommendedBooks.module.css";
import { useEffect, useMemo, useState } from "react";
import {
  fetchRecommendedBooks,
  addRecommendedBook,
} from "../../api/recommended";
import type { Book } from "../../api/recommended";
import Icon from "../Icon/Icon";

function getPerPage() {
  const w = document.documentElement.clientWidth;
  if (w < 768) return 2;
  if (w < 1440) return 8;
  return 10;
}

export function RecommendedBooks() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(() => getPerPage());
  const [books, setBooks] = useState<Book[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const goPrev = page > 1;
  const goNext = page < totalPages;

  useEffect(() => {
    const onResize = () => {
      setPerPage(getPerPage());
    };
    window.addEventListener("resize", onResize);
    onResize();
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    setPage(1);
  }, [perPage]);

  const params = useMemo(
    () => ({
      page,
      limit: perPage,
      title: "",
      author: "",
    }),
    [page, perPage]
  );

  useEffect(() => {
    let fetching = true;

    async function load() {
      try {
        setIsLoading(true);
        setError(null);

        const data = await fetchRecommendedBooks(params);

        if (!fetching) return;

        setBooks(data.results);
        console.log("limit sent:", params.limit, "results len:", data.results.length);
        setTotalPages(data.totalPages || 1);

        if (data.totalPages && page > data.totalPages) {
          setPage(data.totalPages);
        }
      } catch (err) {
        if (!fetching) return;
        setError("Failed to download recomneded books");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    load();
    return () => {
      fetching = false;
    };
  }, [params]);

  function openModal(book: Book) {
    setSelectedBook(book);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setSelectedBook(null);
    setIsAdding(false);
  }

  useEffect(() => {
    if (!isModalOpen) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        closeModal();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isModalOpen]);

  async function handleAddBook() {
    if (!selectedBook) return;

    try {
      setIsAdding(true);
      await addRecommendedBook(selectedBook._id);
      closeModal();
    } catch (err) {
      setIsAdding(false);
      console.error(err);
      alert("Failed to add book to your collection");
    }
  }

  return (
    <>
      <div className={css.container}>
        <div className={css.window}>
          <div className={css.top}>
            <h2 className={css.title}>Recommended</h2>
            <div className={css.pagination}>
              <button
                className={css.arrow}
                type="button"
                onClick={() => setPage(page - 1)}
                disabled={!goPrev}
              >
                <Icon className={css.icon} name="arrow-left" width={10} height={10}/>
              </button>
              <button
                className={css.arrow}
                type="button"
                onClick={() => setPage(page + 1)}
                disabled={!goNext}
              >
                <Icon className={css.icon} name="arrow-right" width={10} height={10} />
              </button>
            </div>
          </div>
          {error && <p className={css.error}>{error}</p>}
          {isLoading ? <p>Loading...</p> : <ul className={css.items}>
            {books.map((book) => (
              <li key={book._id} className={css.item}>
                <button
                  className={css.bookButton}
                  type="button"
                  onClick={() => openModal(book)}
                  aria-label={`Open details for ${book.title}`}
                >
                  <img
                    src={book.imageUrl}
                    alt={book.title}
                    className={css.bookImage}
                    width={137}
                    height={208}
                  />
                </button>
                <div className={css.bookInfo}>
                  <h3 className={css.bookTitle}>{book.title}</h3>
                  <p className={css.bookAuthor}>{book.author}</p>
                </div>
              </li>
            ))}
          </ul>}

          {isModalOpen && selectedBook && (
            <div
              className={css.backdrop}
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  closeModal();
                }
              }}
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
                  <Icon name="close" />
                </button>
                <div className={css.modalContent}>
                  <img
                    src={selectedBook.imageUrl}
                    alt={selectedBook.title}
                    className={css.modalImage}
                    width={137}
                    height={208}
                  />
                  <h3 className={css.bookTitle}>{selectedBook.title}</h3>
                  <p className={css.bookAuthor}>{selectedBook.author}</p>
                  <span className={css.pages}>
                    {selectedBook.totalPages} pages
                  </span>
                  <button
                    className={css.addBookButton}
                    type="button"
                    onClick={handleAddBook}
                    disabled={isAdding}
                  >
                    Add to my library
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
