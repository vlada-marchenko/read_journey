import css from "./Reading.module.css";
import { AddReading } from "../../components/AddReading/AddReading";
import { useEffect, useState, useMemo } from "react";
import type { Book } from "../../api/reading";
import { getBook } from "../../api/reading";
import { useParams } from "react-router-dom";
import { Details } from "../../components/Details/Details";

export default function Reading() {
  const [book, setBook] = useState<Book | null>(null);
  const { bookId } = useParams<{ bookId: string }>();
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
        <AddReading book={book} isReading={isReading} onBookUpdate={setBook} />
        {!hasProgress ? (
            <div className={css.progress}>
                <h3 className={css.title}>Progress</h3>
                <p className={css.text}>Here you will see when and how much you read. To record, click on the red button above.</p>
                <div className={css.circle}>
                    <span className={css.emojii}>🌟</span>
                </div>
            </div>
        ) : <Details/>}
      </div>
    </div>
  );
}
