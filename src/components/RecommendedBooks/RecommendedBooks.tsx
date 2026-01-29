import css from "./RecommendedBooks.module.css";
import { useEffect, useMemo, useState } from "react";
import {
  fetchRecommendedBooks,
  addRecommendedBook,
} from "../../api/recommended";
import type { Book } from "../../api/recommended";
import Icon from "../Icon/Icon";
import ClipLoader from "react-spinners/ClipLoader";
import { getMyBooks } from "../../api/library";
import { toast } from "react-toastify";
import { createPortal } from "react-dom";

type Filters = {
  title: string;
  author: string;
};

type Props = {
  filters?: Filters;
  fixedCount?: number;
  showPagination?: boolean;
  variant?: "home" | "library";
  footer?: React.ReactNode;
};

function Loader() {
  return (
    <div className={css.loader}>
      <ClipLoader size={40} color="#ffffff" />
    </div>
  );
}

function getPerPage() {
  const w = document.documentElement.clientWidth;
  if (w < 768) return 2;
  if (w < 1440) return 8;
  return 10;
}

export function RecommendedBooks({
  filters,
  fixedCount,
  showPagination,
  variant = "home",
  footer,
}: Props) {
  const [page, setPage] = useState(1);
  const [books, setBooks] = useState<Book[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [myBookKeys, setMyBookKeys] = useState<Set<string>>(new Set());

  const isFixed = typeof fixedCount === "number";
  const [perPage, setPerPage] = useState(() =>
    isFixed ? fixedCount! : getPerPage(),
  );

  const goPrev = page > 1;
  const goNext = page < totalPages;

  function norm(s: string) {
    return s.trim().toLowerCase();
  }
  function keyOf(b: { title: string; author: string }) {
    return `${norm(b.title)}|||${norm(b.author)}`;
  }

  useEffect(() => {
    if (isFixed) return;

    const onResize = () => {
      setPerPage(getPerPage());
    };
    window.addEventListener("resize", onResize);
    onResize();
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [isFixed]);

  useEffect(() => {
    if (isFixed) return;
    setPage(1);
  }, [perPage, isFixed]);

  const params = useMemo(
    () => ({
      page: isFixed ? 1 : page,
      limit: perPage,
      title: filters?.title ?? "",
      author: filters?.author ?? "",
    }),
    [page, perPage, filters?.title, filters?.author, isFixed],
  );

  useEffect(() => {
    if (variant !== "library") return;

    (async () => {
      try {
        const my = await getMyBooks();
        setMyBookKeys(new Set(my.map((b) => keyOf(b))));
      } catch (e) {
        console.error("Failed to load my books for duplicate check", e);
      }
    })();
  }, [variant]);

  useEffect(() => {
    let fetching = true;

    async function load() {
      try {
        setIsLoading(true);
        setError(null);

        const data = await fetchRecommendedBooks(params);

        if (!fetching) return;

        setBooks(data.results);
        console.log(
          "limit sent:",
          params.limit,
          "results len:",
          data.results.length,
        );
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

    if (variant === "library" && myBookKeys.has(keyOf(selectedBook))) {
      toast("This book is already in your library.");
      return;
    }

    try {
      setIsAdding(true);
      await addRecommendedBook(selectedBook._id);
      setMyBookKeys((prev) => {
        const next = new Set(prev);
        next.add(keyOf(selectedBook));
        return next;
      });

      window.dispatchEvent(new Event("library:changed"));
      closeModal();
    } catch (err) {
      setIsAdding(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const status = (err as any)?.response?.status;
      if (status === 409) {
        toast("This book is already in your library.");
        window.dispatchEvent(new Event("library:changed"));
        closeModal();
        return;
      }

      console.error(err);
      toast("Failed to add book to your collection");
    }
  }

  return (
    <>
      <div className={css.container}>
        <div
          className={`${css.window} ${variant === "library" ? css.windowLibrary : ""}`}
        >
          <div
            className={`${css.top} ${variant === "library" ? css.topLibrary : ""}`}
          >
            <h2 className={css.title}>Recommended</h2>
            {!showPagination && !isFixed && (
              <div className={css.pagination}>
                <button
                  className={css.arrow}
                  type="button"
                  onClick={() => setPage(page - 1)}
                  disabled={!goPrev}
                >
                  <Icon
                    className={css.icon}
                    name="arrow-left"
                    width={10}
                    height={10}
                  />
                </button>
                <button
                  className={css.arrow}
                  type="button"
                  onClick={() => setPage(page + 1)}
                  disabled={!goNext}
                >
                  <Icon
                    className={css.icon}
                    name="arrow-right"
                    width={10}
                    height={10}
                  />
                </button>
              </div>
            )}
          </div>
          {error ? (
            <p className={css.error}>{error}</p>
          ) : (
            <ul
              className={[
                css.items,
                isLoading ? css.itemsLoading : "",
                variant === "library" ? css.itemsLibrary : "",
              ].join(" ")}
            >
              {books.map((book) => (
                <li
                  key={book._id}
                  className={`${css.item} ${variant === "library" ? css.itemLibrary : ""}`}
                >
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
                    />
                  </button>
                  <div className={css.bookInfo}>
                    <h3 className={css.bookTitle}>{book.title}</h3>
                    <p className={css.bookAuthor}>{book.author}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {isLoading && <Loader />}
          {variant === "library" && footer}

          {isModalOpen &&
            selectedBook &&
            createPortal(
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
                    <Icon name="close" width={22} height={22} />
                  </button>
                  <div className={css.modalContent}>
                    <div className={css.modalItem}>
                      <img
                        src={selectedBook.imageUrl}
                        alt={selectedBook.title}
                        className={css.modalImage}
                      />
                      <h3 className={css.bookTitleModal}>
                        {selectedBook.title}
                      </h3>
                      <p className={css.bookAuthor}>{selectedBook.author}</p>
                      <span className={css.pages}>
                        {selectedBook.totalPages} pages
                      </span>
                    </div>
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
              </div>,
              document.getElementById("modal-root")!,
            )}
        </div>
      </div>
    </>
  );
}
