import css from "./Reading.module.css";
import { AddReading } from "../../components/AddReading/AddReading";
import { useEffect, useState, useMemo } from "react";
import type { Book } from "../../api/reading";
import {  getBook } from "../../api/reading";
import { useParams } from "react-router-dom";
import { Details } from "../../components/Details/Details";
import { MyBook } from "../../components/MyBook/MyBook";
import Icon from "../../components/Icon/Icon";

export default function Reading() {
  const [book, setBook] = useState<Book | null>(null);
  const { bookId } = useParams<{ bookId: string }>();
  const [finishedOpen, setFinishedOpen] = useState(false)

    const hasProgress = (book?.progress?.length ?? 0) > 0

  useEffect(() => {
    if (!bookId) return;

    (async () => {
      try {
        const data = await getBook(bookId);
        setBook(data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [bookId]);

  const isReading = useMemo(
    () => !!book?.progress?.some((p) => p.status === "active"),
    [book],
  );


function closeFinished() {
  setFinishedOpen(false)
}

  function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) closeFinished();
  }

  useEffect(() => {
  if (!finishedOpen) return;
  function onKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape") closeFinished();
  }
  document.addEventListener("keydown", onKeyDown);
  return () => document.removeEventListener("keydown", onKeyDown);
}, [finishedOpen]);

function handleStop(stopPage: number, updatedBook: Book) {
  setBook(updatedBook)

  if(stopPage === updatedBook.totalPages) {
    setFinishedOpen(true)
  }

}

  if (!book) {
    return (
      <div className={css.container}>
        <div className={css.window}>Loading...</div>
      </div>
    );
  }

  return (
    <div className={css.container}>
      <div className={css.window}>
        <AddReading book={book} isReading={isReading} onBookUpdate={setBook} onStop={handleStop}/>
        {!hasProgress ? (
            <div className={css.progress}>
                <h3 className={css.title}>Progress</h3>
                <p className={css.text}>Here you will see when and how much you read. To record, click on the red button above.</p>
                <div className={css.circle}>
                    <span className={css.emojiiStar}>🌟</span>
                </div>
            </div>
        ) : <Details book={book} onBookUpdate={setBook}/>}
      </div>
      <div className={css.windowBook}>
        <MyBook book={book} isReading={isReading}/>
      </div>
      {finishedOpen && (
        <div className={css.backdrop} onClick={handleBackdropClick} aria-modal="true"
        role="dialog">
        <div className={css.modal}>
          <button
            onClick={closeFinished}
            type="button"
            className={css.closeButton}
            aria-label="Close"
          >
            <Icon name="close" width={22} height={22} />
          </button>
          <div className={css.modalContent}>
            <span className={css.emojii}>📚</span>
            <h3 className={css.titleModal}>The book is read</h3>
            <p className={css.textModal}>It was an  <span className={css.span}>exciting journey</span>, where each page revealed new horizons, and the characters became inseparable friends.</p>
          </div>
        </div>
        </div>
      )}
    </div>
  );
}
